import { useEffect, useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query"

import { SingleList } from "./SingleList.js";
import { ListClient } from "../clients/ListClient.js"
import { ShareListModal } from "./modals/ShareListModal.js"

import { useAppContext } from "../context/AppContext.js"
import { useListOfLists } from "../hooks/useListofLists.js";
import { Button, Group, Stack } from "@mantine/core";

/* component holding all things related to lists */
export const ListView = () => {

    // global data / clients
    const { userId } = useAppContext();
    const queryClient = useQueryClient();

    // server data
    const { listIds, status } = useListOfLists(userId);

    // API
    const createList = useMutation({
        mutationFn: (input: { listName: string, listContents: string[], ownerId: number }) => {
            return ListClient.createList(input.listName, input.listContents, input.ownerId);
        },
    });
    const deleteList = useMutation({
        mutationFn: ({ listId }: { listId: number }) => {
            return ListClient.deleteList(listId)
        },
    });

    // local data
    const [currentListId, setCurrentListId] = useState<number | null>(null);

    // UI
    const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);

    // handles cases where list is empty (new account, or deleted all), 
    // and where curr id is null (just loaded in)
    useEffect(() => {
    
        if(listIds) {
            if(listIds.length == 0)
                createListAndNavigateToIt();
            else if(currentListId == null)
                setCurrentListId(listIds[0]);
        }
            
    }, [listIds]);

    /* 
    functionality methods
    */ 

    const createListAndNavigateToIt = async () => { // TO-DO: this will put to back of listoflists for now, change in future
        
        const createdList = await createList.mutateAsync({ listName: "Untitled List", listContents: [], ownerId: userId });

        queryClient.invalidateQueries({ queryKey: ["user", userId] }); // force re-fetch (will take some time)
        setCurrentListId(createdList.list_id); // navigate to the new list
        // TO-DO: pressing <- or -> while the ["user", userId] query is being re-fetched will not be good (would not find our current list ID in list of lists)
        // so need to add optimistic
    }

    const deleteListAndNavigateAwayFromIt = async () => {

        if(currentListId === null) return; // TS requires
        await deleteList.mutateAsync({ listId: currentListId });

        // NOTE: this will semi-break upon adding optimistic deletion
        let newIndex = findListRelativeToGiven(currentListId, -1);
        if(newIndex === currentListId) // too far OR couldn't find in list (optimistic updated, probably)
            newIndex = null; // TO-DO: will break the page until listIds gets re-fetched -> the useEffect runs
        setCurrentListId(newIndex);

        queryClient.invalidateQueries({ queryKey: ["user", userId] }); // force re-fetch (will take some time)
    }

    // fallback: return old list id
    const findListRelativeToGiven = (listId: number, relativeIndex: number) => {
        const index = listIds.indexOf(listId);
        if(index == -1) { console.error("listId not found in the list"); return listId; }

        const newIndex = index + relativeIndex;
        if(newIndex < 0 || newIndex >= listIds.length) { console.log("too far-but it's ok"); return listId; } // fallback
        else {
            return listIds[newIndex];
        }
    }

    /*
    UI handlers
    */

    const handleNewListButton = async () => {
        createListAndNavigateToIt();
        setShareModalOpen(false);
    };

    const handleDeleteListButton = () => {
        deleteListAndNavigateAwayFromIt();
        setShareModalOpen(false);
    };

    const handleLeftListButton = () => {
        if(currentListId != null)
            setCurrentListId(findListRelativeToGiven(currentListId, -1));
    };

    const handleRightListButton = () => {
        if(currentListId != null)
            setCurrentListId(findListRelativeToGiven(currentListId, 1));    
    };

    const handleShareButton = () => {
        setShareModalOpen(!shareModalOpen);
    };

    return (
        currentListId != null && // ONLY render if listIdsArray has contents & currentListId is not Invalid: note this will cause problems if userId updates (out of sync due to useState)
        <>
            <Group>
                <Button name="leftListBtn" onClick={handleLeftListButton}>&lt;</Button>
                <Stack>
                    <SingleList listId={currentListId} />
                    <Group>
                        <Button name="newListBtn" onClick={handleNewListButton}>New List</Button>
                        <Button name="delListBtn" onClick={handleDeleteListButton}>Delete</Button>
                        <Button name="shareBtn" onClick={handleShareButton}>Share</Button>
                    </Group>
                </Stack>
                <Button name="rightListBtn" onClick={handleRightListButton}>&gt;</Button>  
                {shareModalOpen && 
                    <ShareListModal listId={currentListId}></ShareListModal>
                } 
            </Group>
        </>
    );
};