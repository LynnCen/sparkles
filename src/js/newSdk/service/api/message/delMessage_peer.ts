import axios from "@newSdk/service/apiCore/tmmCore";
const delMessage_peer = (ids: string[]) =>
    axios({ url: "/delMessage", method: "post", data: { ids } });

export default delMessage_peer;
