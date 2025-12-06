import { FormEvent, useState } from "react";
import { ListClient } from "../clients/ListClient"

export const SingleList = () => {

    const [listContents, setListContents] = useState("");

    const handleListChange = (event: FormEvent<HTMLTextAreaElement>) => {
        setListContents(event.currentTarget.value);
        ListClient.postList(listContents);
    }

    return (
        <>
            <textarea 
                value={ listContents }
                onInput = { handleListChange }
                rows={ 20 } 
                cols={ 30 } 
            />
        </>
    );
};