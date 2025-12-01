import { useState } from "react";
import { ListClient } from "../clients/ListClient"

export const SingleList = () => {

    const [listContents, setListContents] = useState("");
    
    const handleClick = async () => {
        setListContents();
        ListClient.postList(listContents);
    }

    return (
        <>
            <textarea rows={20} cols={30} />
            <button onClick={handleClick}>Update List</button>
        </>
    );
};