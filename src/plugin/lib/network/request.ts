import { MessagePayload } from "../../../shared/network-type";

export function requestToUI<T>(payload: T) {
    figma.ui.postMessage({pluginMessage: payload});
}

export function sendInitialInfo(data: Object) {
    requestToUI<MessagePayload>({
        type: "requestInitialInfo",
        data: data
    });
}