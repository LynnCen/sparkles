import { Component } from "react";
import ReactDOM from "react-dom";

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

export const asyncImport = (src) =>
  new AsyncFunction(
    `return new Promise((resolve, reject) => import('${src}').then(resolve).catch(reject))`
  )();

/** load ES module
  * @example
    loadScript("./test/test.js", "test", "module")
     .then(console.log)
     .catch(console.error);
    (async () => {
      const { b } = await loadScript("./test/test.js", "test", "module");
      console.log(b);
    })();
 */
type Script = { src: string; id?: string; type?: string; variable?: any };
export function loadScript(src: string, id?: string, type?: string): Promise<any>;
export function loadScript(src: string, id?: string, variable?: object | undefined): Promise<any>;
export function loadScript(param: Script): Promise<any>;
export function loadScript(...args) {
  let param = { src: "", id: "", type: "", variable: undefined };
  if (args.length == 1 && args[0].toString() == "[object Object]") param = args[0];
  else if (args.length == 3) {
    param.src = args[0];
    param.id = args[1];
    let arg = args[2];
    typeof arg === "string" ? (param.type = arg) : (param.variable = arg);
  } else
    Object.keys(param)
      .slice(0, args.length)
      .forEach((k, i) => (param[k] = args[i]));
  let { src, id, type, variable } = param;
  const isModule = type && type == "module";
  const _id = isModule ? "__esModule__" + id : id;
  const isExisted = variable
    ? true
    : isModule
    ? window[_id]
    : _id
    ? document.getElementById(id)
    : false;
  return new Promise((resolve, reject) => {
    if (!isExisted) {
      const script = document.createElement("script");
      id && (script.id = id);
      document.body.appendChild(script);
      if (isModule)
        asyncImport(src)
          .then((m) => ((window[_id] = m), resolve(m)))
          .catch(reject);
      // resolve(asyncImport(src));
      else {
        script.src = src; // URL for the third-party library being loaded.
        script.onload = resolve;
        script.onerror = () => (
          script.remove(), reject(new Error("Failed to load script with src " + src))
        );
      }
    } else resolve(isModule ? window[_id] : variable);
  });
}

export const vh = (px) => (px / 1080) * 100 + "vh";
export const vw = (px) => (px / 1920) * 100 + "vw";

export const percentage = (num: number, scale = 0) =>
  isNaN(num) ? 0 : (num <= 1 ? num * 100 : num).toFixed(scale);

export const render = (element, selector: string, callback: Function = () => {}) => {
  const interval = setInterval(() => {
    const el = document.querySelector(selector);
    if (el) {
      ReactDOM.render(element, el);
      clearInterval(interval);
      setTimeout(callback);
    }
  }, 10);
};

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
export const isFullscreen = () => !!document.fullscreenElement;

export const isMobile = () =>
  navigator.userAgent.match(
    /phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone/
  );

export const getPosition = () => {
  if (navigator.geolocation) {
    return new Promise<Position>((res, rej) => {
      navigator.geolocation.getCurrentPosition(res, (e) => (console.error(e), rej(e)), {
        enableHighAccuracy: true,
      });
    });
  }
  return Promise.reject();
};

/** wms
 * @param source
 *  layers: { [k: string]: null | boolean },
 *  viewparams: string
 */
export const mergeParams = (
  target: string,
  source: string | { [k: string]: null | boolean },
  {
    compare = (t: string, s: string) => t.split(":")[0] == s.split(":")[0],
    separator = ",",
    insert = "push", //"push"|"unshift"
  } = {}
) => {
  const filteredTarget = (target || "").split(separator).filter((p) => p.split(":").length == 2);
  const filteredSource =
    typeof source == "string"
      ? source.split(separator).filter((p) => p.split(":").length == 2)
      : Object.entries(source);
  filteredSource.forEach((s) => {
    if (typeof s == "string") {
      // "townCode:001;classId:'11111'"
      let idx = filteredTarget.findIndex((t) => (compare ? compare(t, s) : t == s));
      if (idx > -1) {
        filteredTarget.splice(idx, 1, s);
      } else filteredTarget[insert](s);
    } else {
      let [key, v] = s;
      if (key.includes(separator)) {
        let keys = key.split(separator).filter((k) => k.includes(":"));
        if (keys.every((k) => filteredTarget.includes(k))) {
          if (!v) {
            keys.forEach((k) => {
              let idx = filteredTarget.findIndex((t) => t == k);
              filteredTarget.splice(idx, 1);
            });
          }
        } else if (v) filteredTarget[insert](...keys);
      } else {
        let idx = filteredTarget.findIndex((t) => t == key);
        if (idx > -1 && !v) {
          filteredTarget.splice(idx, 1);
        } else if (idx == -1 && v) filteredTarget[insert](key);
      }
    }
  });
  return filteredTarget.join(separator);
};
