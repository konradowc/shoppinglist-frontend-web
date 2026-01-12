import { post } from "./api/api"

export class ListClient {

    // TO-DO hardcoded, should use DTO

    static async createList(listName : string, listContents : string[]) {
        const keys: string[] = ["list_name", "contents"];
        const vals: any[] = [listName, listContents];
        return post("/list", keys, vals);
    }

    static async deleteList(listId : Number) { // note: does not match size of long in Java

    }

    static async addListRow(listId : Number, rowContents : string) {

    }

    static async updateListRow(listId : Number, row : Number, rowContents : string) {

    }
}