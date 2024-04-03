import { tmmBase } from "./tmmBase";
import APP_CONFIG from "@newSdk/config";
const { im_app, moment, miniApp, payment } = APP_CONFIG;

// need some as token
const allBase = [im_app, moment, miniApp, payment];

export default allBase;
