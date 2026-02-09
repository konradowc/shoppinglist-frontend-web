import { useEffect, useState } from "react";

import { SingleList } from "./SingleList";
import { ListClient } from "../clients/ListClient"

import { INVALID_LIST_ID, INVALID_USER_ID } from "../constants/constants"

type Props = {
    userId: number
};

/* component holding all things related to lists */
export const ListView = ({ userId: _userId }: Props) => {

    const [userId, setUserId] = useState(INVALID_USER_ID); // could change in future to use AppContext (need to do something on update, though)

    const [listIdsArray, setListIdsArray] = useState<number[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        // update state variable
        setUserId(_userId);
    }, [_userId]);


    useEffect(() => {
        // fetch list info from DB
        const fetchListIds = async () => {
            if(userId === INVALID_USER_ID) return;

            const listIdsResponse = await ListClient.getListsByUser(userId);
            console.log("Fetched automatically: " + listIdsResponse);

            setCurrentIndex(0); // TO-DO: save last viewed list?
            setListIdsArray(listIdsResponse.listIds);
        };

        fetchListIds();

    }, [userId]);

    const handleNewListButton = async () => {
        const oldIndex = currentIndex; // save in case of user movement during blocking 'await'

        const newListTitle: string = "Untitled List";
        const newListContents: string[] = [];

        const newList = await ListClient.createList(newListTitle, newListContents);
        console.log("Made this new list: " + newList);

        const updatedListIdsArray: number[] =
            [...listIdsArray.slice(0, currentIndex+1), newList.id, ...listIdsArray.slice(currentIndex)];
        setListIdsArray(updatedListIdsArray);
        setCurrentIndex(oldIndex+1);
    };

    const handleDeleteListButton = () => {
        ListClient.deleteList(getCurrentListId());
        setListIdsArray(prev => prev.filter((_, i) => i !== currentIndex));

        if(currentIndex == listIdsArray.length-1) setCurrentIndex(currentIndex-1); // move back to have index remain in bounds 
    };

    const handleLeftListButton = () => {
        if(currentIndex <= 0) return;

        else setCurrentIndex(currentIndex-1);
    };

    const handleRightListButton = () => {
        if(currentIndex >= listIdsArray.length-1) return;

        else setCurrentIndex(currentIndex+1);
    };

    const handleShareButton = () => {

    };

    // handles out-of-bounds errors
    const getCurrentListId = () => {
        if(currentIndex < 0 || currentIndex >= listIdsArray.length) return -1;
        else return listIdsArray[currentIndex];
    }

    return (
        <>
            <SingleList listId={getCurrentListId()} />
            <button name="newListBtn" onClick={handleNewListButton}>New List</button>
            <button name="delListBtn" onClick={handleDeleteListButton}>Delete</button>
            <button name="leftListBtn" onClick={handleLeftListButton}>&lt;</button>
            <button name="rightListBtn" onClick={handleRightListButton}>&gt;</button>  
            <button name="shareBtn" onClick={handleShareButton}>Share</button>          
        </>
    );
};