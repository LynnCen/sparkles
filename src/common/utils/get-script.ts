import { libsMap } from '../enums/libs-map';

const loadMap: { [key: string]: any } = {}; // 资源已加载清单
/**
 * 加载cndjs库
 * 挂载在window上，可通过window.getScript(libName)
 * @export
 * @param {*} libName libs-map.ts中的js库名
 * @param {any} trueDocument 真实的document，在微应用的时候，需要传入container
 * @param {any} trueBody 真实的body
 * @returns
 */
export function getScript(libName: string, trueDocument = document, trueBody = document.body) {
  if (!libName) {
    return;
  }
  if (!loadMap[libName]) {
    loadMap[libName] = new Promise((resolve, reject) => {
      const libSrc = libsMap[libName];
      if (!libSrc) {
        reject(`lib '${libName}' not defined`);
        return;
      }
      const script = trueDocument.createElement('script');
      script.src = libSrc;
      script.onload = () => {
        trueBody.removeChild(script);
        resolve(undefined);
      };
      script.onerror = () => {
        trueBody.removeChild(script);
        reject();
      };
      trueBody.appendChild(script);
    });
  }
  return loadMap[libName];
}
