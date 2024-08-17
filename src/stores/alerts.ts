import type { AlertType } from "$lib/types";
import { writable } from "svelte/store";
export const alerts = writable<AlertType[]>([]);

let timeouts: {alert: string, timeout: NodeJS.Timeout}[] = [];
let paused: {alert: string, timeout: NodeJS.Timeout}[] = [];

export function addInfoAlert(message: string, callback: ((ok: boolean) => void) | null = null, okbutton = "", cancelbutton= "", timed = false) {
    let id = Math.random().toString(36).substr(2, 9);
    if (callback !== null) {
    addAlert({
        id,
        type: "info",
        timed,
        message,
        ok_button: okbutton,
        cancel_button: cancelbutton,
        callback
    }, 12000);
    } else {
        addAlert({
            id,
            type: "info",
            timed,
            message,
        }, 6000);
    }

    return id;
}

export function addErrorAlert(message: string, timed = false) {
    let id = Math.random().toString(36).substr(2, 9);
    addAlert({
        id,
        type: "error",
        timed,
        message,
    }, 6000);

    return id;
}

export function addSuccessAlert(message: string, timed = false) {
    let id = Math.random().toString(36).substr(2, 9);
    addAlert({
        id,
        type: "success",
        timed,
        message,
    }, 4000);

    return id;
}

export function addAlert(alert: AlertType, time: number = 2500) {
    if (alert.timed) {
        let id = setTimeout(() => {
            removeAlert(alert.id);
        }, time);
        timeouts.push({alert: alert.id, timeout: id});
    }
    alerts.update((a) => [...a, alert]);
}

export function pauseTimeout(id: string) {
    let index = timeouts.findIndex(x => x.alert === id);
    if (index !== -1) {
        paused.push(timeouts[index]);
        clearTimeout(timeouts[index].timeout);
        timeouts.splice(index, 1);
    }
}

export function resumeTimeout(id: string) {
    let index = paused.findIndex(x => x.alert === id);
    if (index !== -1) {
        let tid = setTimeout(() => {
            removeAlert(id);
        }, 3000);
        timeouts.push({alert: id, timeout: tid});
        paused.splice(index, 1);
    }
}

export function removeLastAlert() {
    alerts.update((a) => a.slice(0, -1));
}

export function removeAlert(id: string) {
    alerts.update((a) => a.filter((x) => x.id !== id));
}

export function removeAllAlerts() {
    alerts.set([]);
}

export function updateAlert(id: string, alert: AlertType) {
    alerts.update((a) => {
        const index = a.findIndex((x) => x.id === id);
        if (index !== -1) {
            a[index] = alert;
        }
        return a;
    });
}

export function clearTimeouts() {
    timeouts.forEach(x => clearTimeout(x.timeout));
    timeouts = [];
}

export function clearPaused() {
    paused = [];
}

export function reset() {
    clearTimeouts();
    clearPaused();
    removeAllAlerts();
}