import { z } from 'zod'

const authorSchema = z.object({
    user: z.string().optional(),
    name: z.string().default('Anónimo')
})

const replySchema = z.object({
    author: authorSchema,
    content: z.string({
        required_error: "El texto de la respuesta es requerido."
    }),
    date: z.string().or(z.date()).optional()
})

export const createCommentSchema = z.object({
    author: authorSchema.optional(),
    content: z.string({
        required_error: "El texto del comentario es requerido."
    }),
     reply: replySchema.optional()
})
