// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';
import { ConfigureType } from '@/pages/SettingConfig/data';

let config: ConfigureType = {
  _id: '1',
  sms_interval: 100,
  captcha_timeout: 100,
  rec_money_max_amount: 100,
  rec_env_remark: '100',
  red_env_timeout: 100,
  oto_red_env_max_sum: 100,
  rand_red_env_max_amount: 100,
  rand_red_env_max_sum: 100,
  rand_red_env_up_rate: 100,
  transfer_max_sum: 100,
  transfer_timeout: 100,
  scan_transfer_max_sum: 100,
  trans_bank_service_rate: 100,
  trans_bank_service_min: 100,
  trans_bank_max_sum: 100,
  trans_bank_min_sum: 100,
  withdraw_max_sum: 100,
  withdraw_min_sum: 100,
  withdraw_service_min: 100,
  withdraw_service_rate: 100,
  sensitive_words: '100',
};

function getList(req: Request, res: Response) {
  const result = {
    data: config,
    success: true,
  };

  return res.json(result);
}

function postList(req: Request, res: Response, u: string, b: Request) {
  const body = (b && b.body) || req.body;
  const { method, ...rest } = body;
  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'update':
      (() => {
        config = { ...config, ...rest };
      })();
      break;
    default:
      break;
  }

  const result = {
    data: config,
    success: true,
  };

  res.json(result);
}

export default {
  'GET /api/setting/config': getList,
  'POST /api/setting/config': postList,
};
