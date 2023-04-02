import request from '@/utils/request';
import { PostJson } from '@/ts_pkc/ts-baselib';
import userspace from '@/userspace';
import { LangListRes } from './common-type';
import { ClassArray } from '@/ts_pkc/ts-json';


class LangItem {
  constructor(
    public id: string,
    public name: string
  ) {}
}
class LangRes {
  constructor(
    public err_code: number,
    public items: LangItem[] = new ClassArray(LangItem)
  ) {}
}
export async function getLangList() {
  const net = userspace.current?.nf.get('main')

  if (net) {
    return PostJson(
      '/language',
      {},
      LangRes,
      net
    )
  }

  return null
}

export async function getRegionList() {
  const net = userspace.current?.nf.get('main')

  return request('/common/region', {
    method: 'GET',
  });
}

export async function uploadFile(file: string | Blob, url = '/upfile', type = 1) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', String(type));
  return request.post(url, {
    data: formData,
    requestType: 'form',
  });
}


class STSInfo {
  constructor(
    public access_key_id: string,
    public access_key_secret: string,
    public expire: number,
    public session_token: string,
  ) {}
}
export class STSItems {
  constructor(
    public base_host: string,
    public crop_host: string,
    public bucket_id: string,
    public bucket_name: string,
    public region: string,
    public expire: number,
    public sts: STSInfo = new STSInfo('','',0,'')
  ) {}
}
export async function getSTS(bucket_id?: string) {
  const net = userspace.current?.nf.get('main')

  let params: { bucket_id?: string } = {}
  if (bucket_id) {
    params.bucket_id = bucket_id
  }

  if (net) {
    return PostJson(
      '/bucketInfo',
      params,
      STSItems,
      net
    )
  }
  
  return null;
}

interface TitleWithLangs {
  lang: string;
  title: string;
}

interface BucketObjectTypeImg {
  bucketId: string;
  file_type: string;
  text: string;
  width: number;
  height: number;
}

export { TitleWithLangs, BucketObjectTypeImg };
