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
    firstname: {  // Corrección del typo 'fistname'
        type: String,
        trim: true
    },
    lastname: {
        type: String,
        trim: true
    },
    profilepic: {
        type: Buffer, // Puedes usar Buffer para imágenes o URL como String
        contentType: String
    },
    sex: {
        type: String,  // Falta definir el tipo
        enum: ["hombre", "mujer", "otro"],
        default: "otro"
    },
    role: {
        type: String,
        enum: ["usuario", "admin", "secretario", "profesional"],
        default: "usuario"
    }
}, {
    timestamps: true
});

export default model('User', userSchema)