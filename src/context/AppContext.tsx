import { createContext, useContext } from "react";

export interface AppContextType {
    userId: number
    setUserId: (id: number) => void;
}

// default
export const AppContext = createContext<AppContextType | null>(null);

// for others to use
export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if(!context) throw new Error("Context error");
    else return context;
};