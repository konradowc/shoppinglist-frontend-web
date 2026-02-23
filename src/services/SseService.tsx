
import { SseClient } from "../clients/SseClient"

export class SseService {

    static sseConnection: EventSource;

    static initialize = (userId: number) => {
        if(SseService.sseConnection == null)
            SseClient.connectSse(userId, SseService.onEventCallback, SseService.onErrorCallback);
    }

    private static onEventCallback = (event: MessageEvent<any>) => {
        console.log("sse got this: ", event.data);
    }

    private static onErrorCallback = (error: Event) => {
        console.log("sse error: ", error);
    }
}