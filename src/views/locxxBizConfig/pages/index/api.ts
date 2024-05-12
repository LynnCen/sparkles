import { post } from '@/common/request/index';
// import { QueryParams } from './ts-config';

/**
 * 配置项列表 https://yapi.lanhanba.com/project/560/interface/api/69915
 */
export async function dictionaryList() {
  return post('/bizConfig/list', {}, {
    needHint: true,
    proxyApi: '/zhizu-api'
  });
}

/**
 * 配置分组-详情 https://yapi.lanhanba.com/project/560/interface/api/69922
 */
export async function dictionaryDetail(params: Record<string, any>) {
  return post('/bizConfig/detail', params, {
    needHint: true,
    proxyApi: '/zhizu-api'
  });
}

/**
 * 新增配置分组 https://yapi.lanhanba.com/project/560/interface/api/69894
 */
export async function addDictionaryType(params: Record<string, any>) {
  return post('/bizConfig/create', params, {
    needHint: true,
    proxyApi: '/zhizu-api'
  });
}

/**
 * 编辑配置分组 https://yapi.lanhanba.com/project/560/interface/api/69901
 */
export async function updateDictionaryType(params: Record<string, any>) {
  return post('/bizConfig/update', params, {
    needHint: true,
    proxyApi: '/zhizu-api'
  });
}


/**
 * 删除配置分组 https://yapi.lanhanba.com/project/560/interface/api/69908
 */
export async function delDictionaryType(params: Record<string, any>) {
  return post('/bizConfig/delete', params, {
    needHint: true,
    proxyApi: '/zhizu-api'
  });
}


/**
 * 配置项列表 https://yapi.lanhanba.com/project/560/interface/api/69936
 */
export async function dictionaryDataList(params: Record<string, any>) {
  return post('/bizConfig/item/list', params, {
    needHint: true,
    proxyApi: '/zhizu-api'
  });
}

/**
 * 新增配置项 https://yapi.lanhanba.com/project/560/interface/api/69943
 */
export async function addDictionaryData(params: Record<string, any>) {
  return post('/bizConfig/item/create', params, {
    needHint: true,
    proxyApi: '/zhizu-api'
  });
}

/**
 * 编辑配置项 https://yapi.lanhanba.com/project/560/interface/api/69950
 */
export async function updateDictionaryData(params: Record<string, any>) {
  return post('/bizConfig/item/update', params, {
    needHint: true,
    proxyApi: '/zhizu-api'
  });
}

/**
 * 删除配置项 https://yapi.lanhanba.com/project/560/interface/api/69957
 */
export async function delDictionaryData(params: Record<string, any>) {
  return post('/bizConfig/item/delete', params, {
    needHint: true,
    proxyApi: '/zhizu-api'
  });
}

/**
 * 配置项详情 https://yapi.lanhanba.com/project/560/interface/api/69964
 */
export async function dictionaryDataDetail(params: Record<string, any>) {
  return post('/bizConfig/item/detail', params, {
    needHint: true,
    proxyApi: '/zhizu-api'
  });
}
