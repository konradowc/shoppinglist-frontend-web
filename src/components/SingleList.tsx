import { FormEvent, useState } from "react";
import { ListClient } from "../clients/ListClient"

export const SingleList = () => {

    const [listContents, setListContents] = useState("");
    const [listName, setListName] = useState("My List");
    const [listId, setListID] = useState(-1);

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
                defaultValue={listName}
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