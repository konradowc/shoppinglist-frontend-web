import axios from 'axios';
import { getBackendURL } from './env';

export const api = axios.create({
    baseURL: getBackendURL(),
    headers: {
        'Content-Type': 'application/json',
    }
});

/* not related to axios, for starting server-side events */
export const sseNewConnection = (path: string): EventSource => {
    return new EventSource(getBackendURL() + "/" + path);
}
