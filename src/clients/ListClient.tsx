import { post } from "./api/api"

export class ListClient {

    static async postList(listContents : String) {
        post("/list", "my beautiful list");
    }
}