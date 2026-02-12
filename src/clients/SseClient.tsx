import { sseNewConnection } from "./api/api"

export class SseClient {

    static connectSse(listId: number, userId: number): EventSource {
        const eventSource = sseNewConnection("sse/" + listId + "/" + userId);

        /* set up */
        eventSource.addEventListener(listId.toString(), (event) => {
            console.log("sse got this: ", event.data)
        });

        eventSource.onerror = (error) => {
            console.log("sse error: ", error);
        }


        return eventSource;
    }

    static closeSse(eventSource: EventSource) {
        eventSource.close();
    }
}