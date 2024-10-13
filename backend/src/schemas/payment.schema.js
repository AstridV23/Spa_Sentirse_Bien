import { z } from 'zod';

export const paymentSchema = z.object({
  cardType: z.enum(["crédito", "débito"], {
    required_error: "Ingrese el tipo de tarjeta."
  }),

  cardNumber: z.string({
    required_error: "Ingrese el número de tarjeta."
  })
  .length(16, { message: "Ingrese un número de tarjeta válido de 16 dígitos." })
  .regex(/^\d+$/, { message: "El número de tarjeta solo debe contener dígitos." }),

  cardName: z.string({
    required_error: "Ingrese el nombre que aparece en la tarjeta."
  }),

  expirationDate: z.string({
    required_error: "Ingrese la fecha de expiración de la tarjeta."
  })
  .regex(/^(0[1-9]|1[0-2])\/?([0-9]{2}|[0-9]{4})$/, {
    message: "Ingrese una fecha de expiración válida en formato MM/YY o MM/YYYY."
  }),

  cvv: z.string({
    required_error: "El CVV es requerido."
  })
  .length(3, { message: "El CVV debe tener 3 dígitos." })
  .or(z.string().length(4, { message: "El CVV debe tener 4 dígitos." }))
  .regex(/^\d+$/, { message: "El CVV solo debe contener dígitos." }),
});