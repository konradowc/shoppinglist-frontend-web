import { post } from "./api/api"

export class ListClient {

    static async postList(listContents: string) {
        post("/list", listContents);
    }
}