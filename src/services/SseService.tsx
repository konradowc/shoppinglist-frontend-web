import type { QueryClient } from "@tanstack/react-query"; // note: this does not import the queryClient as created in App.tsx, only the data type. it is dependency injected
import { SseClient } from "../clients/SseClient.js"

class SseService {

    sseConnection?: EventSource; // keeping it so the EventSource doesn't get garbage collected
    serviceInitialized: boolean = false;
    serviceUserId?: number;

    queryClient?: QueryClient; // to dependency inject

    public initialize = (userId: number, queryClient: QueryClient) => {
        if(!this.serviceInitialized) {
            this.serviceInitialized = true;
            this.serviceUserId = userId;
            this.queryClient = queryClient;

            this.sseConnection = SseClient.connectSse(userId, 
                                                    [["changedList", this.onChangedList],
                                                     ["deletedList", this.onDeletedList]],
                                                    this.onErrorCallback);
        }
    }

    // callbacks

    private onChangedList = (event: MessageEvent<any>) => {
        const sentId: number = Number(event.data);
        if(Number.isNaN(sentId)) { console.error("ID sent to SseService is NaN (cha)"); return; }

        console.log("getChanges got this (invalidating this list's data): ", sentId);

        this.queryClient.invalidateQueries({ "queryKey": ['list', sentId] });
    }

    private onDeletedList = (event: MessageEvent<any>) => {
        const sentId: number = Number(event.data);
        if(Number.isNaN(sentId)) { console.error("ID sent to SseService is NaN (del)"); return; }

        console.log("some list was deleted");

        if(this.serviceUserId) {
            this.queryClient.invalidateQueries({ "queryKey": ['user', this.serviceUserId] });
        }
    }

    private onErrorCallback = (error: Event) => {
        console.log("sse error: ", error);
    }
}

export const sseServiceSingleton = new SseService();