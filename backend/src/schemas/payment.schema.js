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
  }).trim().min(1, { message: "El nombre no puede estar vacío." }),

  expirationDate: z.string({
    required_error: "Ingrese la fecha de expiración de la tarjeta."
  })
  .regex(/^(0[1-9]|1[0-2])-\d{2}$/, {
    message: "Ingrese una fecha de expiración válida en formato MM-YY."
  }),

  cvv: z.string({
    required_error: "El CVV es requerido."
  })
  .refine(
    (value) => /^\d{3,4}$/.test(value),
    { message: "El CVV debe tener 3 o 4 dígitos y solo contener números." }
  ),

  cuit: z.string({
    required_error: "El CUIT es requerido."
  })
  .length(11, { message: "El CUIT debe tener 11 dígitos." })
  .regex(/^\d+$/, { message: "El CUIT solo debe contener dígitos." }),

  bookingId: z.string({
    required_error: "El ID de la reserva es requerido."
  })
});
