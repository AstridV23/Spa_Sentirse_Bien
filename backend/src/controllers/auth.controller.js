import User from '../models/user_model.js'
import bcrypt from 'bcryptjs'
import {createAccessToken} from '../libs/jwt.js';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();

const TOKEN_SECRET = process.env.TOKEN_SECRET;

export const register = async (req, res) => {
    const {email, password, username, firstname, lastname, sex, phone, role} = req.body
    
    try {

        console.log("Verificando si el correo ya está registrado...");
        const userFoundByEmail = await User.findOne({ email });
        
        if (userFoundByEmail)
            return res.status(400).json(["Ya existe un ususario registrado con este email."]);
    
        console.log("Verificando si el nombre de usuario ya está registrado...");
        const userFoundByUsername = await User.findOne({ username });
    
        if (userFoundByUsername)
            return res.status(400).json(["Ya existe un usuario registrado con este nombre de usuario."]);
    
        console.log("Hashing la contraseña...");
        const passwordHash = await bcrypt.hash(password, 10);
    
        console.log("Creando un nuevo usuario...");
        const newUser = new User({
            username,
            firstname,
            lastname,
            email,
            phone,
            sex,
            role,
            password: passwordHash
        })
    
        const userSaved = await newUser.save();

        console.log("debe ser acá")
        const token = await createAccessToken({id: userSaved._id});

        res.cookie('token', token)
        res.json({
            id: userSaved._id,
            username: userSaved.username,
            role: userSaved.role,
            firstname: userSaved.firstname,
            lastname: userSaved.lastname,
            email: userSaved.email,
            phone: userSaved.phone,
            sex: userSaved.sex,
            createdAt: userSaved.createdAt,
            updatedAt: userSaved.updatedAt
        })
    }
    catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const login = async (req, res) => {
    const {username, password} = req.body;
    
    try {
        const userFound = await User.findOne({username: username});

        if (!userFound) return res.status(400).json({message: "No se ha encontrado al usuario."});

        const isMatch = await bcrypt.compare(password, userFound.password);

        if(!isMatch) return res.status(400).json({message: "Correo o contraseña incorrectos."});

        const token = await createAccessToken({id: userFound._id});

        res.cookie('token', token);
        res.json({
            _id: userFound._id,
            username: userFound.username,
            role: userFound.role,
            firstname: userFound.firstname,
            lastname: userFound.lastname,
            email: userFound.email,
            phone: userFound.phone,
            sex: userFound.sex,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt
        });
        console.log(userFound)
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

export const profile = async (req, res) => {
    try {
        // Asumimos que el middleware de autenticación ha añadido el id del usuario a req.user
        const userFound = await User.findById(req.user.id).select('-password');
        
        if (!userFound) return res.status(400).json({message: 'Usuario no encontrado'});

        return res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            firstname: userFound.firstname,
            lastname: userFound.lastname,
            role: userFound.role,
            phone: userFound.phone,
            sex: userFound.sex,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt,
            phone: userFound.phone,
        });
    } catch (error) {
        console.error("Error en el perfil:", error);
        res.status(500).json({message: "Error interno del servidor", error: error.message});
    }
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
            role: userFound.role,
            firstname: userFound.firstname,
            lastname: userFound.lastname,
            email: userFound.email,
            phone: userFound.phone,
            sex: userFound.sex,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt
        });
    });
}

export const getUsers = async (req, res) => {
    const { role } = req.params;  // Capturamos el rol de los parámetros de la solicitud (si existe)

    try {
        // busca los usuarios con ese rol; de lo contrario, trae todos los usuarios
        const users = role ? await User.find({ role }) : await User.find();

        // Si no hay usuarios encontrados
        if (users.length === 0) return res.status(404).json({ 
            message: role ? `No se encontraron usuarios con el rol: ${role}` : 'No se encontraron usuarios.' 
        });
        
        return res.status(200).json(users);
        
    } catch (error) {

        return res.status(500).json({ message: 'Error al obtener usuarios.', error });
    }

};

export const getUserById = async (req, res) => {
    const { id } = req.params; // Obtener el ID de los parámetros de la URL

    try {
        const userFound = await User.findById(id); // Buscar usuario por ID

        if (!userFound) return res.status(404).json({ message: "Usuario no encontrado" });

        return res.status(200).json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener el usuario.', error });
    }
};

