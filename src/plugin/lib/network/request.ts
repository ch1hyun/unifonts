import { MessagePayload } from "../../../shared/network-type";

export function requestToUI(payload: MessagePayload) {
    figma.ui.postMessage(payload);
}