import { api } from "./api/api"

export class ListClient {

    // TO-DO: hardcoded, should use DTO?
    // note: listIds (number type) do not match size of long in Java

    static async getList(listId : number) {
        console.log("gerttig" + listId);
        return api.get(`/list/${listId}`,
            // no body
        ).then(response => response.data)
        .catch(error => console.error(error));
    }

    static async createList(listName : string, listContents : string[]) {
        return api.post(`/list`,
            {
                list_name: listName,
                contents: listContents,
                owner_id: 1
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

    static async addListRow(listId : number, rowContents : string) {
        return api.patch(`/list/${listId}/contents`,
            {
                contents_to_add: [rowContents]
            }
        ).then(response => response.data)
        .catch(error => console.error(error));
    }

    //static async updateListRow(listId : number, row : number, rowContents : string) {}

    static async updateListName(listId : number, newListName : string) {
        return api.patch(`/list/${listId}/metadata`,
            {
                list_name: newListName
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
}