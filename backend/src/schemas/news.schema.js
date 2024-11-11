import { z } from 'zod'

export const createNewsSchema = z.object({
    title: z.string({
        required_error: "El título de la noticia es requerido."
    }),
    description: z.string({
        required_error:"La descripción de la noticia es requerida."
    }).max(240, {
        message: "La descripción no debe superar los 240 caracteres."
    }),
    imageURL: z.string().optional(),
    author: z.string(),
})