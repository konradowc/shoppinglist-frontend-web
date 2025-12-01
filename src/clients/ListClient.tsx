
export class ListClient {

    static async postList(listContents : String) {
        const response = await fetch(
            `http://localhost:8081/list`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ listContents })
        }
        );
    }
}