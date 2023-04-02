export default class CustomFun {
  static copy(obj) {
    const newObj = {};
    for (const item in obj) {
      if (obj.hasOwnProperty(item)) {
        newObj[item] = obj[item];
      }
    }
    return newObj;
  }

  static onKeyDown(e, code, fun: () => void) {
    if (e.keyCode === code) {
      fun();
    }
  }

  /**
   * @description rgb转十六进制
   * @param r
   * @param g
   * @param b
   * @param a
   */
  static hexify(r, g, b, a) {
    const aa = parseFloat(a || 1),
      rr = Math.floor(aa * parseInt(r) + (1 - a) * 255),
      gg = Math.floor(aa * parseInt(g) + (1 - a) * 255),
      bb = Math.floor(aa * parseInt(b) + (1 - a) * 255);
    return "#" +
      ("0" + rr.toString(16)).slice(-2) +
      ("0" + gg.toString(16)).slice(-2) +
      ("0" + bb.toString(16)).slice(-2);
  }
}
