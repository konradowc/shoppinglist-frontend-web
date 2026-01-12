import { getBackendURL } from "./env"

async function post(url : string, paramKeys : string[], paramValues : any[]) : Promise<string> {
 
    try {
        if(paramKeys.length != paramValues.length) {
            const errorStr = "Input parameter error";
            console.error(errorStr);
            throw new Error(errorStr);
        }

        let dataString: string = "";
        for(let i = 0; i < paramKeys.length; i++) {
            dataString += paramKeys[i] + " " + paramValues[i] + " / ";
        }
        console.log(dataString);
    
        const data: Record<string, any> = {};
        paramKeys.forEach((key, i) => {
            data[key] = paramValues[i];
        });

        console.info("data: " + JSON.stringify(data));

        const response: Response = 
            await fetch(
                getBackendURL() + url,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
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

