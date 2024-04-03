export declare type Avatar = {
    bucketId: string;
    file_type: string;
    height: number;
    width: number;
    text: string;
};

export declare type Switch = 0 | 1;

export declare type DBTransactionOptions = {
    controlPublishHook: boolean;
};

export type ResponseItems<T> = {
    items: T;
    status?: number;
    code?: number;
    [propsName: string]: any;
};
