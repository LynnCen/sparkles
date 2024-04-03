import Token from "@newSdk/model/Token";

class Net {
    token = "";
    baseUrl = "";
    is401 = false;
    delegate401?: Function;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    setDelegate(delegate401: Function) {
        this.delegate401 = delegate401;
    }

    async getNetToken() {
        this.token = await Token.getToken(this.baseUrl);
        return this.token;
    }

    updateIs401(val: boolean) {
        this.is401 = val;
    }
}

export { Net };
