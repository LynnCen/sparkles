import { heatDemoCountry, heatDemoProvince } from '@/common/api/selection';
import { get } from '@/common/request';
import { urlParams } from '@lhb/func';
import { useMethods } from '@lhb/hook';
import { FC, useEffect, useState } from 'react';
import { massMarkerRightList } from '../../../../views/selection/pages/industry/ts-config';
import { COUNTRY_LEVEL } from '../../AMap/ts-config';

const MassMap:FC<any> = ({
  _mapIns,
  heatType,
  city,
  level
}) => {
  const isShare = urlParams(location.search)?.isShare;
  const [massMarker, setMassMarker] = useState<any>({
    1: null,
    2: null,
    3: null
  });
  const [data, setData] = useState<any>({
    1: [],
    2: [],
    3: []
  });

  useEffect(() => {
    if (!_mapIns) return;
    massMarker['1'] && massMarker['1'].hide();
    massMarker['2'] && massMarker['2'].hide();
    massMarker['3'] && massMarker['3'].hide();
    if (heatType.length !== 0) {
      switchLevel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, heatType, city]);
  const {
    switchLevel,
    createMassMarker
  } = useMethods({
    switchLevel: async () => {
      let jsonUrl;
      let pointInfo;
      // 全国
      if (level === COUNTRY_LEVEL) {
        let data;
        jsonUrl = await heatDemoCountry();
        if (heatType[heatType.length - 1] === 1) {
          data = jsonUrl?.registerPointUrl && await get(jsonUrl.registerPointUrl);
        } else if (heatType[heatType.length - 1] === 2) {
          data = jsonUrl?.activePointUrl && await get(jsonUrl.activePointUrl);
        } else if (heatType[heatType.length - 1] === 3) {
          data = jsonUrl?.sleepPointUrl && await get(jsonUrl.sleepPointUrl);
        }
        pointInfo = data?.districts;
      } else if (isShare) {
        // 分享页面省范围内
        const promiseArr = heatType.map(async(item) => {
          const jsonUrl = await heatDemoProvince({ provinceId: city.provinceId || 0, type: item });
          return get(jsonUrl.pointUrl);
        });
        let arr:any = {};

        Promise.all(promiseArr).then((values) => {
          heatType.map((item, index) => {
            let value :any = [];
            values[index].districts.forEach((item) => {
              item.districts.forEach((district) => {
                value = [...value, ...district.data];
              });
            });
            arr = {
              ...data,
              ...arr,
              [item]: value
            };
          });
          setData(arr);
        });
        createMassMarker();
        return;
      } else {
        jsonUrl = city && await heatDemoProvince({ provinceId: city.provinceId || 0, type: heatType[heatType.length - 1] });
        const point = jsonUrl?.pointUrl && await get(jsonUrl.pointUrl);
        pointInfo = point?.districts;
      }

      // const point = jsonUrl?.pointUrl && await get(jsonUrl.pointUrl);
      const val:any = [];
      pointInfo?.forEach(item => {
        item.districts.forEach(district => {
          val.push(...district.data);
        });
      });
      const res = {
        ...data,
        [heatType[heatType.length - 1]]: val
      };
      setData(res);
      createMassMarker();
    },
    createMassMarker: () => {
      heatType.forEach(key => {
        let val:any = [];
        if (massMarker[key]) {
          massMarker[key].clear();
          _mapIns.remove(massMarker[key]);
          val = [...data[key]];
        }
        var mass = new window.AMap.MassMarks(val, {
          opacity: 1,
          cursor: 'pointer',
          style: massMarkerRightList,
          zooms: [1, 20],
          zIndex: 140
        });
        mass.setMap(_mapIns);
        massMarker[key] = mass;
      });
      setMassMarker({ ...massMarker });
    },
  });
  return (
    <>

    </>
  );
};
export default MassMap;
