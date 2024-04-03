class StatusException {
    private message: string;
    private code: number;
    constructor(message: string, code: number) {
        this.message = message;
        this.code = code;
    }
}

export default StatusException;
