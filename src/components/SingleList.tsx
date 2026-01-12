import { FormEvent, useState } from "react";
import { ListClient } from "../clients/ListClient"

export const SingleList = () => {

    const [listContents, setListContents] = useState([]);

    const handleListChange = (event: FormEvent<HTMLTextAreaElement>) => {
        const _listContents = event.currentTarget.value;
        //setListContents(_listContents);
        //ListClient.addListRow(_listContents); // TO-DO
    }

    return(
        <>
            <textarea 
                value={listContents}
                onInput={handleListChange}
                rows={20} 
                cols={30} 
            />
        </>
    );
};