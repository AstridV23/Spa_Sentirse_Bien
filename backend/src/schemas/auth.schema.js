import {optional, z} from 'zod'

export const registerSchema = z.object({
    username: z.string({
        required_error: 'El nombre de usuario no puede estar vacío.',
    }),
    firstname: z.string({
        required_error: 'El campo nombre es requerido.',
    }),
    lastname: z.string({
        required_error: 'El campo apellidos es requerido.',
    }),
    email: z.string({
        required_error: 'El campo email no puede estar vacío.',
    }).email({
        message: 'El email ingresado no es válido.',
    }),
    phone: z.string()
        .min(10, { message: "Número de teléfono inválido." })
        .optional()
        .or(z.literal('')), // Permitir vacío o valor válido
    sex: z.enum(['hombre', 'mujer', 'otro'], {
        required_error: 'El campo sexo es requerido.',
    }).default('otro'),
    role: z.enum(['usuario', 'admin', 'secretario', 'profesional']).default('usuario'),
    password: z.string({
        required_error: 'El campo contraseña no puede estar vacío.',
    }).min(8, {
        message: 'La contraseña debe tener al menos 8 caracteres.',
    }),
});

export const loginSchema = z.object({
  username: z.string({
    required_error: "Debe ingresar un correo electrónico o nombre de usuario."
  }),


  password: z.string({
    required_error: "El campo contraseña no puede estar vacío."
  }).min(8, {
    message: "La contraseña debe tener al menos 8 caracteres."
  }),
})

