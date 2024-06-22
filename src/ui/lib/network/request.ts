
export function requestToPlugin<MessagePayload>(payload: MessagePayload) {
    parent.postMessage({pluginMessage: payload}, '*');
}