/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */

// Environment variable access
import dotenv from 'dotenv';
dotenv.config();
// MongoDB & Mongoose
import {connect} from './dbConnection.mjs';
import { userSchema } from './dbModels/user.mjs';
import { findUser } from './routes/users-find.mjs';
import { getUsers } from './routes/users-get.mjs';


export const lambdaHandler = async (event, context) => {
    let readyState = 'pending';

    try {
        const pathParts = event.path.split('/').filter(part => part.length > 0);
        const httpMethod = event.httpMethod;

        // Connect our database via mongoose's connection method
        const dbConnection = await connect();
        readyState = dbConnection?.readyState;
        // Establish User model
        (await dbConnection).model('User', userSchema);
        const User = dbConnection.model('User');

        if (pathParts.length === 1) {
            // Return a list of all users
            if (httpMethod === 'GET') {
                return await getUsers(User);
            }
        } else if (pathParts.length === 2 && pathParts[1] === 'find' && httpMethod === 'GET') {
            // Find a user by email
            return await findUser(User, event.queryStringParameters?.email);
        } else {
            // Unknown /user path
            return {
                statusCode: 404,
                body: {
                    message: 'Unknown path',
                    path: pathParts,
                    httpMethod,
                }
            }
        }
    } catch (err) {
        console.log("!ERROR!", err);
        return {
            'statusCode': 500,
            'body': JSON.stringify({
                message: err?.message || err.toString(),
            }),
        };
    }
};
