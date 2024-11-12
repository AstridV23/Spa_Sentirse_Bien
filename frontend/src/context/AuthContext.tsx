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


// Definir la interfaz para el usuario

// Definir la interfaz del contexto de autenticación
type AuthContextType = {
  signup: (user: any) => Promise<void>; 
  signin: (user: any) => Promise<void>;
  logout: () => Promise<void>;
  user: any;
  isAuthenticated: boolean;
  errors: any;
  loading: boolean;
};

// Crear contexto con el tipo definido
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

// Definir las props del AuthProvider
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
      setUser(res.data.user);
      setIsAuthenticated(true);
      
    } catch (error: any) {
      console.log(error.response);

      // Asegúrate de que `error.response.data` sea un array
      if (Array.isArray(error.response?.data)) {
        setErrors(error.response.data);
      } else if (typeof error.response?.data === "object") {
        // Si es un objeto, convierte los mensajes de error en un array
        const errorMessages = Object.values(error.response.data).filter(
          (msg: unknown) => typeof msg === "string"
        ) as string[];
        setErrors(errorMessages);
      } else {
        // Si no es ni array ni objeto, establece un error genérico
        setErrors(["An unexpected error occurred."]);
      }
    }
  };

  const signin = async (credentials: {username: string, password: string}) => {
    try {
      console.log("user antes de login", user);
      const res = await loginRequest(credentials);
      console.log('Respuesta del servidor:', res.data);
      
      setUser(res.data.user);
      
      console.log("user despues de login", user);
      setIsAuthenticated(true);

    } catch (error: any) {
      console.log(error.response);

      // Asegúrate de que `error.response.data` sea un array
      if (Array.isArray(error.response?.data)) {
        setErrors(error.response.data);
      } else if (typeof error.response?.data === "object") {
        // Si es un objeto, convierte los mensajes de error en un array
        const errorMessages = Object.values(error.response.data).filter(
          (msg: unknown) => typeof msg === "string"
        ) as string[];
        setErrors(errorMessages);
      } else {
        // Si no es ni array ni objeto, establece un error genérico
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
  /*
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [errors]);*/

  useEffect(() => {
    async function checkLogin() {
      const cookies = Cookies.get();

      if (!cookies.token) {
        setIsAuthenticated(false);
        setLoading(false);
        return 
      }

      try {
        const res = await verificarToken(cookies.token);
        if (!res.data) return setIsAuthenticated(false);
        console.log("res.data", res.data);

        setIsAuthenticated(true);
        setUser(res.data);
        setLoading(false);

      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        console.log(error);
      }
    }
    checkLogin();
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
