import { createContext, useContext } from "react";

/* empty for now */

export interface AuthContextType {
}

// default
export const AuthContext = createContext<AuthContextType | null>(null);

// for others to use
export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if(!context) throw new Error("Context error");
    else return context;
};