/**
 * @Description 省市组件
 * 可通过自定义参数传入来决定是否与地图进行联动
 */

import { FC, useEffect, useMemo, useState } from 'react';
// import cs from 'classnames';
import styles from './index.module.less';
import V2AreaListForMap from '@/common/components/AMap/components/V2AreaListForMap';
import IconFont from '@/common/components/IconFont';
import { isArray } from '@lhb/func';
import { bigdataBtn } from '@/common/utils/bigdata';
import { topCon } from '../../ts-config';

const ProvinceCity: FC<any> = ({
  mapIns,
  mapHelpfulInfo,
  curSelectDistrict, // 当前左侧筛选选中的行政区
  setProvinceCityComData, // // 设置左上角省市组件数据
  setHandChange, // 当手动更改省市时触发
  isGreater1440, // 是否屏幕宽度大于1440
  isGreater1920,
  provinceCascaderOpen,
  setProvinceCascaderOpen,
  handleToggle
}) => {
  const [handChangeData, setHandChangeData] = useState<any[]>([]); // 手动更改省市
  const [autoChangeData, setAutoChangeData] = useState<any[]>([]); // 地图联动下，自动获取当前中心点省市数据
  useEffect(() => {
    setProvinceCityComData(handChangeData);
  }, [handChangeData]);

  useEffect(() => {
    setProvinceCityComData(autoChangeData);
  }, [autoChangeData]);

  // 省市组件是否与地图进行联动
  const isFollow = useMemo(() => {
    const { districtInfo } = curSelectDistrict; // 左侧筛选选中的行政区
    return isArray(districtInfo) && districtInfo.length > 0;
  }, [curSelectDistrict]);

  const onChange = (val, arr) => {
    setHandChangeData(arr);
    setHandChange((state) => state + 1);
  };

  const onFollowChange = (options: any[]) => {
    setAutoChangeData(options);
  };


  //
  const handleClose = (e) => {
    const topConDom:any = document.querySelector(`.${topCon}`);
    if (!topConDom.contains(e.target)) {
      setProvinceCascaderOpen(false);
    }
  };
  useEffect(() => {
    const dom:any = document.querySelector(`#root`);

    if (provinceCascaderOpen) {
      dom.addEventListener('click', handleClose);
    }
    return () => {
      dom.removeEventListener('click', handleClose);
    };
  }, [provinceCascaderOpen]);
  return (
    <span onClick={() => {
      handleToggle(provinceCascaderOpen, setProvinceCascaderOpen);
      bigdataBtn('817b5d51-4a23-2bcc-38d3-bbdf25cea740', '选址地图', '地址选择器', '点击地址选择器');
    }}>
      <V2AreaListForMap
        mapIns={mapIns}
        mapHelpfulInfo={mapHelpfulInfo}
        options={{
          isFollow: !isFollow
        }}
        type={2}
        config={{
          suffixIcon: <IconFont
            iconHref='pc-common-icon-a-iconarrow_down'
            className='c-959'
          />,
          open: provinceCascaderOpen, // 控制浮层（下拉选项）显示与否
          expandTrigger: 'hover'
        }}
        className={styles.cityCon}
        style={{
          width: `${isGreater1440 ? isGreater1920 ? '194px' : '10.1vw' : '150px'}`
        }}
        change={onChange}
        followChange={onFollowChange}
      />
    </span>
  );
};

export default ProvinceCity;
