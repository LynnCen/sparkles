import { libsMap } from '../enums/libs-map';

const loadMap: { [key: string]: any } = {}; // 资源已加载清单
/**
 * 加载cndjs库（不一定await使用，酌情处理）
 * 挂载在Window上，可通过window.getCss(libName)
 * @export
 * @param {*} libName libs-map.ts中的css库名
 * @param {string} targetElm 插入的位置
 * @param {any} trueDocument 真实的document，在微应用的时候，需要传入container
 * @returns
 */
export function getCss(libName: string, targetElm = 'head', trueDocument = document) {
  if (!libName) {
    return;
  }
  if (!loadMap[libName]) {
    loadMap[libName] = new Promise((resolve, reject) => {
      const libSrc = libsMap[libName];
      if (!libSrc) {
        reject(`lib '${libName}' not defined`);
      }
      const link = trueDocument.createElement('link');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.href = libSrc;
      link.onload = () => {
        resolve(undefined);
      };
      link.onerror = () => {
        reject();
      };
      const head: Element | null = trueDocument.querySelector(targetElm);
      head && head.appendChild(link);
    });
  }
  return loadMap[libName];
}
