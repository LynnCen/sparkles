export interface LoginParams {
  /**
   * 验证码
   */
  code?: string;
  /**
   * 手机号
   */
  mobile?: string;
  /**
   * 密码
   */
  password?: string;
  /**
   * 租户简称
   */
  tenant: string;
  /**
   * 用户名
   */
  username?: string;
}

export interface LoginResult {
  /**
   * 账号id
   */
  accountId: number;
  /**
   * 是否归属多个租户
   */
  multiTenant: boolean;
  /**
   * token
   */
  token: string;
}
