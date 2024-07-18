/* REQUEST TYPE */
export enum RequestTypes {
    INIT = 'INIT',
    CLOSE = 'CLOSE',
    PROCESS = 'PROCESS',
    ADD_TAG = 'ADD_TAG',
    UPDATE_TAG = 'UPDATE_TAG',
    DELETE_TAG = 'DELETE_TAG',
};

/* STORAGE */
/* Client Storage Key Names */
export enum StorageKeys {
    TAG_ITEMS = 'tagItems',
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