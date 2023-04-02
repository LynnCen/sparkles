import type { ConfigureType } from '@/pages/SettingConfig/data.d';
import { ConfRes } from '@/pages/SettingConfig/data.d'; 
import { PostJson } from '@/ts_pkc/ts-baselib';
import userspace from '@/userspace';

export async function getConfigure(): Promise<any> {
  const net = userspace.current?.nf.get('main')

  if (net) {
    return PostJson(
      '/setting/config',
      {},
      ConfRes,
      net
    )
  }

  return null
}

export async function setConfigure(params: ConfigureType, dataId: string) {
  const net = userspace.current?.nf.get('main')

 if (net) {
  return PostJson(
    '/setting/config',
    {
      ...params,
      id: dataId,
    },
    ConfRes,
    net
  )
 }

 return null
}
