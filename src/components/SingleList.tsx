import { useEffect, useRef, useState } from "react"

import { useList } from "../hooks/useList"

import { Button, Paper, Table, TextInput } from '@mantine/core';
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { ListClient } from "../clients/ListClient";

type Props = {
    listId: number;
};

/* individual list functionality */
export const SingleList = ({ listId }: Props) => {

    // server data
    const { name, contents, editors, status } = useList(listId); // wrapper for useQuery: automatically updates on listId change
    const queryClient = useQueryClient();
    // optimistic update data
    //const [contentsInFlight, setContentsInFlight] = useState();

    // API
    const addRow = useMutation({
        mutationFn: (input: { newContent: string}) => {
            return ListClient.addListRows(listId, [input.newContent]);
        },
        onMutate: (input: { newContent: string}) => {
            queryClient.cancelQueries({ queryKey: ["list", listId] }); // so data doesn't get over-written
            queryClient.setQueryData(["list", listId], (prevData: any) => {
                return {
                    ...prevData,
                    contents: [...contents, {id: crypto.randomUUID(), // in very rare case of collision, may be brief visual glitch before server fetch
                                            itemName: input.newContent,
                                            expandable: false,
                                            optimistic: true
                                            }]
                };
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["list", listId] }); // force re-fetch either way, success or not (will take some time)
                                                                            // if fail, will just overwrite optimistic update
        }
    });
    const deleteRow = useMutation({
        mutationFn: (input: { itemId: number}) => {
            return ListClient.removeListRows(listId, [input.itemId]);
        },
        onMutate: (input: { itemId: number}) => {
            queryClient.cancelQueries({ queryKey: ["list", listId] }); 
            queryClient.setQueryData(["list", listId], contents.filter((content: any) => !(content.id === input.itemId)));
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["list", listId] });
        }
    });
    const editName = useMutation({
        mutationFn: (input: { newName: string }) => {
            return ListClient.updateListName(listId, input.newName);
        },
        onMutate: () => {
            queryClient.cancelQueries({ queryKey: ["list", listId] });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["list", listId] });
        }
    });

    // local data
    const [inputBox, setInputBox] = useState("");
    const [localNameBox, setLocalNameBox] = useState("");
    const nameBoxRef = useRef<HTMLInputElement>(null);

    // update local variable to server state
    // will override user changes (if any not saved)
    useEffect(() => {
        if(name != undefined)
            setLocalNameBox(name);
    }, [name])

    // on list ID change, clear the entry box
    useEffect(() => {
        setInputBox("");
    }, [listId])

    const handleCreateItem = async () => {
        console.log("enter input");
        addRow.mutate({newContent: inputBox});

        setInputBox("");
    }

    const handleEditName = () => {
        console.log("name change TO-DO");

        editName.mutate({ newName: localNameBox });
    }

    const handleDeleteItem = (itemId: number) => {
        console.log("to-do: ", itemId);
    }

    return(
        status != "pending" && 
        <>
            <TextInput
                value={localNameBox}
                ref={nameBoxRef}
                onChange={(e) => {setLocalNameBox(e.currentTarget.value);}}
                onBlur={handleEditName}
                onKeyDown={(e) => {if(e.key === "Enter") nameBoxRef.current?.blur(); }}
                placeholder="List name"
                variant="unstyled"
            />
            <Paper withBorder style={{ height: 250, overflowY: 'auto' }}>
                <Table>
                    <Table.Tbody>
                        {contents.map((content: any) => (
                            <Table.Tr key={content.id}>
                                <Table.Td>{content.itemName}</Table.Td>
                                <Table.Td>
                                    <Button size="xs" onClick={() => handleDeleteItem(content.id)} />
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </Paper>
            <TextInput
                value={inputBox}
                onChange={(e) => {setInputBox(e.currentTarget.value);}}
                onKeyDown={(e) => {if(e.key === "Enter") handleCreateItem();}}
                placeholder="Enter an item or recipe"
            />
        </>
    );
};