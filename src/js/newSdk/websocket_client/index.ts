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
import UserDeleted from "./model/USER_DELETED";
import APP_CONFIG from "@newSdk/config";
import { EventEmitter } from "events";
import { pull } from "@newSdk/service/api/PullMessage";
import SyncSettingHide from "@newSdk/websocket_client/model/sync_setting_hide";
import { deletedDb } from "@newSdk/model";
class EventCenter extends EventEmitter {}

const log = (...reset: any[]) =>
    console.log(`[websocket] [${new Date().toLocaleString()}] -- `, ...reset);

class Client {
    url: string; // websocket address
    ws!: TWebSocket; // websocket instance
    isReconnecting: boolean = false; // is reconnecting
    isCustomClose: boolean = false;

    timerID: any; // reconnection timer ID
    pingTimer: any; // ping frame interval
    connectingTimeoutTimer: any; // connecting timeout
    timerHeartbeat: any;

    errorStack: any[] = []; // error messageList
    eventCenter = new EventCenter();
    token: string;

    readonly pingInterval = 1000 * 30;
    readonly timeoutInterval = this.pingInterval * 2 + 1000 * 10;
    readonly connectingTimeout = 1000 * 10;

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
        log("created");
        // this.ws = {
        //     on: () => {},
        // } as any;
        this.isReconnecting = false;
        this.onopen();
        this.onerror();
        this.onclose();
        this.onmessage();
        this.onPing();

        clearInterval(this.pingTimer);
        this.pingTimer = setInterval(() => {
            this.sendPing();
        }, this.pingInterval);

        clearTimeout(this.connectingTimeoutTimer);
        this.connectingTimeoutTimer = setTimeout(() => {
            log("connectingTimeoutTimer");
            this.reconnection && this.reconnection();
        }, this.connectingTimeout);
    }

    heartbeat() {
        log("heartbeat");
        clearTimeout(this.timerHeartbeat);

        clearTimeout(this.connectingTimeoutTimer);
        log("clear connecting timeout timer");
        // Use `WebSocket#terminate()`, which immediately destroys the connection,
        // instead of `WebSocket#close()`, which waits for the close timer.
        // Delay should be equal to the interval at which your server
        // sends out pings plus a conservative assumption of the latency.
        this.timerHeartbeat = setTimeout(() => {
            log("timeout ready to reconnection");
            this.reconnection && this.reconnection();
        }, this.timeoutInterval);
    }

    sendPing() {
        log("send ping");
        this.ws.ping();
    }

    onopen() {
        this.ws.onopen = () => {
            clearTimeout(this.connectingTimeoutTimer);
            log("clear connecting timeout timer");
            log("[open] Connection established");

            log("effect pull message");
            pull();
            this.errorStack.forEach((message) => {
                this.send(message);
            });
            this.errorStack = [];
            this.isCustomClose = false;
            this.isReconnecting = false;
            // this.heartbeat();
            this.sendPing();
        };
    }

    onPing() {
        this.ws.on("pong", () => {
            log("receive pong");
            this.heartbeat();
        });
    }

    logout(deleted?: boolean) {
        const netInfo = allNets.getNetByBaseUrl(tmmBase.baseUrl);
        this.close();
        if (deleted) deletedDb();
        return handle401(netInfo);
    }

    onerror() {
        this.ws.onerror = (err) => {
            log(err, "onerror");
            // this.reconnection();
            // this.isReconnecting = false;
        };
    }

    onclose(...e: any) {
        this.ws.onclose = (err) => {
            log("onclose", err, this.isCustomClose);
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
            log(`receive notification`, event);
            try {
                if (typeof event.data === "string") {
                    const data = JSON.parse(event.data);
                    console.log(data);
                    console.log(`socket message: `, data.cmd /*, data.items*/);

                    if (data.cmd === SyncOffline.cmd) this.logout();
                    if (data.cmd === UserDeleted.cmd) this.logout(true);
                    this.eventCenter.emit(data.cmd, data.items);
                }
            } catch (error) {
                this.reconnection();
                console.log(error, "error");
            }
        };
    }

    reconnection() {
        log("reconnection inner", this.ws, this.isReconnecting);
        if (!this.ws) return;
        if (this.isReconnecting) return;
        this.isReconnecting = true;
        if (this.timerID) clearTimeout(this.timerID);
        if (this.timerHeartbeat) clearTimeout(this.timerHeartbeat);

        this.ws.terminate();
        this.timerID = setTimeout(() => {
            log(`ready to connection`);
            this.createWs();
        }, 5000);
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
        clearTimeout(this.connectingTimeoutTimer);
        clearInterval(this.pingTimer);
        clearTimeout(this.timerID);
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
        log("reset");
        clearTimeout(this.timerHeartbeat);
        clearTimeout(this.timerID);
        clearTimeout(this.connectingTimeoutTimer);
        clearInterval(this.pingTimer);
        WSClient.ws?.removeAllListeners();
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

(window as any).wsss = WSClient;
