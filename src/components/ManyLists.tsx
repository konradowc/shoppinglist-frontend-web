import { useEffect, useState } from "react";

import { SingleList } from "../components/SingleList";
import { ListClient } from "../clients/ListClient"

export const ManyLists = () => {

    const [numLists, setNumLists] = useState(1);
    const [currentList, setCurrentList] = useState(0);
    const [currentListName, setCurrentListName] = useState("My List");

    useEffect(() => {
        // fetch info from DB about lists

        const shiftFocusToNewList = () => {

        };

    }, [currentList]);

    const handleNewListButton = () => {
        ListClient.createList("Untitled List", []);
    };

    const handleDeleteListButton = () => {
        //ListClient.deleteList();
    };

    const handleLeftListButton = () => {

    };

    const handleRightListButton = () => {

    };

    return (
        <>
            <input name="listTitle" defaultValue={currentListName} />
            <SingleList />
            <button name="newListBtn" onClick={handleNewListButton}>New List</button>
            <button name="delListBtn" onClick={handleDeleteListButton}>Delete</button>
            <button name="leftListBtn" onClick={handleLeftListButton}>&lt;</button>
            <button name="rightListBtn" onClick={handleRightListButton}>&gt;</button>            
        </>
    );
};