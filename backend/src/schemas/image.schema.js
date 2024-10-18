import { z } from 'zod'

export const createImageSchema = z.object({
    url: z.string({
        required_error: "La URL de la imagen es requerida."
    }).url({
        message: "La URL proporcionada no es válida."
    }),
    alt: z.string({
        required_error: "El texto alternativo (alt) es requerido."
    }).min(3, {
        message: "El texto alternativo debe tener al menos 3 caracteres."
    }),
    userId: z.string({
        required_error: "El ID del usuario es requerido."
    }).optional(),
    active: z.boolean().default(true).optional()
})
