import jwt from 'jsonwebtoken'
import dotenv from "dotenv";

// cada que importemos dotenv debemos colocar esta línea, carga las variables de entorno
dotenv.config();

const TOKEN_SECRET = process.env.TOKEN_SECRET;

export const authRequired = (req, res, next) => {
    const {token} = req.cookies;
    
    if (!token) 
        return res.status(401).json({messaga: 'No autorizado'})

        jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
            if (err) return res.status(403).json({mmessage: 'Token inválido'});
            
            req.user = decoded

            next();
    })
}