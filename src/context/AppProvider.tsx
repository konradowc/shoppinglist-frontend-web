import { AppContext } from "./AppContext";
import { PropsWithChildren, useState } from "react";

import { INVALID_USER_ID } from "../constants/constants"

export const AppProvider = ({ children }: PropsWithChildren) => {

    const [userId, setUserId] = useState(INVALID_USER_ID);

    const setUserIdState = (id: number) => {
        console.log("Setting user ID");
        setUserId(id);
    };

    return (
        <AppContext.Provider value={{ userId: userId, setUserId: setUserIdState }}>
            { children }
        </AppContext.Provider>

    );
}