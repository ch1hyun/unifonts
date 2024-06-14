import { MessagePayload, RequestTypeList } from "../../../shared/network-type";

export function isRequestPayload(payload: unknown, type: RequestTypeList) : boolean {
    return (
        typeof payload === "object" &&
        Object.prototype.hasOwnProperty.call(payload, "type") &&
        Object.prototype.hasOwnProperty.call(payload, "data") &&
        (payload as MessagePayload).type === type
    );
}