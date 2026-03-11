import { sseNewConnection } from "./api/api.js"

export class SseClient {

    static connectSse(userId: number, 
        eventCallbacks: [string, (event: MessageEvent<any>) => void][],
        errorCallback: (error: Event) => void): EventSource {
        
        console.log("Making a new SSE connection");
        const eventSource = sseNewConnection("sse/" + userId);

        /* set up callbacks */
        for(const [eName, eCallback] of eventCallbacks) {
            eventSource.addEventListener(eName, eCallback);
        }
        eventSource.onerror = errorCallback;

        return eventSource;
    }

    static closeSse(eventSource: EventSource) {
        eventSource.close();
    }
}