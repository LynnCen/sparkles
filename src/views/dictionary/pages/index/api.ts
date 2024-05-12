import { get, post } from '@/common/request/index';
// import { QueryParams } from './ts-config';

/**
 * 字典数据列表 https://yapi.lanhanba.com/project/289/interface/api/33181
 */
export async function dictionaryList() {
  return get('/dictionary/list', {}, {
    needHint: true,
    proxyApi: '/mirage'
  });
}

/**
 * 字典类型详情 https://yapi.lanhanba.com/project/289/interface/api/33177
 */
export async function dictionaryDetail(params: Record<string, any>) {
  return get('/dictionary/detail', params, {
    needHint: true,
    proxyApi: '/mirage'
  });
}

/**
 * 新增字典类型 https://yapi.lanhanba.com/project/289/interface/api/33173
 */
export async function addDictionaryType(params: Record<string, any>) {
  return post('/dictionary/create', params, {
    needHint: true,
    proxyApi: '/mirage'
  });
}

/**
 * 编辑字典类型 https://yapi.lanhanba.com/project/289/interface/api/33174
 */
export async function updateDictionaryType(params: Record<string, any>) {
  return post('/dictionary/update', params, {
    needHint: true,
    proxyApi: '/mirage'
  });
}


/**
 * 删除字典类型 https://yapi.lanhanba.com/project/289/interface/api/33175
 */
export async function delDictionaryType(params: Record<string, any>) {
  return post('/dictionary/delete', params, {
    needHint: true,
    proxyApi: '/mirage'
  });
}


/**
 * 字典类型对应的数据列表 https://yapi.lanhanba.com/project/289/interface/api/33181
 */
export async function dictionaryDataList(params: Record<string, any>) {
  return get('/dictionary/item/list', params, {
    needHint: true,
    proxyApi: '/mirage'
  });
}

/**
 * 新增字典类型对应的数据 https://yapi.lanhanba.com/project/289/interface/api/33178
 */
export async function addDictionaryData(params: Record<string, any>) {
  return post('/dictionary/item/create', params, {
    needHint: true,
    proxyApi: '/mirage'
  });
}

/**
 * 编辑字典类型对应的数据 https://yapi.lanhanba.com/project/289/interface/api/33179
 */
export async function updateDictionaryData(params: Record<string, any>) {
  return post('/dictionary/item/update', params, {
    needHint: true,
    proxyApi: '/mirage'
  });
}

/**
 * 删除字典项 https://yapi.lanhanba.com/project/289/interface/api/33180
 */
export async function delDictionaryData(params: Record<string, any>) {
  return post('/dictionary/item/delete', params, {
    needHint: true,
    proxyApi: '/mirage'
  });
}

/**
 * 字典项的数据详情 https://yapi.lanhanba.com/project/289/interface/api/33182
 */
export async function dictionaryDataDetail(params: Record<string, any>) {
  return get('/dictionary/item/detail', params, {
    needHint: true,
    proxyApi: '/mirage'
  });
}
