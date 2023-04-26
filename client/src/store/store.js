import { writable } from 'svelte/store';

export const defaultUser = {
    isLoading: false,
    isAuthenticated: false,
}

export const user = writable(defaultUser);