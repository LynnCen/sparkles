/**
 * @Description 左侧树结构
 */

import { FC, useEffect, useState } from 'react';
import styles from './index.module.less';

// import { dispatchNavigate } from '@/common/document-event/dispatch';
import { getSelection } from '@/common/api/networkplan';
// import { urlParams } from '@lhb/func';
import IconFont from '@/common/components/IconFont';
import { Switch } from 'antd';
import BusinessTree from './BusinessTree';
import BrandTree from './BrandTree';
import RankTree from './RankTree';

const BusinessType = 'BusinessType';
const BrandType = 'BrandType';
export const RankType = 'RankType';

const TreeNode = ({ node, clickSwitch }) => {
  return <div className={styles.treeNode}>
    {node?.color ? <span
      style={{
        backgroundColor: node?.color
      }}
      className={styles.circleColor}></span> : <></>}
    {
      node?.icon ? <IconFont iconHref={node?.icon} className='fs-18 mr-6'/> : <></>
    }
    <span className={node?.children?.length ? 'bold' : ''}>{node.title}</span>
    <Switch
      className={styles.switch}
      onClick={(checked) => clickSwitch(node, checked, BrandType)}
      checked={node.checked}
      size='small' />
  </div>;
};


const LeftCon:FC<any> = ({
  level,
  amapIns,
  city,
  setBusinessTypeList,
  setMapShowType,
}) => {

  // const {
  //   originPath,
  //   branchCompanyId,
  //   isBranch,
  //   planId,
  //   branchCompanyName,
  //   isActive
  // } = JSON.parse(decodeURI(urlParams(location.search)?.params || null)) || {};

  const [businessTreeData, setBusinessTreeData] = useState<any>([]);
  const [brandTreeData, setBrandTreeData] = useState<any>([]);

  // 初始化数据
  const getTreeData = async() => {
    // module 1 网规相关，2行业商圈 （通用版）
    const { firstLevelCategory, planStoreStatus } = await getSelection({ module: 2 });
    // 初始化商圈数据
    const businessTreeData:any = [
      {
        title: '商圈类型展示',
        key: BusinessType,
        checked: true,
        children: [],
      },
    ];
    firstLevelCategory?.map((item) => {
      businessTreeData[0].children.push({
        color: item?.color,
        title: item?.name,
        key: item?.id,
        checked: true// 初始化时，商圈类型展示默认勾选
      });
    });
    setBusinessTreeData(businessTreeData);

    // 初始化本品牌门店分布数据
    const brandTreeData:any = [
      {
        title: '本品牌门店分布',
        key: BrandType,
        checked: false,
        children: [],
      }
    ];
    planStoreStatus?.map((item) => {
      brandTreeData[0].children.push({
        // 目前只有两种情况id 1和 2
        icon: item?.id === 1 ? 'iconic_yikaidian' : 'iconic_yibidian',
        key: item?.id,
        checked: false, // 初始化时，商圈类型展示默认勾选
        title: item?.name
      });
    });
    setBrandTreeData(brandTreeData);
  };

  // 返回列表按钮
  // const backToList = async() => {
  //   const params:any = {
  //     branchCompanyId,
  //     planId,
  //     isBranch,
  //     branchCompanyName,
  //     isMapReturn: true,
  //     isActive,
  //   };
  //   // 当外部没传或者用手动更改url后，根据当前的权限判断，如果存在总公司权限，则默认跳转到规划管理（总部)
  //   let path:any;
  //   if (!originPath) {
  //     const permission = await getPermission();
  //     path = permission?.parentCompanyPermission ? '/networkplan' : '/branchnetworkplan';
  //   }
  //   dispatchNavigate(`/recommend${originPath || path}?params=${JSON.stringify(params)}`);
  // };

  // 初始化数据
  useEffect(() => {
    getTreeData();
  }, []);

  return <div className={styles.leftCon}>
    {/* {originPath !== 'chancepoint' ? <div className={styles.leftConTop}>
      <span className={styles.brandName}>{branchCompanyName || '-'}</span>
      <div className={styles.backBtn} onClick={() => backToList()}>
        <IconFont iconHref='iconic_fanweiliebiao' className='inline-block mr-5' />返回列表
      </div>
    </div> : <></>} */}
    {/* 商圈类型展示和本品牌门店分布 */}
    <BusinessTree
      businessTreeData={businessTreeData}
      setBusinessTreeData={setBusinessTreeData}
      setBusinessTypeList={setBusinessTypeList}
    />
    {/* 本品牌门店分布 */}
    <BrandTree
      brandTreeData={brandTreeData}
      setBrandTreeData={setBrandTreeData}
      level={level}
      city={city}
      amapIns={amapIns}
    />
    {/* 展示商圈排名 */}
    <RankTree
      setMapShowType={setMapShowType}
    />
  </div>;
};
export { LeftCon, TreeNode };
