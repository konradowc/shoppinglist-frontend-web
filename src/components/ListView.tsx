import { useEffect, useState } from "react";

import { SingleList } from "./SingleList";
import { ListClient } from "../clients/ListClient"
import { ShareListModal } from "./modals/ShareListModal"

import { INVALID_LIST_ID, INVALID_USER_ID } from "../constants/constants"

import { useAppContext } from "../context/AppContext"

type Props = {
    userId: number
};

/* component holding all things related to lists */
export const ListView = () => {

    const { userId, setUserId } = useAppContext();

    const [listIdsArray, setListIdsArray] = useState<number[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [shareModalOpen, setShareModalOpen] = useState(false);

    useEffect(() => {
        // fetch list info from DB
        const fetchListIds = async () => {
            if(userId === INVALID_USER_ID) return;

            const listIdsResponse = await ListClient.getListsByUser(userId);
            console.log("Fetched automatically: ", listIdsResponse);

            setCurrentIndex(0); // TO-DO: save last viewed list?
            setListIdsArray(listIdsResponse.listIds);
        };

        fetchListIds();

    }, [userId]);

    const handleNewListButton = async () => {
        const oldIndex = currentIndex; // save in case of user movement during blocking 'await'

        const newListTitle: string = "Untitled List";
        const newListContents: string[] = [];

        const newList = await ListClient.createList(newListTitle, newListContents, userId);
        console.log("Made this new list: " + newList.list_id + " owned by " + newList.owner_id);

        const updatedListIdsArray: number[] =
            [...listIdsArray.slice(0, currentIndex+1), newList.list_id, ...listIdsArray.slice(currentIndex+1)];
        setListIdsArray(updatedListIdsArray);
        setShareModalOpen(false);
        setCurrentIndex(oldIndex+1);
    };

    const handleDeleteListButton = () => {
        ListClient.deleteList(getCurrentListId());
        setListIdsArray(prev => prev.filter((_, i) => i !== currentIndex));

        setShareModalOpen(false);
        if(currentIndex == listIdsArray.length-1) setCurrentIndex(currentIndex-1); // move back to have index remain in bounds 
    };

    const handleLeftListButton = () => {
        if(currentIndex <= 0) return;

        setShareModalOpen(false);
        setCurrentIndex(currentIndex-1);
    };

    const handleRightListButton = () => {
        if(currentIndex >= listIdsArray.length-1) return;

        setShareModalOpen(false);
        setCurrentIndex(currentIndex+1);
    };

    const handleShareButton = () => {
        setShareModalOpen(!shareModalOpen);
    };

    // handles out-of-bounds errors
    const getCurrentListId = () => {
        if(currentIndex < 0 || currentIndex >= listIdsArray.length) {
            console.log("List index error");
            return INVALID_LIST_ID;
        }
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
            {shareModalOpen && 
                <ShareListModal listId={getCurrentListId()}></ShareListModal>
            }      
        </>
    );
};