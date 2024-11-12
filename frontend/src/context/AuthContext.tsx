import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { registerRequest, loginRequest, verificarToken } from "../api/auth.ts";
import Cookies from 'js-cookie';
import IUser from '../types/IUser.ts';

type AuthContextType = {
  signup: (user: any) => Promise<void>; 
  signin: (user: any) => Promise<void>;
  logout: () => Promise<void>;
  user: any;
  isAuthenticated: boolean;
  errors: any;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe estar dentro de un AuthProvider");
  }

  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const signup = async (user: any) => {
    try {
      const res = await registerRequest(user);
      if (res.data.token) {
        Cookies.set('token', res.data.token);
      }
      setUser(res.data.user);
      setIsAuthenticated(true);
    } catch (error: any) {
      console.log(error.response);
      if (Array.isArray(error.response?.data)) {
        setErrors(error.response.data);
      } else if (typeof error.response?.data === "object") {
        const errorMessages = Object.values(error.response.data).filter(
          (msg: unknown) => typeof msg === "string"
        ) as string[];
        setErrors(errorMessages);
      } else {
        setErrors(["An unexpected error occurred."]);
      }
    }
  };

  const logout = () => {
    Cookies.remove("token");
    setIsAuthenticated(false);
    setUser(null);
    return Promise.resolve();
  };

  const signin = async (credentials: {username: string, password: string}) => {
    try {
      const res = await loginRequest(credentials);
      console.log('Respuesta completa:', res);
      console.log('Token recibido:', res.data.token);
      
      if (res.data.token) {
        // Intentar múltiples configuraciones de cookie
        try {
          // Opción 1: Configuración básica
          Cookies.set('token', res.data.token, {
            path: '/',
          });
          
          // Verificar si se guardó
          console.log('Cookie después de guardar:', Cookies.get('token'));
          
        } catch (cookieError) {
          console.error('Error al guardar cookie:', cookieError);
        }
      } else {
        console.error('No se recibió token en la respuesta');
      }
      
      setUser(res.data.user);
      setIsAuthenticated(true);
    } catch (error: any) {
      console.error('Error en signin:', error);
      if (Array.isArray(error.response?.data)) {
        setErrors(error.response.data);
      } else if (typeof error.response?.data === "object") {
        const errorMessages = Object.values(error.response.data).filter(
          (msg: unknown) => typeof msg === "string"
        ) as string[];
        setErrors(errorMessages);
      } else {
        setErrors(["An unexpected error occurred."]);
      }
    }
};

// Función de utilidad para verificar cookies
const checkCookieStatus = () => {
  console.log('Todas las cookies:', Cookies.get());
  console.log('Cookie de token:', Cookies.get('token'));
  console.log('Navigator cookieEnabled:', navigator.cookieEnabled);
  console.log('Document cookie:', document.cookie);
};

useEffect(() => {
  async function checkLogin() {
    const cookies = Cookies.get();
    console.log('Cookies al iniciar:', cookies);

    if (!cookies.token) {
      console.log('No se encontró token en cookies');
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const res = await verificarToken(cookies.token);
      console.log('Respuesta de verificación:', res);
      
      if (!res.data) {
        console.log('Verificación falló - no hay datos');
        return setIsAuthenticated(false);
      }

      setIsAuthenticated(true);
      setUser(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error en verificación:', error);
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
    }
  }
  checkLogin();
  checkCookieStatus(); // Verificar estado de cookies al inicio
}, []);

  return (
    <AuthContext.Provider value={{
      signup,
      signin,
      logout,
      loading,
      user,
      isAuthenticated,
      errors,
    }}>
      {children}
    </AuthContext.Provider>
  );
};