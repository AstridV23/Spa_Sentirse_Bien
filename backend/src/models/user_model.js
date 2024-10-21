import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    username: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstname: { 
        type: String,
        trim: true
    },
    lastname: {
        type: String,
        trim: true
    },
    profilepic: {
        type: Buffer,
        contentType: String
    },
    sex: {
        type: String,
        enum: ["hombre", "mujer", "otro"],
    },
    role: {
        type: String,
        enum: ["usuario", "admin", "secretario", "profesional"],
    },
    phone: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

export default model('User', userSchema)