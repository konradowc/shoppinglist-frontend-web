import { SseClient } from "../clients/SseClient"

import { queryClient } from "../App" // TO-DO

class SseService {

    // TO-DO: remove these
    listChangeCallback?: (id: number) => void;
    listDeletedCallback?: () => void;

    sseConnection?: EventSource; // keeping it so the EventSource doesn't get garbage collected
    serviceInitialized: boolean = false;

    public initializeTemp = (userId: number) => { // TO-DO: callback funcs
        this.initialize(userId, this.onGetChanges, this.onGetDeleted);
    }

    public initialize = (userId: number, listChangeCallback: (id: number) => void, listDeletedCallback: () => void) => {
        if(!this.serviceInitialized) {
            this.serviceInitialized = true;
            
            this.listChangeCallback = listChangeCallback;
            this.listDeletedCallback = listDeletedCallback;

            this.sseConnection = SseClient.connectSse(userId, this.onAnyMessageCallback, this.onErrorCallback);
        }
    }

    private onAnyMessageCallback = (event: MessageEvent<any>) => {
        console.log("sse data: ", event.type, " / ", event.data);

        if(event.type == "changedList") { // TO-DO: again, frontend-backend communication
            const sentId: number = Number(event.data);
            if(Number.isNaN(sentId)) { console.error("ID sent to SseService is NaN (cha)"); return; }

            if(this.listChangeCallback) this.listChangeCallback(sentId);
        }
        else if(event.type == "deletedList") {
            const sentId: number = Number(event.data);
            if(Number.isNaN(sentId)) { console.error("ID sent to SseService is NaN (del)"); return; }

            if(this.listDeletedCallback) this.listDeletedCallback();
        }
    }

    private onErrorCallback = (error: Event) => {
        console.log("sse error: ", error);
    }

    ///

    // TO-DO: temp?
    private onGetChanges = (id: number) => {
        console.log("getChanges got this (invalidating this): ", id);
        queryClient.invalidateQueries({ "queryKey": ['list', id] });
    }

    private onGetDeleted = () => {
        console.log("some list was deleted (TO-DO)");
        // TO-DO-TODAY
    }
}

export const sseServiceSingleton = new SseService();