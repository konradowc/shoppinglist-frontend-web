import { useQuery } from "@tanstack/react-query"
import { ListClient } from "../clients/ListClient"

import { INVALID_LIST_ID } from "../constants/constants"

export const useList = (listId: number) => {
    const { data, error, status } = useQuery({
        queryKey: ['list', listId], 
        queryFn: () => ListClient.getList(listId), // don't need to await (check notes)
        staleTime: Infinity, // so no re-fetching unless explicitly invalidateQuerie'd
        enabled: listId !== INVALID_LIST_ID,
    });

    let name = undefined, contents = undefined, editors = undefined;

    if(error) console.log("UL: useList Hook error");
    if(!data) console.log("UL: no data yet (this is ok)"); // data likely null on first run
    else {
        // parse
        //console.log("UL: got ", data);
        name = data.list_name;

        contents = data.contents.map((content: any) => { return {id: content.id, 
                                                                 itemName: content.itemName, 
                                                                 expandable: content.expandable, 
                                                                 optimistic: false }});

        editors = data.editor_ids;
    }
    
    return { name, contents, editors, status };
}