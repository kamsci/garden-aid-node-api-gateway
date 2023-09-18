const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const dbURI = process.env.MONGO_URI;

let connection = null;

exports.lambdaHandler = async (event, context) => {
    try {
        //add this so you can re-use `conn` between function calls.
        // See https://www.mongodb.com/blog/post/serverless-development-with-nodejs-aws-lambda-mongodb-atlas
        // context.callbackWaitsForEmptyEventLoop = false;

        if (dbURI == null) {
            throw new Error('Database not set');
        }

        if (connection == null) {
            connection = mongoose.createConnection(dbURI, {
              // and tell the MongoDB driver to not wait more than 5 seconds
              // before erroring out if it isn't connected
              serverSelectionTimeoutMS: 5000
            });
        
            // `await`ing connection after assigning to the `conn` variable
            // to avoid multiple function calls creating new connections
            await connection.asPromise();
            connection.model('Test', new mongoose.Schema({ name: String }));
        }
        const M = connection.model('Test');

        const doc = await M.findOne();
        console.log(doc);
    
        return {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'connected to database',
                doc: doc,
            })
        };
    }
    catch (err) {
        console.log(err);
        return {
            'statusCode': 500,
            'body': JSON.stringify({
                message: err.message,
            })
        }
    }
};