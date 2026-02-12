import { FormEvent, useEffect, useState } from "react"
import { ListClient } from "../clients/ListClient"
import { SseClient } from "../clients/SseClient"

import { useAppContext } from "../context/AppContext"

import { INVALID_LIST_ID } from "../constants/constants"

type Props = {
    listId: number;
};

/* individual list functionality */
export const SingleList = ({ listId: _listId }: Props) => {

    const [listContents, setListContents] = useState("");
    const [oldListContents, setOldListContents] = useState(listContents);
    const [listName, setListName] = useState("");
    const [listId, setListID] = useState(INVALID_LIST_ID);

    const { userId, setUserId } = useAppContext();

    const [sseEventSource, setSseEventSource] = useState<EventSource>();

    useEffect(() => {
        // update state variable
        setListID(_listId);

    }, [_listId]);

    /*
    get list on listID change
    */
    useEffect(() => {
        const fetchList = async () => {
            if(listId === INVALID_LIST_ID) return;

            // fetch the list from backend
            const listResponse = await ListClient.getList(listId);
            console.log(listResponse);

            // transform contents from string[] to string
            let fullContents: string = "";
            let arrContents: string[] = listResponse.contents;
            for(let i: number = 0; i < arrContents.length; i++) {
                fullContents += arrContents.at(i) + "\n";
            }

            setListName(listResponse.list_name);
            setListContents(fullContents);
            setOldListContents(fullContents); // temp

            // temp (move to service)
            setSseEventSource(SseClient.connectSse(listId, userId));
        };

        fetchList();

    }, [listId]);

    const handleListChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setListContents(event.currentTarget.value);
    }

    // TO-DO
    const handleListNewLine = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if(listId == INVALID_LIST_ID) { console.log("Invalid list ID"); return; }
        if(event.key !== "Enter") return;
        else {
            const newListContentsSplit = listContents.split("\n");
            const oldListContentsSplit = oldListContents.split("\n");

            let addedRows: string[] = [];
            for(let i = 0; i < newListContentsSplit.length; i++) {
                if(newListContentsSplit[i] != oldListContentsSplit[i]) 
                    addedRows = [...addedRows, newListContentsSplit[i]];
            }
            console.log("added rows: " + addedRows);

            await ListClient.addListRows(listId, addedRows); // not -1 safe

            setOldListContents(listContents);
        }
    }

    const handleNameChange = (event: FormEvent<HTMLInputElement>) => {
        const _listName = event.currentTarget.value;

        setListName(_listName);
        ListClient.updateListName(listId, _listName);
    }

    return(
        <>
            <input
                value={listName}
                onChange={handleNameChange} // should only fire after focus gone TO-DO
            />
            <textarea
                value={listContents}
                onChange={handleListChange}
                onKeyDown={handleListNewLine}
                rows={20} 
                cols={30} 
            />
        </>
    );
};