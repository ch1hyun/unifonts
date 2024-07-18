import { MessagePayload } from "../../../shared/network-type";

export function requestToPlugin(payload: MessagePayload) {
    parent.postMessage({pluginMessage: payload}, '*');
}