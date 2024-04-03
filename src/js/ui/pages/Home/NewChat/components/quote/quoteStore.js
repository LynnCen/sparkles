/**
 * @Author Pull
 * @Date 2021-07-24 19:11
 * @project messageQuote
 */
import { action, observable, computed } from "mobx";
import { FormatDigest } from "../../../index";
import MessageType from "@newSdk/model/MessageType";

class MessageQuote {
    @observable isQuote = false;
    @observable currentMessage = null;
    @observable displayContent = "";

    @action quoteMessage(msg) {
        console.log("quoteMessage", msg);
        self.currentMessage = msg;
        self.isQuote = true;
    }

    @action abrogateQuote() {
        self.currentMessage = null;
        self.isQuote = false;
        self.displayContent = "";
    }

    @action
    clearCache() {
        self.abrogateQuote();
    }
}

const self = new MessageQuote();

export default self;
