import axios from './axios';

// Funciones con tipos de retorno explícitos
export const registerRequest = (user: any) => axios.post('/register', user);

export const loginRequest = (user: any) => axios.post('/login', user);

export const logoutRequest = () => axios.post('/loguot')

export const verificarToken = (token: string) => axios.get('/verify');


