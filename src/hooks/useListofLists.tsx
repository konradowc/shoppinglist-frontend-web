import { useQuery } from "@tanstack/react-query";
import { INVALID_USER_ID } from "../constants/constants"

import { ListClient } from "../clients/ListClient"

export const useListOfLists = (userId: number) => {
    
    const { data, error, status } = useQuery({
        queryKey: ["user", userId],
        queryFn: () => ListClient.getListsByUser(userId),
        staleTime: Infinity, // will need manual invalidation to replace
        enabled: userId !== INVALID_USER_ID,
    });

    let listIds = undefined;

    if(error) console.log("L.O.L. error");
    if(!data) console.log("L.O.L. still getting data");
    else {
        // parse
        //console.log("L.O.L. got data: " + data.listIds);
        listIds = data.listIds;
    }

    return { listIds, status };
}
