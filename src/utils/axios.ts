import axios from "axios";
import { message } from "antd";
import "./env";

axios.defaults.baseURL = env.REACT_APP_API;
// axios.defaults.baseURL = "https://scxcfz.cn:8081/api";
// axios.defaults.withCredentials = true;
axios.interceptors.response.use(
  (res) => {
    if (res.data.code !== 200) {
      // message.error(res.data.message);
    }
    return res.data;
  },
  (err) => {
    errorHandler(err);
    return err;
  }
);

const errorHandler = (err?) => {
  err && process.env.NODE_ENV == "development" && console.error(err);
  message.error(typeof err === "string" ? err : err.toString());
  if (err && err.response && err.response.status) {
    message.error(JSON.stringify(err.response.data));
  } else if (process.env.NODE_ENV == "production") {
    localStorage.removeItem("token");
    setTimeout(() => (window.location.href = "/"), 1000);
  }
};

const cors = Object.freeze(
  (() => {
    const name = "postmessage";
    const ret = { isHttp: window.location.protocol == "http:", setToken: void 0 };
    if (ret.isHttp) {
      let ifr = document.createElement("iframe");
      ifr.name = name;
      ifr.src = `http://${window.location.host + env.PUBLIC_URL}/${name}.html`;
      ifr.hidden = true;
      document.body.append(ifr);
      ret.setToken = () => {
        if (window.frames[name])
          setTimeout(() =>
            window.frames[name].postMessage(
              `localStorage.setItem('token','${localStorage.getItem("token")}')`,
              "http:" + window.location.host
            )
          );
      };
    }
    return ret;
  })()
);

const getToken = () => {
  let token = localStorage.getItem("token");
  try {
    token = JSON.parse(token);
  } catch (e) {
    console.error(e);
  } finally {
    return eval(token);
  }
};

let token;
let refreshTimer;
const checkToken = () => {
  if ((token = getToken())) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token.access_token;
    if ("expires" in token && Date.now() <= token.expires) {
      clearInterval(refreshTimer);
      refreshTimer = setInterval(() => {
        refresh(token.refresh_token);
      }, token.expires - Date.now());
      // return true;
    } else {
      refresh(token.refresh_token).then(checkToken).catch(errorHandler);
    }
    if (cors.isHttp) cors.setToken();
  } else {
    errorHandler("invalid_token!"); // return false
  }
};

const refresh = (refreshToken) => {
  return axios.post("/user/refresh_token", { refreshToken }).then((r) => {
    if (r.data) {
      r.data.expires = Date.now() + (r.data.expires_in - 60) * 1000;
      localStorage.setItem("token", JSON.stringify(r.data));
      token = r.data;
      axios.defaults.headers.common["Authorization"] = "Bearer " + r.data.access_token;
      return Promise.resolve();
    }
    return Promise.reject(r);
  });
};

window.addEventListener("storage", (e) => {
  process.env.NODE_ENV == "development" && console.log(e.key, e.newValue, e.oldValue);
  checkToken();
});
checkToken();
