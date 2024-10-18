import { Router } from 'express'
import { createImage, deleteImage, getAllImages } from "../controllers/image.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createImageSchema, deleteImageSchema } from "../schemas/image.schema.js";

const router = Router()

// Ruta para crear una nueva imagen
router.post('/image', authRequired, validateSchema(createImageSchema), createImage);

// Ruta para eliminar una imagen
router.delete('/image/:id', authRequired, validateSchema(deleteImageSchema), deleteImage);

// Ruta para obtener todas las imágenes (sin paginación)
router.get('/image', getAllImages);


export default router
