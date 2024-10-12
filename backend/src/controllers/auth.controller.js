import User from '../models/user_model.js'
import bcrypt from 'bcryptjs'
import {createAccessToken} from '../libs/jwt.js';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();

const TOKEN_SECRET = process.env.TOKEN_SECRET;

export const register = async (req, res) => {
    const {email, password, username, phone, sex} = req.body
    
    console.log("Datos recibidos: ", req.body); // muestra los datos que mando el frontend

    try {

        const userFoundByEmail = await User.findOne ({email})
        
        if (userFoundByEmail) 
            return res.status(400).json(["Ya existe un ususario registrado con este email."]);

        const userFoundByUsername = await User.findOne({username})

        if (userFoundByUsername)
            return res.status(400).json(["Ya existe un usuario registrado con este nombre de usuario."])

        const passwordHash = await bcrypt.hash(password, 10)

        const newUser = new User({
            username,
            email,
            phone,
            sex,
            role: "usuario",
            password: passwordHash
        })
    
        const userSaved = await newUser.save();
        const token = await createAccessToken({id: userSaved._id});

        res.cookie('token', token)
        res.json({
            id: userSaved._id,
            username: userSaved.username,
            email: userSaved.email,
            createdAt: userSaved.createdAt,
            updatedAt: userSaved.updatedAt
        })
    }
    catch (error) {
        console.error("Error en el registro:", error);
        res.status(500).json({message: error.message});
    }
};

export const login = async (req, res) => {
    const {email, username, password} = req.body;
    
    try {
        const userFound = await User.findOne({
            $or: [{email}, {username}]
        });

        if (!userFound) return res.status(400).json({message: "User not found"});

        const isMatch = await bcrypt.compare(password, userFound.password);

        if(!isMatch) return res.status(400).json({message: "Invalid credential"});

        const token = await createAccessToken({id: userFound._id});

        res.cookie('token', token);
        res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt
        });
    }
    catch (error) {
        console.error("Error en el registro:", error);
        res.status(500).json({message: error.message});
    }
};

export const logout = (req, res) => {
    res.cookie('token', "", {
        expires: new Date(0)
    })
    return res.sendStatus(200)
}

export const profile = async (req,res) => {
    const userFound = await User.findById(req.user.id)
    
    if (!userFound) return res.status(400).json({message:'Usuario no encontrado'});

    return res.json({
        id: userFound._id,
        username: userFound.username,
        email: userFound.email,
        createdAt: userFound.createdAt,
        updatesAt: userFound.updatedAt
    })
}

export const verifyToken = async (req, res) => {
    const {token} = req.cookies

    if (!token) return res.status(401).json({message: 'No autorizado'});

    jwt.verify(token, TOKEN_SECRET, async (err, user) => {
        if(err) return res.status(401).json({message: 'No autorizado'});

        const userFound = await User.findById(user.id);
        if (!userFound) return res.status(401).json({message: 'No autorizado'});

        return res.json({
            id: userFound._id,
            username: userFound.username,
            email:userFound.email,
        });
    });
}