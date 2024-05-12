/**
 * @Description 生成图片
 */
import { get, post } from '@/common/request/index';

/**
 * 生成图片
 * https://yapi.lanhanba.com/project/497/interface/api/54501
 */
export function generateImage(params: any) {
  return post('/yn/exportImgUrl', params, {
    isMock: false,
    mockId: 497,
    needHint: true,
    needCancel: false
  });
}

/**
 * 周边5公里门店
 * https://yapi.lanhanba.com/project/349/interface/api/51575
 */
export function rimShopData(params: any) {
  return get('/map/shop/yn/surroundingShops', params, {
    isMock: false,
    mockId: 497,
    needHint: true,
    isZeus: true,
  });
}
