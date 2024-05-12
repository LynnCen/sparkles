/**
 * @Description
 */
import { FC, useEffect, useRef, useState } from 'react';
import { TreeNode } from './LeftCon';
import { Tree } from 'antd';
import { CITY_LEVEL, PROVINCE_LEVEL } from '@/common/components/AMap/ts-config';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { deepCopy, isArray } from '@lhb/func';

import { Status } from '../../../../ts-config';
import ReactDOM from 'react-dom';
import Card from './Card';
import { v4 } from 'uuid';
import { getStoreList } from '@/common/api/networkplan';
import styles from './index.module.less';
const BrandTree:FC<any> = ({
  brandTreeData,
  setBrandTreeData,
  level,
  city,
  amapIns
}) => {
  const [storeData, setStoreData] = useState<any>(null);

  const labelMarkerRef = useRef<any>(null);
  const markerRef = useRef<any>([]);

  // 点击Switch
  const clickSwitch = (node, checked) => {
    if (checked && level <= PROVINCE_LEVEL) {
      V2Message.warning('地图放大至区级呈现门店分布数据');
      return;
    }
    // 由于目前树结构只存在两层，所以不需要多层次递归遍历
    const res = brandTreeData.map((item) => {
      let allFlagTrue = true;// 当点击过子节点后，判断同级子节点是否全已选中
      // 点击父节点
      if (item.key === node.key) {
        // 设置本身的checked
        item.checked = checked;
        // 如果存在子元素，则设置子元素的checked
        item?.children?.map((child) => {
          child.checked = checked;
        });
        return item;
      }
      // 点击子节点
      item?.children?.map((child) => {
        if (child.key === node.key) {
          child.checked = checked;
        }
        if (!child.checked) {
          allFlagTrue = false;
        }
      });
      // 当子节点没有都已选中时，父节点设为不选中
      item.checked = allFlagTrue;

      return item;
    });
    setBrandTreeData(res);
  };
  // 根据勾选项获取对应状态的门店数据
  const getStoreData = async(checkList) => {
    if (!checkList?.length) {
      setStoreData([]);
      return;
    }
    let params :any = {
      statusList: checkList,
    };
    if (level === PROVINCE_LEVEL) {
      params = {
        ...params,
        provinceId: city?.provinceId
      };
    }
    if (level >= CITY_LEVEL) {
      params = {
        ...params,
        provinceId: city?.provinceId,
        cityId: city?.id
      };
    }
    const data = await getStoreList(params);
    setStoreData(data);
  };

  // 绘制本品牌门店marker
  const drawStoreMarker = () => {
    isArray(markerRef.current) && markerRef.current.length &&
    markerRef.current.map((marker) => {
      amapIns.remove(marker);
    });
    markerRef.current = [];
    labelMarkerRef.current?.setContent(` `);

    isArray(storeData) && storeData.length &&
    storeData.map((item) => {
      const marker = new window.AMap.Marker({
        anchor: 'center',
        size: [32, 34]
      });
      marker.setContent(`<div class="brandStatusImg">
      <img 
        style="width:32px; height:34px"
        src=${[Status.SIGNED, Status.DELIVERY_HOUSE, Status.START_BUSINESS].includes(item?.status) ? 'https://staticres.linhuiba.com/project-custom/locationpc/map/icon_network_kaidian.png' : 'https://staticres.linhuiba.com/project-custom/locationpc/map/icon_network_bidian.png'} >
      </img>
      </div>`);
      marker.setPosition([item?.lng, item?.lat]);
      marker.on('click', () => {

        handleClick(item);
      });
      markerRef.current.push(marker);
    });
    const markerGroups = new window.AMap.OverlayGroup(markerRef.current);
    amapIns.add(markerGroups);
  };

  // 本品牌门店marker点击事件
  const handleClick = (item) => {
    labelMarkerRef.current.setPosition([item?.lng, item?.lat]);
    const uid:any = v4();
    labelMarkerRef.current.setContent(`<div id="${uid}"></div>`);
    amapIns.add(labelMarkerRef.current);
    ReactDOM.render(<Card detail={item} marker={labelMarkerRef.current}/>, document.getElementById(uid));
  };

  // 当brandTreeData改变的时候，触发getStoreData去获取本品牌门店数据
  useEffect(() => {
    const list:any = [];
    brandTreeData[0]?.children?.map((item) => {
      if (item.checked) {
        list.push(item.key);
      }
    });
    getStoreData(list);
  }, [brandTreeData]);

  // 当门店数据改变的时候，在地图中绘制
  useEffect(() => {
    if (!amapIns) return;
    drawStoreMarker();
  }, [storeData, amapIns]);

  // 初始化定义labelMarkerRef
  useEffect(() => {
    if (!amapIns) return;
    const labelMarker = new window.AMap.Marker({
      content: ` `,
      offset: [-16, 30],
      zIndex: 999
    });
    labelMarkerRef.current = labelMarker;
  }, [amapIns]);

  // 当恢复到全国范围时，去掉本品牌门店分布的勾选
  useEffect(() => {
    const treeData = deepCopy(brandTreeData);
    if (level <= PROVINCE_LEVEL && isArray(brandTreeData) && brandTreeData?.length) {
      const res = treeData[0]?.children?.map((item) => {
        return {
          ...item,
          checked: false,
        };
      });
      treeData[0].children = res;
      treeData[0].checked = false;
      setBrandTreeData(treeData);
    }
  }, [level]);

  return <div className={styles.brandTree}>
    {brandTreeData[0]?.children?.length ? <Tree
      treeData={brandTreeData}
      selectable={false}
      blockNode// 节点占据一行
      defaultExpandAll// 默认全展开
      style={{
        marginTop: 4, // 按实际效果调整
      }}
      titleRender={(node:any) => {
        return <TreeNode node={node} clickSwitch={clickSwitch}/>;
      }}
    /> : <></>}
  </div>;
};
export default BrandTree;
