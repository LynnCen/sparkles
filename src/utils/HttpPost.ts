import { message } from "antd";
import Config from "../config/Config";

class HttpPost {
  url: string;
  queryStr: string = "?";
  private method: string = "POST";
  private withCredentials: boolean = true;

  constructor(url: string) {
    this.url = url;
  }

  public get(): void {
    this.method = "GET";
  }

  public put(): void {
    this.method = "PUT";
  }

  public del(): void {
    this.method = "DELETE";
  }

  public disabledWithCredentials(): void {
    this.withCredentials = false;
  }

  query(key: string, value: any): HttpPost {
    this.queryStr += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    return this;
  }

  params(obj: any) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        this.queryStr += `&${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`;
      }
    }
  }

  post(successCallBack: (result: any) => void, errorCallBack: (error: string) => void); // 2
  post(data: any, successCallBack: (result: any) => void, errorCallBack: (error: string) => void); // 3
  post(...args) {
    let data;
    let successCallBack;
    let errorCallBack;
    if (args.length === 2) {
      data = this.queryStr.substring(2);
      successCallBack = args[0];
      errorCallBack = args[1];
    } else {
      data = JSON.stringify(args[0]);
      successCallBack = args[1];
      errorCallBack = args[2];
    }

    const xhr = new XMLHttpRequest();
    if (this.method === "GET") {
      xhr.open(this.method, this.url + this.queryStr, true); // get传递
      xhr.setRequestHeader("Content-Type", "application/json");
    } else if (this.method === "DELETE") {
      xhr.open(this.method, this.url + this.queryStr, true); // del传递
    } else if (args.length === 2) {
      xhr.open(this.method, this.url, true); // post传递
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    } else {
      xhr.open(this.method, this.url + this.queryStr, true); // body @RequestBody
      xhr.setRequestHeader("Content-Type", "application/json");
    }
    xhr.timeout = 30000; // 超时时间
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Accept-Language", "zh-cn,zh;q=0.5");
    if (this.withCredentials) xhr.withCredentials = true;
    /*使用 xhr 来模仿表单提交，加一个请求头部。*/
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        // 4表示准备完成
        if (xhr.status === 200) {
          // 200表示回调成功
          const result = JSON.parse(xhr.responseText);
          // 返回的数据,这里返回的是json格式数据
          if (result.code === 200 || result.status === "1") {
            successCallBack(result);
          } else if (result.code === 400 || result.status === "0") {
            errorCallBack(result);
          } else if (result.code === 401) {
            /#\/(edit|shareppt)/.test(location.hash)
              ? (message.error(result.message), Config.goLogin())
              : errorCallBack(result);
          }
        } else {
          errorCallBack("请求超时😦~");
        }
      }
    };
    xhr.send(data); // 发送数据
  }

  execute(callBack: (flag: boolean, result: any) => void);
  execute(data: any, callBack: (flag: boolean, result: any) => void); // 2
  execute(...args) {
    if (args.length === 2) {
      // 3
      this.post(args[0], res => args[1](true, res), res => args[1](false, res));
    } else {
      // 2
      this.post(res => args[0](true, res), res => args[0](false, res));
    }
  }
  exec();
  exec(data: object);
  exec(...args) {
    return new Promise((resolve, reject) => {
      args.push(resolve, reject);
      return this.post(...args);
    });
  }
}

export default HttpPost;
