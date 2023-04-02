export interface ConfigureType {
  _id: string;
  sms_interval?: number;
  captcha_timeout?: number;
  rec_money_max_amount?: number;
  rec_env_remark?: string;
  red_env_timeout?: number;
  oto_red_env_max_sum?: number;
  rand_red_env_max_amount?: number;
  rand_red_env_max_sum?: number;
  rand_red_env_up_rate?: number;
  transfer_max_sum?: number;
  transfer_timeout?: number;
  scan_transfer_max_sum?: number;
  trans_bank_service_rate?: number;
  trans_bank_service_min?: number;
  trans_bank_max_sum?: number;
  trans_bank_min_sum?: number;
  withdraw_max_sum?: number;
  withdraw_min_sum?: number;
  withdraw_service_min?: number;
  withdraw_service_rate?: number;
  sensitive_words?: string;
}

export class ConfRes extends ConfigureType {
}
