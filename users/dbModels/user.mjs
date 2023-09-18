import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        maxLength: 100,
        required: true,
        unique: true,
    },
    firstName: {
        type: String,
        maxLength: 100,
        required: true,
    },
    lastName: {
        type: String,
        maxLength: 100,
        required: true,
    },
}, { strict: true })
.index({ email: 1});

const User = mongoose.model("User", userSchema);

export {userSchema, User};