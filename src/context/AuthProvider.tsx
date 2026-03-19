import { useEffect, useContext } from "react"
import { type PropsWithChildren, useState } from "react"

import { AuthContext } from "./AuthContext.js"

import { setUserCookies, getUserCookies } from "../utils/cookiesUtils.js"
import { UserClient } from "../clients/UserClient.js"
import { useAppContext } from "../context/AppContext.js"

export const AuthProvider = ({ children }: PropsWithChildren) => {

    // get appContext for the UserID
    const { userId, setUserId } = useAppContext();

    const makeNewUserAndReturnId = async (): Promise<{id: number, pswrd: string}> => {
        // make a password (auto-generated)

        // TO-DO: better password
        let password = "";
        for(let i = 0; i < 10; i++) {
            password += Math.floor(Math.random() * 9).toString();
        }

        const user = await UserClient.makeNewUser(password);
        return {id: user.user_id, pswrd: password};
    };

    /* INITIALIZATION OF USER ID: find userID stored in cookie, and give to AppContext */
    useEffect(() => {

        const initUserId = async () => {
            let uidAndPswrd = getUserCookies();
            
            if(uidAndPswrd == null) { // new user
                uidAndPswrd = await makeNewUserAndReturnId();
                setUserCookies(uidAndPswrd.id, uidAndPswrd.pswrd);
            }
            setUserId(uidAndPswrd.id); // sets app (global) context's userId for all components
            console.log("Set userId to " + uidAndPswrd.id + " and pswrd to " + uidAndPswrd.pswrd);
        };

        initUserId();

    }, []); // runs only once

    return (
        <AuthContext.Provider value={{ /* empty for now */ }}>
            { children }
        </AuthContext.Provider>
    );
}