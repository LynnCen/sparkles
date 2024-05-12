/**
 * @Description 底部按钮
 */

import { FC } from 'react';
import { Button } from 'antd';
import { doWeight, isArray, isNotEmpty } from '@lhb/func';
import {
  BUSINESS_FIT_ZOOM,
  CITY_FIT_ZOOM,
  DISTRICT_LEVEL,
  centerOfChina,
  centerOfChinaZoom
} from '@/common/components/AMap/ts-config';
// import cs from 'classnames';
// import styles from './entry.module.less';

const Footer: FC<any> = ({
  form, // 表单实例
  mapIns, // 地图实例
  mapHelpfulInfo,
  provinceData, // 省市数据
  districtData, // 区数据
  close, // 关闭弹窗
  searchParams, // 搜索条件
  searchNum, // 个数
  setSearchNum,
  setSearchParams, // 设置搜索入参
}) => {
  const resetHandle = () => {
    form.resetFields(); // 清空表单
    setSearchNum(0);
    const { secondLevelCategories } = searchParams || {}; // 只传商圈类型
    setSearchParams({
      secondLevelCategories
    }); // 重新请求接口
    mapIns.setZoomAndCenter(centerOfChinaZoom, centerOfChina); // 地图重置为全国范围
  };

  const submitHandle = () => {
    form.validateFields().then((res: any) => {
      const { provinceCity, districtIds } = res;
      const { level } = mapHelpfulInfo;
      // 城市变化时，设置选中的城市为地图中心点
      if (provinceCity?.[1] !== searchParams?.cityIds?.[0]) {
        setCityToCenter(provinceCity); // 设置选中的城市为地图中心点
      } else if (districtIdsIsChange(districtIds)) { // 区不同时
        level === DISTRICT_LEVEL && setDistrictToCenter(districtIds?.[0]); // 设置选中的城市为地图中心点
      }
      const params = refactorParams(res);
      setSearchParams(params);
      close();
    });
  };

  // 设置选中的城市为地图中心点
  const setCityToCenter = (provinceCity: any) => {
    const provinceId = provinceCity?.[0]; // 省市的id数组-省
    const cityId = provinceCity?.[1]; // 省市的id数组-市
    if (!(provinceId && cityId)) return;
    const targetProvince = provinceData.find((item: any) => item.id === provinceId);
    if (!targetProvince) return;
    const { children } = targetProvince;
    if (!isArray(children)) return;
    const targetCity = children.find((item: any) => item.id === cityId);
    if (!targetCity) return;
    const cityName = targetCity.name;
    mapIns.setCity(cityName);
    mapIns.setZoom(CITY_FIT_ZOOM); // 地图重置为市显示范围
  };

  // 设置区为地图中心点
  const setDistrictToCenter = (districtId: any) => {
    const { data } = districtData;
    const { district } = mapHelpfulInfo;
    const { id: curDistrictId } = district || {}; // 地图当前所在的区
    const targetId = districtId || curDistrictId;
    const targetDistrict = data.find((item: any) => item.id === targetId);
    if (!targetDistrict) return;
    const { name } = targetDistrict;
    mapIns.setCity(name); // setCity 也可以设置区名
    mapIns.setZoom(BUSINESS_FIT_ZOOM); // 地图重置为市显示范围
  };

  const refactorParams = (params = {}) => {
    // const { provinceCity, mainBrandsScore, districtIds } = params as any;
    const { provinceCity, mainBrandsScore } = params as any;
    const _params: any = {
      ...searchParams,
      ...params
    };
    if ((isArray(provinceCity) && provinceCity.length)) {
      _params.provinceIds = [provinceCity[0]];
      _params.cityIds = [provinceCity[1]];
      // 去掉默认将当前区带入筛选项params中
      // if (!(isArray(districtIds) && districtIds.length)) {
      //   const { district } = mapHelpfulInfo;
      //   const { id: districtId } = district || {}; // 地图当前所在的区
      //   _params.districtIds = [districtId];
      // }
    } else { // 点了重置之后，又点了确定按钮会进入此分支
      _params.provinceIds = [];
      _params.cityIds = [];
      _params.districtIds = [];
    }
    if (isArray(mainBrandsScore) && mainBrandsScore.length) { // 行业评分
      _params.mainBrandsScoreMin = isNotEmpty(mainBrandsScore[0]) ? mainBrandsScore[0] : null;
      _params.mainBrandsScoreMax = isNotEmpty(mainBrandsScore[1]) ? mainBrandsScore[1] : null;
    }
    Reflect.deleteProperty(_params, mainBrandsScore);
    return _params;
  };

  const districtIdsIsChange = (districtIds: number[]) => {
    if (districtIds?.length !== searchParams?.districtIds?.length) return true;
    if (districtIds?.length === 0) return true; // 清空了区域
    if (districtIds?.length && searchParams?.districtIds?.length) { // 选择过城区
      const uniqueIds = doWeight([...districtIds, ...searchParams?.districtIds]); // 去重
      return uniqueIds?.length !== districtIds?.length;
    }
    return false;
  };
  return (
    <>
      <Button onClick={resetHandle}>
          重置
      </Button>
      <Button onClick={close}>
          取消
      </Button>
      <Button
        type='primary'
        style={{ width: '95px' }}
        onClick={submitHandle}
      >
          确定{ searchNum ? `(${searchNum})` : ''}
      </Button>
    </>
  );
};

export default Footer;
