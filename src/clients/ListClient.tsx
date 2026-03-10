import { api } from './api/api'

export class ListClient {

    // TO-DO: hardcoded, should use DTO?
    // note: listIds (number type) do not match size of long in Java (and possibly not size of number in Postgres)

    static async getList(listId : number) {
        console.log("Getting list " + listId);
        return api.get(`/list/${listId}`,
            // no body
        ).then(response => response.data)
        .catch(error => console.error(error));
    }

    static async createList(listName : string, listContents : string[], ownerId : number) {
        return api.post(`/list`,
            {
                list_name: listName,
                contents: listContents,
                owner_id: ownerId
            }
        ).then(response => response.data)
        .catch(error => console.error(error));
    }

    static async deleteList(listId : number) { 
        return api.delete(`/list/${listId}`
            // no body
        ).then(response => response.data)
        .catch(error => console.error(error));
    }

    static async addListRows(listId : number, rowContents : string[]) {
        return api.patch(`/list/${listId}/contents`,
            {
                content_to_add: rowContents
            }
        ).then(response => response.data)
        .catch(error => console.error(error));
    }

    static async removeListRows(listId : number, rowIds : number[]) {
        return api.patch(`/list/${listId}/contents`,
            {
                item_ids_to_remove: rowIds
            }
        ).then(response => response.data)
        .catch(error => console.error(error));
    }

    static async updateListName(listId : number, newListName : string) {
        return api.patch(`/list/${listId}/metadata`,
            {
                list_name: newListName,
            }
        ).then(response => response.data)
        .catch(error => console.error(error));
    }

    static async updateListEditors(listId: number, editors: string[]) {
        return api.patch(`/list/${listId}/metadata`,
            {
                editor_ids: editors
            }
        ).then(response => response.data)
        .catch(error => console.error(error));
    }

    //static async updateListOwner(listId : number, newOwner : string) {}

    static async getListsByUser(userId : number) {
        return api.get(`/user/${userId}/lists`,
            // no body
        ).then(response => response.data)
        .catch(error => console.error(error));
    }

    static async getListItemExpandedOptions(listId: number, itemId: number) {
        return api.get(`/list/${listId}/item/${itemId}/expandable-options`,
            // no body
        ).then(response => response.data)
        .catch(error => console.error(error));
    }

    static async createListItemExpandedRecipe(listId: number, itemId: number, recipe: any) { // TO-DO: create DTO for option (the recipe that comes in)
        return api.post(`/list/${listId}/item/${itemId}/expanded`,
            {
                recipe: recipe
            }
        ).then(response => response.data)
        .catch(error => console.error(error));
    }
}