import axios from 'axios';
import { getBackendURL } from './env';

export const api = axios.create({
    baseURL: getBackendURL(),
    headers: {
        'Content-Type': 'application/json',
    }
});