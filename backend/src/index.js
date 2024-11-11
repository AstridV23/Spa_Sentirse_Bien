import app from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./DB/connection.js";

dotenv.config(); 

// Ejecuta la conexión a la base de datos
connectDB();

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("Server en puerto", port);
});
