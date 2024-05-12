export interface Config {
  [p: string]: any;
}

export interface RequestGet {
  (url: string, params: any, config?: RequestConfig | boolean | undefined): any;
}
export interface RequestPost {
  (url: string, data: any, config?: RequestConfig | boolean | undefined): any;
}

export interface GetScript {
  (name: string): any;
}
export interface GetCss {
  (name: string): any;
}

export interface RequestConfig {
  /** 是否需要切换路由时取消当前请求 */
  needCancel?: any;
  isMock?: boolean;
  isRadar?: boolean;
  mockId?: number | string;
  needHint?: boolean;
  proxyApi?: string;
  /** 错误提示配置 */
  errorConfig?: {
    /** 是否需要直接打印提示 */
    needHint?: boolean;
    /** 错误显示时间 */
    duration?: number;
    /** 是否显示关闭按钮 */
    showClose?: boolean;
  };
  headers?: any;
  /** 响应的数据类型，如果是接收字节流数据：responseType: 'blob' */
  responseType?: '' | 'text' | 'document'| 'json' | 'blob' | 'arrayBuffer' | 'stream';
  responses?: any; // 额外的请求头设置
}
