import { createContext } from "react";

export interface AppContextType {
    userId: number
    setUserId: (id: number) => void;
}

// default
export const AppContext = createContext<AppContextType | null>(null);