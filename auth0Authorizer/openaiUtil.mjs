import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
// Environment variable access
import dotenv from 'dotenv';
dotenv.config();

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUTH0_API_IDENTIFIER = process.env.AUTH0_API_IDENTIFIER;

const client = jwksClient({
  jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`
});

//
// Callbacks not working asynchonously, so we promisify
//
// extract and return the Bearer Token from the Lambda event parameters
function getToken (params) {
    if (!params.type || params.type !== 'TOKEN') {
        throw new Error('Expected "event.type" parameter to have value "TOKEN"');
    }

    const tokenString = params.authorizationToken;
    if (!tokenString) {
        throw new Error('Expected "event.authorizationToken" parameter to be set');
    }

    const match = tokenString.match(/^Bearer (.*)$/);
    if (!match || match.length < 2) {
        throw new Error(`Invalid Authorization token - ${tokenString} does not match "Bearer .*"`);
    }
    return match[1];
}

function getKey(header, callback){
    console.log("getKey Header: ", header);
    client.getSigningKey(header.kid, function(err, key) {
        var signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
    });
}

export const authenticate = async function(event, context, callback){
    const token = getToken(event);
    console.log("Token: ", token);
    if (!token) return callback("Token not provided.");

    jwt.verify(token, getKey, {
        audience: AUTH0_API_IDENTIFIER,
        issuer: `https://${AUTH0_DOMAIN}/`,
        algorithms: ['RS256']
    }, function(err, decoded){
        console.log("Decoded: ", decoded);
        console.log("Error: ", err);
        if(err){
            callback("Unauthorized");
        } else {
            callback(null, generatePolicy(decoded.sub, 'Allow', event.methodArn));
        }
    });
};

function generatePolicy(principalId, effect, resource) {
    return {
        principalId: principalId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [{
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: resource
            }]
        }
    };
}