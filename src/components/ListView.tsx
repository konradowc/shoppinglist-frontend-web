import { useEffect, useState } from "react";

import { SingleList } from "./SingleList";
import { ListClient } from "../clients/ListClient"

type Props = {
    userId: number
};

export const ListView = ({ userId: _userId }: Props) => {

    const [userId, setUserId] = useState(-1);
    const [listIdsArray, setListIdsArray] = useState<number[]>([]);
    const [currentIndex, setCurrentIndex] = useState(-1);

    useEffect(() => {
        // update state variable
        setUserId(_userId);
    }, [_userId]);

    useEffect(() => {
        // fetch list info from DB
        const fetchListIds = async () => {
            if(userId === -1) return;

            const listIdsResponse = await ListClient.getListsByUser(userId);
            console.log(listIdsResponse);

            setCurrentIndex(0);
            setListIdsArray(listIdsResponse.listIds);
        };

        fetchListIds();

    }, [userId]);

    const handleNewListButton = async () => {
        const newList = await ListClient.createList("Untitled List", []);
        console.log(newList);

        setListIdsArray(prev => [...prev, newList.list_id]); // TO-DO: think about this (two fast clicks)
        setCurrentIndex(currentIndex+1);
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
        </>
    );
};