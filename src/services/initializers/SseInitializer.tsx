import { useEffect, type PropsWithChildren } from "react";
import { useAppContext } from "../../context/AppContext.js";
import { sseServiceSingleton } from "../SseService.js"
import { useQueryClient } from "@tanstack/react-query";
import { INVALID_USER_ID } from "../../constants/constants.js";


export const SseInitializer = () => {

    // get appContext for the UserID
    const { userId } = useAppContext();
    // get query client
    const queryClient = useQueryClient();

    useEffect(() => {

        if(userId !== INVALID_USER_ID)
            sseServiceSingleton.initialize(userId, queryClient);

    }, [userId])

    return null;
}