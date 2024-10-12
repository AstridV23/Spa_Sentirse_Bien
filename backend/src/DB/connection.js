import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const uri = process.env.MONGO_URI /*"mongodb://localhost:27017/pruebas*/;

export const connectDB = async () => {
    try {
        await mongoose.connect(uri)
        console.log(">> Conectado a MongoDB con éxito!")
    }catch(error) {
        console.log(">> Error: " + error)
    }
}