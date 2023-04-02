import dva from "dva";
import "./index.css";
import Config from "./config/Config";
import { message } from "antd";
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");
Config.init();

// 1. Initialize
const app = dva();
// 2. Plugins
// app.use({});

// 3. Model
const models = require.context("./stores", true, /\.ts$/);
models.keys().forEach(k => app.model(models(k).default));
// const models = require("./stores");
// Object.keys(models).forEach(k => app.model(models[k]));

// 4. Router
app.router(require("./router").default);
export default app;

// 5. Start
if (window.location.hash === "#/") {
  window.location.href = "#/edit";
}

if (Config.isSupportWebGL()) {
  app.start("#action_container");
} else {
  message.error("当前浏览器不支持webgl，请使用谷歌浏览器");
}
