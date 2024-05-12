import { FC, useEffect, useRef, useState } from 'react';
import { customList, massMarkerList } from '../../../../views/selection/pages/industry/ts-config';
import { get } from '@/common/request';
import { heatDemoProvince } from '@/common/api/selection';
import { CITY_LEVEL, DISTRICT_LEVEL, CITY_ZOOM } from '@/common/components/AMap/ts-config';
import { isArray, isMobile, urlParams } from '@lhb/func';
const obj = {
  1: null,
  2: null,
  3: null
};
const checkAll :any = [];
customList.map((item) => {
  checkAll.push(item.key);
});

const MassMarker: FC<any> = ({
  _mapIns,
  checkList,
  level,
  city,
}) => {

  const isShare = urlParams(location.search)?.isShare;
  const labelMarkerRef = useRef<any>(null);
  const [massMarker, setMassMarker] = useState<any>(obj);
  const [data, setData] = useState<any>(obj);

  useEffect(() => {
    if (!_mapIns) return;
    labelMarkerRef.current = new window.AMap.Marker({
      content: ' ',
      map: _mapIns,
    });
  }, [_mapIns]);

  useEffect(() => {
    if (level === CITY_LEVEL || level === DISTRICT_LEVEL) {
      initData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  useEffect(() => {
    checkAll.map((val) => {
      initMass(data[val], val);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    handleShow();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkList, massMarker]);


  // 初始化，一次性获取所有的值
  const initData = () => {
    const promiseArr = checkAll.map(async(item) => {
      const jsonUrl = await heatDemoProvince({ provinceId: city.provinceId || 0, type: item });
      return jsonUrl?.pointUrl && get(jsonUrl.pointUrl);
    });
    let arr:any = [];
    Promise.all(promiseArr).then((values) => {
      values.map((value, index) => {
        let res:any = [];
        value?.districts.map((district) => {
          district.districts.map((item) => {
            res = [...res, ...item.data];
          });
        });
        arr = {
          ...data,
          ...arr,
          [index + 1]: res
        };

      });
      setData(arr);
    });
  };
  // 生成所有的mass
  const initMass = (data, key) => {
    var mass = new window.AMap.MassMarks(data, {
      opacity: 1,
      cursor: 'pointer',
      style: massMarkerList[key],
      zooms: [CITY_ZOOM, 20],
      zIndex: 140
    });
    mass.on('mouseover', function (e) {
      const labelContent = `<div class='label'>
      <div class='trangle'></div>
      <span class='title'>${e.data.name}</span>
      </div>`;
      labelMarkerRef.current.setPosition(e.data.lnglat);
      labelMarkerRef.current.setContent(labelContent);
      labelMarkerRef.current.setOffset(new window.AMap.Pixel(-34, 6));
    });
    mass.on('mouseout', function () {
      labelMarkerRef.current.setContent(' ');
    });

    if (isMobile() && isShare) {
      mass.on('click', function (e) {
        const labelContent = `<div class='label'>
        <div class='trangle'></div>
        <span class='title'>${e.data.name}</span>
        </div>`;
        labelMarkerRef.current.setPosition(e.data.lnglat);
        labelMarkerRef.current.setContent(labelContent);
        labelMarkerRef.current.setOffset(new window.AMap.Pixel(-34, 6));
        setTimeout(() => {
          labelMarkerRef.current.setContent(' ');
        }, 3000);
      });
    }
    mass.setMap(_mapIns);
    mass.hide();
    massMarker[key] = mass;
    setMassMarker({ ...massMarker });
  };
  // 根据选择控制mass的显示、隐藏
  const handleShow = () => {
    checkAll.map((item) => {
      massMarker[item]?.hide();
    });
    if (isArray(checkList)) {
      checkList.map((item) => {
        massMarker[item].show();
      });
    }
  };
  return <></>;
};

export default MassMarker;
