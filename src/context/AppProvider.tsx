import { AppContext } from "./AppContext.js";
import { type PropsWithChildren, useState } from "react";

import { INVALID_USER_ID } from "../constants/constants.js"

export const AppProvider = ({ children }: PropsWithChildren) => {

    const [userId, setUserId] = useState(INVALID_USER_ID);

    const setUserIdState = (id: number) => {
        console.log("Setting user ID (AppProvider)");
        setUserId(id);
    };

    return (
        <AppContext.Provider value={{ userId: userId, setUserId: setUserIdState }}>
            { children }
        </AppContext.Provider>
    );
}