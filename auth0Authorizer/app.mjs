import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUTH0_API_IDENTIFIER = process.env.AUTH0_API_IDENTIFIER;

const client = jwksClient({
  jwksUri: `https://${AUTH0-DOMAIN}/.well-known/jwks.json`
});

function getKey(header, callback){
    client.getSigningKey(header.kid, function(err, key) {
        var signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
    });
}

export const lambdaHandler = async function(event, context, callback){
    const token = event.authorizationToken;

    jwt.verify(token, getKey, {
        audience: AUTH0_API_IDENTIFIER,
        issuer: `https://${AUTH0-DOMAIN}/`,
        algorithms: ['RS256']
    }, function(err, decoded){
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
