/* REQUEST TYPE */
export type RequestInitialInfo = "requestInitialInfo";

export type RequestTypeList = RequestInitialInfo;

/* PAYLOAD */
export type MessagePayload = {
    type: RequestTypeList;
    data: Object;
};