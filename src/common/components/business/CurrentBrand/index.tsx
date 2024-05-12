/**
 * @Description 本品牌门店分布
 */

import { FC, useEffect, useRef, useState } from 'react';
import cs from 'classnames';
import styles from './index.module.less';
import IconFont from '@/common/components/IconFont';
import { Checkbox, Divider } from 'antd';
import { getSelection, getStoreList } from '@/common/api/networkplan';
import { isArray } from '@lhb/func';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { CITY_LEVEL, PROVINCE_LEVEL } from '@/common/components/AMap/ts-config';
import ReactDOM from 'react-dom';
import Card from './Card';
import { v4 } from 'uuid'; // 用来生成不重复的key
import { Status } from './ts-config';
import { useStadiometry } from '@/common/hook/Amap/useStadiometry';

const iconList = ['iconic_yikaidian', 'iconic_yibidian'];

const CurrentBrand:FC<any> = ({
  showCurrentBrand,
  setShowCurrentBrand,
  level,
  city,
  amapIns
}) => {
  const [selectValue, setSelectValue] = useState<any>([]);
  const [listData, setListData] = useState<any>([]);
  const [storeData, setStoreData] = useState<any>([]);
  const [indeterminate, setIndeterminate] = useState<boolean>(false);
  const [checkAll, setCheckAll] = useState<boolean>(false);
  const isStadiometry: any = useStadiometry(); // 是否在使用测距功能
  const isStadiometryRef = useRef(isStadiometry);
  // const massMarkerRef = useRef<any>(null);
  const markerRef = useRef<any>([]);
  const labelMarkerRef = useRef<any>(null);
  const changeShowCurrentBrand = (e) => {
    if (e.target === e.currentTarget) {
      setShowCurrentBrand((state) => !state);
    }
  };
  const onChange = (value) => {
    if (level <= PROVINCE_LEVEL) {
      V2Message.warning('地图放大至区级呈现门店分布数据');
      return;
    }
    setSelectValue(value);
    setIndeterminate(value.length && value.length < listData.length);
    setCheckAll(value.length === listData.length);
  };
  // 获取本品牌门店状态
  const getList = async() => {
    // module 1 网规相关，2行业商圈 （通用版）
    const { planStoreStatus } = await getSelection({ module: 1 });
    setListData(planStoreStatus);
  };
  // 根据勾选项获取对应状态的门店数据
  const getStoreData = async() => {
    let params :any = {
      statusList: selectValue,
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
  const drawStoreMarker = () => {

    isArray(storeData) && storeData.length &&
    storeData.map((item) => {
      const marker = new window.AMap.Marker({
        anchor: 'center',
        size: [32, 34],
        bubble: true, // 允许冒泡
      });
      marker.setContent(`<div class="brandStatusImg">
      <img 
        style="width:32px; height:34px"
        src=${[Status.SIGNED, Status.DELIVERY_HOUSE, Status.START_BUSINESS].includes(item?.status) ? 'https://staticres.linhuiba.com/project-custom/locationpc/map/icon_network_kaidian.png' : 'https://staticres.linhuiba.com/project-custom/locationpc/map/icon_network_bidian.png'} >
      </img>
      </div>`);
      marker.setPosition([item?.lng, item?.lat]);
      // marker.setPosition([120.026819875, 30.27962075]);
      marker.on('click', () => {
        if (isStadiometryRef.current) return;
        handleClick(item);
      });
      markerRef.current.push(marker);
    });
    const markerGroups = new window.AMap.OverlayGroup(markerRef.current);
    amapIns.add(markerGroups);


    // 此处是海量点的写法，海量点的写法无法置于顶层
    // const val:any = [];
    // const style:any = [{
    //   url: 'https://staticres.linhuiba.com/project-custom/locationpc/map/icon_network_kaidian.png',
    //   anchor: new window.AMap.Pixel(6, 6),
    //   size: new window.AMap.Size(32, 34),
    //   zIndex: 200,
    // }, {
    //   url: 'https://staticres.linhuiba.com/project-custom/locationpc/map/icon_network_bidian.png',
    //   anchor: new window.AMap.Pixel(6, 6),
    //   size: new window.AMap.Size(32, 34),
    //   zIndex: 150,
    // }];
    // isArray(storeData) && storeData.length &&
    // storeData.map((item) => {
    //   val.push({
    //     lnglat: [+item.lng, +item.lat],
    //     style: item.status - 1,
    //     ...item,
    //   });
    // });
    // var mass = new window.AMap.MassMarks(val, {
    //   cursor: 'pointer',
    //   style: style,
    //   zIndex: 1,
    // });
    // massMarkerRef.current = mass;
    // mass.setMap(amapIns);
  };
  const handleClick = (item) => {
    labelMarkerRef.current.setPosition([item?.lng, item?.lat]);
    // labelMarkerRef.current.setPosition([120.026819875, 30.27962075]);
    const uid:any = v4();
    labelMarkerRef.current.setContent(`<div id="${uid}"></div>`);
    amapIns.add(labelMarkerRef.current);
    ReactDOM.render(<Card detail={item} marker={labelMarkerRef.current}/>, document.getElementById(uid));
  };
  const handleSelect = (e) => {
    if (level <= PROVINCE_LEVEL) {
      V2Message.warning('地图放大至区级呈现门店分布数据');
      return;
    }
    const allSelections:any = [];
    listData.map((item) => {
      allSelections.push(item.id);
    });
    setSelectValue(e.target.checked ? allSelections : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  useEffect(() => {
    getList();
  }, []);
  useEffect(() => {
    if (!amapIns) return;
    const labelMarker = new window.AMap.Marker({
      content: ` `,
      offset: [-16, 30],
      zIndex: 999
    });
    labelMarkerRef.current = labelMarker;
  }, [amapIns]);
  useEffect(() => {
    if (level <= PROVINCE_LEVEL) {
      labelMarkerRef.current?.setContent(` `);
    }
  }, [level]);
  useEffect(() => {
    if (!amapIns) return;
    // massMarkerRef.current?.clear();
    isArray(markerRef.current) && markerRef.current.length &&
    markerRef.current.map((marker) => {
      amapIns.remove(marker);
    });

    if (isArray(selectValue) && selectValue.length) {
      getStoreData();
    }
  }, [amapIns, selectValue, city?.id]);
  useEffect(() => {
    if (level <= PROVINCE_LEVEL) {
      setSelectValue([]);
      setIndeterminate(false);
      setCheckAll(false);
      return;
    }
  }, [level]);
  useEffect(() => {
    if (!amapIns) return;
    drawStoreMarker();
  }, [storeData, amapIns]);
  useEffect(() => {
    isStadiometryRef.current = isStadiometry;
  }, [isStadiometry]);

  return <div
    className={cs(styles.currentBrand, showCurrentBrand ? styles.active : '')}
    onClick={changeShowCurrentBrand}>
      本品牌门店分布
    {showCurrentBrand
      ? <IconFont
        iconHref='iconarrow-down-copy'
        className='inline-block ml-4'
        onClick={changeShowCurrentBrand}
      />
      : <IconFont
        iconHref='iconarrow-down'
        className='inline-block ml-4'
        onClick={changeShowCurrentBrand}
      />}
    {
      showCurrentBrand
        ? <div className={styles.currentSelectBox}>
          <Checkbox
            className={styles.allBrand}
            indeterminate={indeterminate}
            onChange={handleSelect}
            checked={checkAll}
          >本品牌门店分布</Checkbox>
          <Divider style={{
            marginTop: 8,
            marginBottom: 8
          }}/>

          <Checkbox.Group
            className={styles.selectBox}
            value={selectValue}
            onChange={onChange} >
            {
              listData.map((item, index) => <div className={styles.check} key={index}>
                <Checkbox value={item.id}>
                  <IconFont iconHref={iconList[index]} className={styles.icon}/>
                  {item.name}
                </Checkbox>
              </div>)
            }
          </Checkbox.Group>
        </div>
        : <></>
    }
  </div>;

};
export default CurrentBrand;
