/* REQUEST TYPE */
export enum RequestTypes {
    INIT = 'INIT',
    CLOSE = 'CLOSE',
    PROCESS = 'PROCESS',
};

/* EXCEPTION */
export enum ExceptionTypes {
    NO_SELECTION = 'NO_SELECTION',
};

export type NetworkType = RequestTypes | ExceptionTypes;

/* PAYLOAD */
export type MessagePayload = {
    type: NetworkType;
    data: Object;
};