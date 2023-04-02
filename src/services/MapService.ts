import BaseService from "./BaseService";

export default class MapService extends BaseService {
  private static key = "655edfee33010275be7ed57a8b1bf9a7";
  static getLocal(data, url, callback: (bool, res) => void) {
    const XMLHttp = new XMLHttpRequest();
    let QueryStr = `?key=${this.key}`;
    for (const key in data) {
      QueryStr += "&" + key + "=" + data[key];
    }
    XMLHttp.open("GET", url + QueryStr, true);
    XMLHttp.setRequestHeader("Accept", "application/json");
    XMLHttp.send();
    XMLHttp.onreadystatechange = () => {
      if (XMLHttp.readyState === 4) {
        if (XMLHttp.status === 200) {
          const result = JSON.parse(XMLHttp.responseText);
          callback(true, result);
        } else {
          callback(false, "Request was failure: " + XMLHttp.status);
        }
      }
    };
  }
  static getUserGPS(url, callback: (bool, res) => void, data?) {
    const XMLHttp = new XMLHttpRequest();
    let str = "?";
    if (data) {
      for (const key in data) {
        str += key + "=" + data[key] + "&";
      }
    }
    XMLHttp.open("GET", url + str, true);
    XMLHttp.setRequestHeader("Accept", "application/json");
    XMLHttp.send();
    XMLHttp.onreadystatechange = () => {
      if (XMLHttp.readyState === 4) {
        if (XMLHttp.status === 200) {
          const result = JSON.parse(XMLHttp.responseText);
          callback(true, result);
        } else {
          callback(false, "Request was failure: " + XMLHttp.status);
        }
      }
    };
  }
  static getData(data, callback: (bool, res) => void) {
    const request = super.completeUrl(
      "http://192.168.1.196:1236/yidon/API/findInfoTest"
    );
    request.get();
    request.params(data);
    request.execute(data, callback);
  }

  static getPCI(data, callback: (bool, res) => void) {
    const request = super.completeUrl(
      "http://192.168.1.196:1236/yidon/API/findLTEByInfoTestPCI"
    );
    request.get();
    request.params(data);
    request.execute(data, callback);
  }
  static getDistrict(data) {
    return fetch(
      `https://restapi.amap.com/v3/config/district?keywords=${
        data.keywords
      }&subdistrict=${data.subdistrict || 3}&key=${this.key}`
    )
      .then(r => r.json())
      .catch(console.error);
  }
}
