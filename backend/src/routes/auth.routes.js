import { Router } from 'express'
import { login, register, registerAdmin, logout, profile, verifyToken, getUsers, getUserById } from "../controllers/auth.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { loginSchema, registerSchema} from "../schemas/auth.schema.js"

const router = Router()

router.post('/register', validateSchema(registerSchema), register);
router.post('/register_admin', authRequired, validateSchema(registerSchema), registerAdmin);
router.post('/login', validateSchema(loginSchema), login);
router.post('/logout', logout);

router.get('/profile', authRequired, profile);
router.get('/verify', verifyToken);
router.get('/users', getUsers)
router.get('/users/role/:role', getUsers);
router.get('/users/:id', getUserById);


export default router 