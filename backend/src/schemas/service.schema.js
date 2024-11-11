import { z } from 'zod';

export const createServiceSchema = z.object({
    service_name: z.string({
        required_error: "El nombre de servicio es requerido."
    }),
    service_type: z.string({
        required_error: "El tipo de servicio es requerido."
    }),
    service_description: z.string({
        required_error: "La descripción es requerida."
    }),
    service_price: z.number({
        required_error: "El precio es requerido."
    }),
    encargado: z.object({
        id: z.string({
            required_error: "El ID del encargado es requerido."
        }),
        name: z.string({
            required_error: "El nombre del encargado es requerido."
        }),
        email: z.string().email({
            required_error: "El correo electrónico del encargado es requerido y debe ser válido."
        })
    })
});