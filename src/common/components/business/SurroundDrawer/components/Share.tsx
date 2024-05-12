/**
 * @Description 周边详情-分享按钮
 * 分享url为移动端area-insight项目页面/insight/surrounding
 *  query参数
 *   lat
 *   lng
 *   radius
 *   address
 *   cityId
 *   cityName
 *   createdAt
 *   tenantId: 租户id
 *   accountId: 员工id
 *   isFromHistory: 历史详情页中分享时传1，实时查询页分享时不传
 *   isShare: 固定1
 */

import { FC } from 'react';
import { Button } from 'antd';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import IconFont from '@/common/components/IconFont';
import copy from 'copy-to-clipboard';
import { getCookie } from '@lhb/cache';
import { getLink } from '@/common/api/common';

// 机会点详情周边信息
export interface ShareDetailProps {
  lat: number;
  lng: number;
  radius: number; // 周边查询半径（米）
  address: string;
  cityId: number;
  cityName: string;
  createdAt?: string;
  poiSearchType: number;
  borders: any;
  area: number;
}

export interface ShareProps {
  detail: ShareDetailProps; // 周边信息
  isFromHistory?: boolean; // 是否历史详情页
  className?: string;
}

const Share: FC<ShareProps> = ({
  detail,
  isFromHistory = false,
  className = ''
}) => {
  const onShare = async() => {
    const tenantId = getCookie('tenantId');// 租户id
    const accountId = getCookie('employeeId');// 员工id

    const { lat, lng, radius, address, cityId, cityName, createdAt, poiSearchType, borders, area } = detail;
    const params: any = {
      lat: lat || '', // 多边形时没数据
      lng: lng || '', // 多边形时没数据
      radius: radius || 0, // 多边形时没数据
      address: encodeURI(address),
      cityId,
      cityName: encodeURI(cityName),
      createdAt: encodeURI(createdAt || ''),
      poiSearchType,
      borders: borders ? encodeURI(JSON.stringify(borders)) : '', // 多边形时没数据
      area,
      tenantId,
      accountId,
    };
    if (isFromHistory) {
      params.isFromHistory = 1;
    }

    let link = `${process.env.INSIGHT_URL}/insight/surrounding?isShare=1`;
    // let link = `https://insight.lanhanba.com/insight/surrounding?isShare=1`;
    Object.keys(params).forEach(key => {
      link += `&${key}=${params[key]}`;
    });
    const shortLink = await getLink({ url: link });
    // console.log('shortLink', shortLink);
    copy(shortLink?.url);
    V2Confirm({
      onSure: (modal: any) => modal.destroy(),
      content: '链接已复制，可直接发送给你的朋友',
      okText: '好的'
    });
  };

  return (
    <div className={className}>
      <Button onClick={onShare} icon={<IconFont iconHref='iconic_share2' />}>
        <span className='ml-4'>分享</span>
      </Button>
    </div>
  );
};

export default Share;
