import { z } from 'zod'

export const createBookingSchema = z.object({
    service: z.string({
        required_error: "El servicio es requerido."
    }),
    treatment: z.string({
        required_error: "El tipo de tratamiento es requerido,"
    }),
    date: z.preprocess((arg) => {
        // Verifica si el dato es un string y lo convierte a tipo Date
        return typeof arg === 'string' ? new Date(arg) : arg;
    }, z.date({
        required_error: "La fecha del tratamiento es requerida."
    })),
    info: z.string().optional()
})