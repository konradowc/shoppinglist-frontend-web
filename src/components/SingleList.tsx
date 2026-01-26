import { FormEvent, useEffect, useState } from "react";
import { ListClient } from "../clients/ListClient"

type Props = {
    listId: number;
};

export const SingleList = ({ listId: _listId }: Props) => {

    const [listContents, setListContents] = useState("");
    const [listName, setListName] = useState("My List");
    const [listId, setListID] = useState(-1);

    useEffect(() => {
        // update state variable
        setListID(_listId);

    }, [_listId]);

    useEffect(() => {
        const fetchList = async () => {
            if(listId === -1) return;

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
        };

        fetchList();

    }, [listId]);

    const handleListChange = (event: FormEvent<HTMLTextAreaElement>) => {
        const _listContents = event.currentTarget.value;

        // TO-DO: optimize so not calculating every time, have a wait
/*
        const _listContentsSplit = _listContents.split("\n");
        const _listChangedRows = [];
        for(let i = 0; i < Math.max(listContents.length, _listContentsSplit.length); i++) {
            if(listContents[i] != _listContentsSplit[i]) {

            }
        }
            */

        setListContents(_listContents);
        //ListClient.addListRow(_listContents); // TO-DO
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
                onChange={handleNameChange} // only fires after focus gone
            />
            <textarea
                value={listContents}
                onInput={handleListChange}
                rows={20} 
                cols={30} 
            />
        </>
    );
};