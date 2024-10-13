import {z} from 'zod' 

export const paymentSchema = z.object({
    cardType: z.string({
        required_error: "Ingrese el tipo de tarjeta."
    }),
    
    cardNumber: z.string({
        required_error: "Ingrese el núemro de tarjeta."
    })
    .min(16, {message: "Ingrese un núemro de tarjeta válido."})
    .max(16, {message: "Ingrese un núemro de tarjeta válido."})
    .regex(/^\d+$/, {message: "Ingrese un núemro de tarjeta válido."}),

    cardName: z.string({
        required_error: "Ingrese el nombre que aparece en la tarjeta."
    }),

    expirationDate: z.date({
        required_error: "Ingrese la fecha de expiración de la tarjeta."
    }),

    cvv: z.string({
        required_error: "CVV es requerido."
    })
    .min(3, {message: "Ingrese un CVV válido."})
    .max(3, {message: "Ingrese un CVV válido."})
})