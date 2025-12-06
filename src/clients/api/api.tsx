import { getBackendURL } from "./env"

//TO-DO make dynamic (tuple?)
async function post(url : string, contents: string) : Promise<string> {
    try {
        console.log("this: " + getBackendURL() + " that: " + url);
        const response: Response = 
            await fetch(
                getBackendURL() + url,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ list: contents })
                    // TO-DO: add credientials (RequestCredentials)
                }
            );
        
        if(response.ok) {
            console.log("good post request");
            return response.statusText;
        }
        else {
            console.log("bad post request");
            return response.statusText;
        }
    }
    catch {
        const errorStr = "POST network error";
        console.error(errorStr);
        throw new Error(errorStr);
    }
}

export { post };

