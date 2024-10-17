import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { registerRequest, loginRequest, verificarToken } from "../api/auth";
import Cookies from 'js-cookie';
import IUser from '../types/IUser.ts';


// Definir la interfaz para el usuario

// Definir la interfaz del contexto de autenticación
interface AuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  errors: string[];
  signup: (user: IUser) => Promise<void>;
  signin: (user: IUser) => Promise<void>;
  logout: () => Promise<void>
  getCurrentUser: () => { id: string | null, name: string };
}

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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  /* Nueva función para devolver el nombre de usuario
  const getUsername = (): string | null => {
    if (isAuthenticated && user) {
      return user.username;
    }
    return null;
  };*/

  const signup = async (user: IUser) => {
    try {
      const res = await registerRequest(user);
      console.log(res.data);
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

  const signin = async (user: IUser) => {
    try {
      const res = await loginRequest(user);
      console.log(res);
      setUser(res.data.user);
      setIsAuthenticated(true);
      console.log(user)

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

  const getCurrentUser = () => {
    const isAuthenticated = true;
    const user = { _id: '123', username: 'ejemplo' };
    
    if (isAuthenticated && user) {
      console.log(user)
      return { id: user._id, name: user.username };
    }
    else {
      return { id: null, name: 'Anónimo' };
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
        const res = await verificarToken();
        console.log(res);
        if (!res.data) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        setIsAuthenticated(true);
        setUser(res.data.user);
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
      getCurrentUser,
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
