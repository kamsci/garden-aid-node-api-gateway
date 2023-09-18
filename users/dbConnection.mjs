// MongoDB & Mongoose
import mongoose from 'mongoose';

let connection = null;

const connect = async function() {
    const dbURI = process.env.MONGO_URI;
    
    if (!dbURI) {
        throw new Error('DB not set');
    }
    try {
        // Ensure the Mongoose connection is established or reused existing connection
        if (connection === null) {
            connection = await mongoose.createConnection(dbURI, {
                serverSelectionTimeoutMS: 5000,
                useNewUrlParser: true,       // Use new URL parser
                useUnifiedTopology: true   // Use new server discovery and monitoring engine
            });

            // `await`ing connection after assigning to the `conn` variable
            // to avoid multiple function calls creating new connections
            // await connection.asPromise();
        }

        return connection;
    } catch (err) {
        console.log("Database error", err);
        throw new Error('DB connection failed ' + err?.message || 'Unknown error');
    }
};

export { connect };