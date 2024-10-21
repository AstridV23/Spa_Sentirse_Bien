import { z } from 'zod'

export const createBookingSchema = z.object({
    service: z.string({
        required_error: "El servicio es requerido."
    }),
    treatment: z.string({
        required_error: "El tipo de tratamiento es requerido,"
    }),
    date: z.preprocess((arg) => {
        return typeof arg === 'string' ? new Date(arg) : arg;
    }, z.date({
        required_error: "La fecha del tratamiento es requerida."
    })),
    hour: z.string({
        required_error: "La hora del tratamiento es requerida."
    }),
    info: z.string().optional(),
    status: z.enum(["reservado", "pagado", "cancelado", "finalizado"])
        .default("reservado")
        .optional()
})
