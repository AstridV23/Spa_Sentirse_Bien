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

  const signin = async (credentials: {username: string, password: string}) => {
    try {
      const res = await loginRequest(credentials);
      console.log('Respuesta del servidor:', res.data);
      
      // Save the token as a cookie if it exists in the response
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

  useEffect(() => {
    async function checkLogin() {
      const cookies = Cookies.get();

      if (!cookies.token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
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