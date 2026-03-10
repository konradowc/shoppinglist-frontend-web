import { useEffect, useRef, useState } from "react"

import { useList } from "../hooks/useList"

import { Accordion, Button, Paper, Table, TextInput } from '@mantine/core';
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { ListClient } from "../clients/ListClient";

import { IconTrash, IconSparkles, IconCaretDownFilled } from "@tabler/icons-react";

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
    // TO-DO: hooks not in separate files?
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
            queryClient.setQueryData(["list", listId], (prevData: any) => {
                return {
                    ...prevData,
                    contents: contents.filter((content: any) => !(content.id === input.itemId))
                }
            });   
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

    const [expandedRows, setExpandedRows] = useState<number[]>([]);

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
        console.log("name change");

        editName.mutate({ newName: localNameBox });
    }

    const handleDeleteItem = (itemId: number) => {
        console.log("deleting item: ", itemId);

        deleteRow.mutate({ itemId: itemId });
    }

    const handleExpandItem = async (itemId: number) => { // TO-DO: make into a hook? probably not
        console.log("expanding item", itemId);

        const options = await ListClient.getListItemExpandedOptions(listId, itemId);
        // (TO-DO: some kind of user choice screen)
        const ourOption = options.results[0];
        await ListClient.createListItemExpandedRecipe(listId, itemId, ourOption);

        queryClient.invalidateQueries({ queryKey: ["list", listId] });
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
                size="lg"
            />
            <Paper withBorder style={{ height: 250, overflowY: 'auto' }}>
                <Table>
                    <Table.Tbody>
                        {contents
                        .filter((content: any) => !content.itemChild)
                        .map((content: any) => (
                            <>
                                <Table.Tr key={content.id}>

                                    <Table.Td style={{ width: '100%' }} >{content.itemName}</Table.Td>

                                    <Table.Td style={{ width: '100%' }} />

                                    {(content.expandable && !content.expanded) && 
                                    <Table.Td ta="right">
                                        <Button 
                                            size="xs"
                                            variant="gradient"
                                            p={6}
                                            onClick={() => handleExpandItem(content.id)} 
                                        >
                                            <IconSparkles size={16}/>
                                        </Button>
                                    </Table.Td>}

                                    {(content.expandable && content.expanded) && 
                                    <Table.Td ta="right">
                                        <Button 
                                            size="xs"
                                            variant="transparent"
                                            p={6}
                                            onClick={() => { if(!expandedRows.includes(content.id)) {
                                                    setExpandedRows([...expandedRows, content.id]); 
                                                }
                                                else {
                                                    setExpandedRows(expandedRows.filter((row) => row != content.id));
                                                }
                                            }} 
                                        >
                                            <IconCaretDownFilled size={16}/>
                                        </Button>
                                    </Table.Td>} 

                                    {!content.optimistic &&
                                    <Table.Td ta="right">
                                        <Button 
                                            size="xs"
                                            variant="outline"
                                            p={6}
                                            onClick={() => handleDeleteItem(content.id)} 
                                        >
                                            <IconTrash size={16}/>
                                        </Button>
                                    </Table.Td>}

                                </Table.Tr>        

                                {(content.expanded && !expandedRows.includes(content.id)) &&
                                (
                                    content.expandedItems.map((expandedItem: any) =>
                                            <Table.Tr key={expandedItem.id}>

                                                <Table.Td style={{ width: '100%', fontStyle: "italic" }} pl="lg">{"- "+expandedItem.itemName}</Table.Td>

                                                <Table.Td style={{ width: '100%' }} />

                                                <Table.Td>
                                                    <></>
                                                </Table.Td>

                                                {(expandedItem.expandable && !expandedItem.expanded) && 
                                                <Table.Td ta="right">
                                                    <Button 
                                                        size="xs"
                                                        variant="gradient"
                                                        p={6}
                                                        onClick={() => handleExpandItem(expandedItem.id)} 
                                                    >
                                                        <IconSparkles size={16}/>
                                                    </Button>
                                                </Table.Td>}

                                                {!expandedItem.optimistic &&
                                                <Table.Td ta="right">
                                                    <Button 
                                                        size="xs"
                                                        variant="outline"
                                                        p={6}
                                                        onClick={() => handleDeleteItem(expandedItem.id)} 
                                                    >
                                                        <IconTrash size={16}/>
                                                    </Button>
                                                </Table.Td>}

                                            </Table.Tr>
                                    )
                                )
                                }
                            </>
                    ))} 
                    </Table.Tbody>
                </Table>
            </Paper>
            <TextInput
                value={inputBox}
                onChange={(e) => {setInputBox(e.currentTarget.value);}}
                onKeyDown={(e) => {if(e.key === "Enter") handleCreateItem();}}
                placeholder="Enter an item or recipe"
                autoFocus
            />
        </>
    );
};