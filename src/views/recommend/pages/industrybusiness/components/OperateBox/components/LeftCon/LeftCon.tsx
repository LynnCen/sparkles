/**
 * @Description 左侧树结构
 */

import { FC, useEffect, useState } from 'react';
import styles from './index.module.less';
// import cs from 'classnames';
// import { dispatchNavigate } from '@/common/document-event/dispatch';
import { getSelection } from '@/common/api/networkplan';
// import { urlParams } from '@lhb/func';
import IconFont from '@/common/components/IconFont';
import { Switch } from 'antd';
import ClusterTypeTree from '@/common/components/business/ClusterTypeTree';
import BrandTree from './BrandTree';
import RankTree from './RankTree';
import { COUNTRY_LEVEL } from '@/common/components/AMap/ts-config';

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
      node?.icon ? <IconFont iconHref={node?.icon} className='fs-18 mr-4'/> : <></>
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

  const [brandTreeData, setBrandTreeData] = useState<any>([]);

  // 初始化数据
  const getTreeData = async() => {
    const { planStoreStatus } = await getSelection({ module: 1 });
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

  const onClusterTypeSelect = (secondLevelIds, secondLevelNames) => {
    // 行业商圈页，接口只支持传names进行筛选
    setBusinessTypeList(secondLevelNames);
  };

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
    <div className={styles.listWrapper}>
      {/* 商圈类型二级选择 */}
      <ClusterTypeTree
        onSelect={onClusterTypeSelect}
      />
      {/* 本品牌门店分布 */}
      <BrandTree
        brandTreeData={brandTreeData}
        setBrandTreeData={setBrandTreeData}
        level={level}
        city={city}
        amapIns={amapIns}
      />
      {/* 展示商圈排名（全国状态下隐藏） */}
      {level !== COUNTRY_LEVEL ? <RankTree
        setMapShowType={setMapShowType}
      /> : <></>}
    </div>
  </div>;
};
export { LeftCon, TreeNode };
