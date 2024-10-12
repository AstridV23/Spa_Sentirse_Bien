import {z} from 'zod'

export const createServiceSchema = z.object({
    service_name: z.string ({
        required_error: "El nombre de servicio es requerido."
    }),
    service_type: z.string({
        required_error: "El tipo de servicio es requerido."
    }),
    service_description: z.string ({
        required_error: "La descripción es requerida."
    }),
    service_price: z.number({
        required_error: "El precio es requerido"
    })
})