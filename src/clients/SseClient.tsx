import { sseNewConnection } from "./api/api"

export class SseClient {

    static connectSse(userId: number, 
    eventCallback: (event: MessageEvent<any>) => void, errorCallback: (error: Event) => void): EventSource {
        
        console.log("Making a new SSE connection");
        const eventSource = sseNewConnection("sse/" + userId);

        /* set up */
        eventSource.addEventListener("updatedListContents", eventCallback);

        eventSource.onerror = errorCallback;


        return eventSource;
    }

    static closeSse(eventSource: EventSource) {
        eventSource.close();
    }
}