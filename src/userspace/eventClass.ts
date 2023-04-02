import { NewEventClass } from "@/ts_pkc/ts-nc";
import { EventClass, NcEvent } from "@/ts_pkc/ts-nc/src/event";

interface LoginEvData {
    type: string,
    payload: any
}

export class LoginEvent extends NewEventClass<string>() {
    private _data: LoginEvData

    constructor(ids: string[], data: LoginEvData) {
        super(ids)
        this._data = data
    }

    getData(): LoginEvData {
        return this._data
    }
}

