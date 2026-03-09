import { SseClient } from "../clients/SseClient"

import { queryClient } from "../App" // TO-DO

class SseService {

    sseConnection?: EventSource; // keeping it so the EventSource doesn't get garbage collected
    serviceInitialized: boolean = false;
    serviceUserId?: number;

    public initialize = (userId: number) => {
        if(!this.serviceInitialized) {
            this.serviceInitialized = true;
            this.serviceUserId = userId;

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

        console.log("getChanges got this (invalidating this): ", sentId);
        
        queryClient.invalidateQueries({ "queryKey": ['list', sentId] });
    }

    private onDeletedList = (event: MessageEvent<any>) => {
        const sentId: number = Number(event.data);
        if(Number.isNaN(sentId)) { console.error("ID sent to SseService is NaN (del)"); return; }

        console.log("some list was deleted");

        if(this.serviceUserId)
            queryClient.invalidateQueries({ "queryKey": ['user', this.serviceUserId] });
    }

    private onErrorCallback = (error: Event) => {
        console.log("sse error: ", error);
    }
}

export const sseServiceSingleton = new SseService();