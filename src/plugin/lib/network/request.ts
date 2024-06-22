import { MessagePayload, RequestTypes } from "../../../shared/network-type";

export function requestToUI<MessagePayload>(payload: MessagePayload) {
    figma.ui.postMessage(payload);
}