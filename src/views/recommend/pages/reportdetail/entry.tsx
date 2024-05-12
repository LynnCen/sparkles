import { FC, useRef, useState } from 'react';
import styles from './entry.module.less';
import { urlParams } from '@lhb/func';
import Result from './components/Result';
import AMap from '@/common/components/AMap/index';
import Top from './components/Top';
const Modal: FC<any> = () => {
  const id: string | number = urlParams(location.search)?.id || 0; // 详情时的id
  const loadedMapHandle = (map,) => {
    map.addLayer(new window.AMap.TileLayer.Satellite({ visible: false }));
  };
  const topRef:any = useRef(null);
  const [rightDrawerVisible, setRightDrawerVisible] = useState(true);

  // // 工具箱状态
  const handleRightDrawerBtn = () => {
    topRef?.current?.handleSelected((state) => rightDrawerVisible ? state + 1 : state - 1);
  };
  // 处理全屏状态
  const onChangeShow = () => {
    setRightDrawerVisible((state) => !state);
    handleRightDrawerBtn();
  };


  return (
    <div className={styles.container}>
      <AMap
        loaded={loadedMapHandle}
        plugins={[
          'AMap.DistrictSearch',
          'AMap.Geocoder',
          'AMap.RangingTool',
          'AMap.PlaceSearch',
          'AMap.HeatMap',
          'AMap.Driving', // 驾车
          'AMap.Riding', // 骑行
          'AMap.Walking' // 走路
        ]}
      >
        {
          id && <Result
            id={id}
            setRightDrawerVisible={onChangeShow}
            rightDrawerVisible={rightDrawerVisible}
          />
        }
        <Top
          rightDrawerVisible={rightDrawerVisible}
          topRef={topRef}
          onChangeShow={onChangeShow}
        />
      </AMap>
    </div>
  );
};

export default Modal;
