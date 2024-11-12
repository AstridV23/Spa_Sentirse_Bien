import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();

const TOKEN_SECRET = process.env.TOKEN_SECRET;

export function createAccessToken (payload) {  //Payload 
    
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            TOKEN_SECRET,
        {
            expiresIn: 60*60*24,
        },
        (err, token) => {
            if (err) reject(err)
            resolve(token)
        }
        );
    });
}