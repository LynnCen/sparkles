import ReactDOM from "react-dom";

var AsyncFunction = Object.getPrototypeOf(async function() {}).constructor;
export const asyncImport = src =>
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
type Script = { src: string; id?: string; type?: string; globalVar?: any };
export function loadScript(src: string, id?: string, type?: string): Promise<any>;
export function loadScript(src: string, id?: string, globalVar?: object | undefined): Promise<any>;
export function loadScript(params: Script): Promise<any>;
export function loadScript() {
  let params = { src: "", id: "", type: "", globalVar: undefined };
  if (arguments.length == 1 && arguments[0].toString() == "[object Object]") params = arguments[0];
  else if (arguments.length == 3) {
    params.src = arguments[0];
    params.id = arguments[1];
    let arg = arguments[2];
    typeof arg === "string" ? (params.type = arg) : (params.globalVar = arg);
  } else
    Object.keys(params)
      .slice(0, arguments.length)
      .forEach((k, i) => (params[k] = arguments[i]));
  let { src, id, type, globalVar } = params;
  const isModule = type && type == "module";
  const _id = isModule ? "__esModule__" + id : id;
  const isExisted = globalVar
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
          .then(m => ((window[_id] = m), resolve(m)))
          .catch(reject);
      // resolve(asyncImport(src));
      else {
        script.src = src; // URL for the third-party library being loaded.
        script.onload = resolve;
        script.onerror = () => (
          script.remove(), reject(new Error("Failed to load script with src " + src))
        );
      }
    } else resolve(isModule ? window[_id] : globalVar);
  });
}

/**
 * 取颜色不透明度
 * @param hexColor
 */
export const getOpacityFromColor: (hexColor: string) => number = (hexColor: string) => {
  const matches = hexColor.match(/^#?([0-9a-f]+){6,8}$/gi);
  if (matches) {
    if (/^#?([0-9a-f]+){8}$/gi.test(hexColor)) {
      return Math.floor((parseInt(hexColor.slice(-2), 16) / 255) * 100);
    }
    return 100;
  }
  return NaN;
};
/**
 * 取颜色前6位hex（不含不透明度）
 * @param hexColor
 */
export const getOpaqueFromColor: (hexColor: string) => string = (hexColor: string) => {
  const matches = hexColor.match(/^#?([0-9a-f]+){6,8}$/gi);
  if (matches) {
    if (/^#?([0-9a-f]+){8}$/gi.test(hexColor)) {
      return hexColor.substr(-8, 6);
    }
    return hexColor.substr(-6);
  }
  return "";
};

/**
 * 去抖动
 * @param func 要执行的函数
 * @param wait 延迟时间
 */
export const debounce = (func, wait: number) => {
  if (typeof func != "function") throw new TypeError("Expected a function");
  let timer;
  return function(...args) {
    let context = this;
    clearTimeout(timer);
    timer = setTimeout(func.bind(context, ...args), typeof wait == "number" ? wait : 0);
  };
};

export const videoMetadata = (url: string) => {
  const dom = document.createElement("video");
  dom.src = url;
  return new Promise((resolve, reject) => {
    dom.onloadedmetadata = () => {
      let { videoWidth, videoHeight, duration } = dom;
      resolve({ videoWidth, videoHeight, duration });
    };
    dom.onerror = reject;
  });
};

export const render = (element, selector: string) => {
  const interval = setInterval(() => {
    const el = document.querySelector(selector);
    if (el) {
      ReactDOM.render(element, el);
      clearInterval(interval);
    }
  });
};

export const swap = (a: object, b: object, key: string) => {
  if (Object.prototype.toString.call(a) != "[object Object]")
    throw new TypeError("Expected a object");
  let t = a[key];
  a[key] = b[key];
  b[key] = t;
};
