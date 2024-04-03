import { EventEmitter } from "events";
import Event from "./eventTypes";

type Handler = (...args: any[]) => void;

/**
 *
 */
class NC extends EventEmitter {
    publish(channel: string, ...args: any[]) {
        super.emit(channel, ...args);
    }

    addObserver = <data = any>(channel: string, callback: (data: data) => void) =>
        super.on(channel, callback);

    removeObserve(channel: string, handle: Handler) {
        super.off(channel, handle);
    }
}
const nc = new NC();
export default nc;
export { Event };
