import { api } from "./api/api"

export class UserClient {

    static async makeNewUser(password: string) {
        return api.post(`/user`,
            {
                password: password
            }
        ).then(response => response.data)
        .catch(error => console.error(error));
    }
}