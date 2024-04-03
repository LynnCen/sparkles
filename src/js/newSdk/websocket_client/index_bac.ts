import pkg from "../../../../package.json";
import os from "os";
import { remote } from "electron";
const WebSocket = remote.require("ws");
import TWebSocket from "ws";
import { TOKEN_ERROR, NEED_LOGOUT, TOKEN_INVALID, LOGIN_EXPIRED } from "@newSdk/consts/ws_error";
import nc, { Event } from "@newSdk/notification";
import { Connection_status } from "@newSdk/consts/connection_status";
import UserInfo from "@newSdk/model/UserInfo";
import { handle401 } from "@newSdk/service/apiCore";
import allNets from "@newSdk/service/nets/Nets";
import { tmmBase } from "@newSdk/service/apiBase/tmmBase";
import SyncOffline from "./model/SYNC_OFFLINE";
import APP_CONFIG from "@newSdk/config";
import { EventEmitter } from "events";

class EventCenter extends EventEmitter {}

class Client {
    url: string; // websocket address
    ws!: TWebSocket; // websocket instance
    isReconnecting: boolean = false; // is reconnecting
    isCustomClose: boolean = false;
    timerID: any; // reconnection timer ID
    errorStack: any[] = []; // error messageList
    eventCenter = new EventCenter();
    timerHeartbeat: any;
    token: string;

    constructor(url: string, token: string) {
        this.token = token;
        this.url = url;
        if (!token) return;
        this.createWs();
    }

    // token update
    updateToken(token: string) {
        if (!token) return;
        if (this.ws) this.ws.close();
        this.token = token;
        this.createWs();
    }

    // new a websocket instance
    createWs() {
        // console.log(`${this.url}&token=${this.token}`);
        this.ws = new WebSocket(`${this.url}&token=${this.token}`);
        console.log("created");
        // this.ws = {
        //     on: () => {},
        // } as any;
        this.onopen();
        this.onerror();
        this.onclose();
        this.onmessage();
        this.onPing();
    }

    heartbeat() {
        console.log("receive ping");
        clearTimeout(this.timerHeartbeat);
        // Use `WebSocket#terminate()`, which immediately destroys the connection,
        // instead of `WebSocket#close()`, which waits for the close timer.
        // Delay should be equal to the interval at which your server
        // sends out pings plus a conservative assumption of the latency.
        this.timerHeartbeat = setTimeout(() => {
            console.log("socket----->timeout ...");
            this.reconnection && this.reconnection();
        }, 60000 + 1000);
    }

    onopen() {
        this.ws.onopen = () => {
            console.log("[open] Connection established");
            this.errorStack.forEach((message) => {
                this.send(message);
            });
            this.errorStack = [];
            this.isCustomClose = false;
            this.isReconnecting = false;
            this.heartbeat();
        };
    }

    onPing() {
        this.ws.on("ping", () => this.heartbeat());
    }

    logout() {
        const netInfo = allNets.getNetByBaseUrl(tmmBase.baseUrl);
        this.close();
        return handle401(netInfo);
    }

    onerror() {
        this.ws.onerror = (err) => {
            console.log(err, "onerror");
            // this.reconnection();
            // this.isReconnecting = false;
        };
    }

    onclose(...e: any) {
        this.ws.onclose = (err) => {
            console.log("onclose", err, this.isCustomClose);
            if (this.isCustomClose) return;
            // token invalid
            if ([LOGIN_EXPIRED, NEED_LOGOUT, TOKEN_INVALID].includes(err.code)) {
                return this.logout();
            }
            this.reconnection();
            this.isReconnecting = false;
        };
    }

    onmessage() {
        this.ws.onmessage = (event) => {
            console.log(`receive notification`, event);
            try {
                if (typeof event.data === "string") {
                    const data = JSON.parse(event.data);
                    console.log(data);
                    console.log(`socket message: `, data.cmd /*, data.items*/);

                    if (data.cmd === SyncOffline.cmd) this.logout();
                    this.eventCenter.emit(data.cmd, data.items);
                }
            } catch (error) {
                this.reconnection();
                console.log(error, "error");
            }
        };
    }

    reconnection() {
        if (!this.ws) return;
        if (this.isReconnecting) return;
        this.isReconnecting = true;
        if (this.timerID) clearTimeout(this.timerID);
        if (this.timerHeartbeat) clearTimeout(this.timerHeartbeat);

        this.ws.terminate();
        this.timerID = setTimeout(() => this.createWs(), 10000);
    }

    send(message: any) {
        if (this.ws.readyState !== 1) {
            this.errorStack.push(message);
            return;
        }

        this.ws.send(message);
    }

    // close by hand
    close() {
        this.isCustomClose = true;
        this.ws?.close();
        clearTimeout(this.timerHeartbeat);
    }

    // start by hand
    start() {
        this.isCustomClose = false;
        this.reconnection();
    }

    subscribe(eName: string, handler: (...args: any[]) => void) {
        this.eventCenter.on(eName, handler);
    }

    unSubscribe(eName: string, handler: (...args: any[]) => void) {
        this.eventCenter.off(eName, handler);
    }

    reset() {
        clearTimeout(this.timerHeartbeat);
        clearTimeout(this.timerID);
        WSClient.ws.removeAllListeners();
        WSClient.eventCenter.removeAllListeners();
    }
}

const osPlat = process.platform === "darwin" ? "mac" : "win";
const version = pkg.version;

const url = `${
    APP_CONFIG.ws_app
}?ter_type=${osPlat}&over=${os.release()}&version=${version}&lang=cn`;
const WSClient = new Client(url, "");

export default WSClient;
