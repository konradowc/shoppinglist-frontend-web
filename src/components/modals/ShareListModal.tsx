import { FormEvent, useState, useEffect } from 'react'

import { ListClient } from "../../clients/ListClient"
import { useAppContext } from "../../context/AppContext"

type Props = {
    listId: number;
};

export const ShareListModal = ({ listId }: Props) => {

    const {userId, setUserId} = useAppContext();

    const [shareTextField, setShareTextField] = useState("");
    const [editors, setEditors] = useState([]);

    useEffect(() => {
        const fetchEditors = async () => {
            const list = await ListClient.getList(listId);
            console.log("Got these editor_ids: ", list.editor_ids);
            setEditors(list.editor_ids);
        };

        console.log("Opened share modal");
        fetchEditors();

    }, [listId]); // try w/o

    const handleShareTextFieldChange = (event: FormEvent<HTMLInputElement>) => {
        setShareTextField(event.currentTarget.value);
    }

    const handleSendButton = async () => {
        if(editors.length == 0) { console.log("Empty editors arr"); return; } // empty TO-DO: make this a constant?
        const newEditors = [...editors, shareTextField]; // TO-DO: no checking here
        
        const updatedList = await ListClient.updateListEditors(listId, newEditors);
        setEditors(updatedList.editor_ids);
    }

    return (
        <>
            <h3>Share with:</h3>
            <input 
                value={shareTextField}
                onChange={handleShareTextFieldChange}
            />
            <button
                name="sendButton"
                onClick={handleSendButton}>
                    Send
            </button>
            <h4>Already shared with: {editors.join(", ")}</h4>
        </>
    );
};