import { FC, ReactNode, useEffect, useState } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import styles from './entry.module.less';
import FirstPage from './components/FirstPage';
import MainModule8 from './components/MainModule8';
import MainModule9 from './components/MainModule9';
import LastPage from './components/LastPage';
import { useMethods } from '@lhb/hook';
import { dateFns, floorKeep, matchQuery } from '@lhb/func';
import MainModule9Static from './components/MainModule9Static';
import { get, post } from '@/common/request';
import MainModule10 from './components/MainModule10';
const start = 1;
const Fishtogether: FC<any> = () => {
  const id = matchQuery(location.search, 'id');
  const [waterMarkStyle, setWaterMarkStyle] = useState({});
  const [data, setData] = useState<any>({});
  const [part8, setPart8] = useState(start); // 八、选址须知/工程条件确认 页面初始值是 第 9 页
  const [part9m, setPart9m] = useState(floorKeep(part8, 1, 2));
  const [part9, setPart9] = useState(floorKeep(part9m, 2, 2));
  const methods = useMethods({
    renderMainModule7() {
      const arr: ReactNode[] = [];
      const start = 1;
      const end = +floorKeep(part8, 1, 2);
      for (let i = start; i < end; i++) {
        const index = i - start;
        const targetStart = +floorKeep(index, 2, 3);
        const targetEnd = targetStart + 2;
        arr.push(
          <MainModule8
            key={`moduleEight${i}`}
            remark={!index ? data.selectionNotice?.note : undefined}
            res={data.selectionNotice?.images?.slice(targetStart, targetEnd)}
            number={dateFns.doubleDigit(i)}
          />
        );
      }
      return arr;
    },
    renderMainModule8() {
      const arr: ReactNode[] = [];
      const start = +floorKeep(part8, 1, 2);
      const end = +floorKeep(part9m, 1, 2);
      for (let i = start; i < end; i++) {
        const index = i - start;
        arr.push(
          <MainModule9
            key={`moduleEight${i}`}
            index={index}
            res={data.bizState?.module9m?.slice(index, index + 1)}
            number={dateFns.doubleDigit(i)}
          />
        );
      }
      return arr;
    },
    renderMainModule9() {
      const arr: ReactNode[] = [];
      const start = +floorKeep(part9m, 2, 2);
      const end = +floorKeep(part9, 1, 2);
      for (let i = start; i < end; i++) {
        const index = i - start;
        arr.push(
          <MainModule9
            key={`moduleEight${i}`}
            index={index}
            res={data.bizState?.module9?.slice(index, index + 1)}
            number={dateFns.doubleDigit(i)}
          />
        );
      }
      return arr;
    },
    addMask(str) {
      const can = document.createElement('canvas');
      const body = document.body;
      body.appendChild(can);
      can.width = 660;
      can.height = 482;
      can.style.display = 'none';
      const cans: any = can.getContext('2d');
      cans.rotate((-20 * Math.PI) / 180);
      cans.font = '24px Microsoft JhengHei';
      cans.fillStyle = 'rgba(149, 155, 171, 0.30)';
      cans.textAlign = 'left';
      cans.textBaseline = 'Middle';
      cans.fillText(str, can.width / 3, can.height / 2);
      setWaterMarkStyle({
        background: 'url(' + can.toDataURL('image/png') + ')',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: '1124px',
      });
    },
  });
  useEffect(() => {
    // https://yapi.lanhanba.com/project/497/interface/api/51526
    post(
      '/yn/changePoint/pdfReport',
      {
        id: +id,
      },
      {
        needHint: true,
      }
    ).then((res) => {
      const _data = res.data;
      get(
        '/map/shop/yn/surroundingShops',
        {
          lng: _data.overview.longitude,
          lat: _data.overview.latitude,
          cityId: _data.overview.cityId,
        },
        {
          // isMock: true,
          // mockId: 349,
          // mockSuffix: '/api',
          needHint: true,
          isZeus: true,
        }
      ).then((res2) => {
        const selfShop = { distance: 0, process: 2, lat: _data.overview.latitude, lng: _data.overview.longitude };
        // 五公里相关数据插入
        if (res2.surroundingShops?.length) {
          res2.surroundingShops.unshift(selfShop);
        } else {
          res2.surroundingShops = [selfShop];
        }
        _data.bizState.module9StaticList = res2.surroundingShops?.filter((item) => item.process === 2);

        // 5公里商圈根据距离排序
        if (_data.bizState.module9StaticList && _data.bizState.module9StaticList.length) {
          _data.bizState.module9StaticList = _data.bizState.module9StaticList.sort((a, b) => a.distance - b.distance);
        }
        _data.bizState.module9StaticCenter = {
          longitude: _data.overview.longitude,
          latitude: _data.overview.latitude,
        };
        unstable_batchedUpdates(() => {
          const bizState = _data.bizState;
          /* 选址须知/工程条件确认 start */
          let _part8 = start;
          const module8Length = _data.selectionNotice?.images?.length;
          if (module8Length) {
            const page = Math.ceil(module8Length / 2);
            if (page > 1) {
              _part8 = page;
            }
          }
          /* 选址须知/工程条件确认 end */
          /* 城市截图 */
          let _part9m = floorKeep(_part8, 1, 2);
          const module9m: any[] = [];
          const module9mLength = _data.bizState?.cityImage?.images?.length;
          if (module9mLength) {
            bizState.cityImage?.images?.forEach((url) => {
              module9m.push({
                remark: bizState.cityImage.note,
                title: '商圈及城市规划陈述',
                url,
              });
            });
            if (module9mLength > 1) {
              _part9m = floorKeep(_part8, module9mLength - 1, 2);
            }
          }
          _data.bizState.module9m = module9m;
          /* 项目所在商圈陈述 start */
          let _part9 = floorKeep(_part9m, 2, 2);
          const module9: any[] = [];
          if (bizState) {
            bizState.shopStreet?.images?.forEach((url) => {
              module9.push({
                remark: bizState.shopStreet.note,
                title: '项目所在商圈街铺陈述',
                url,
              });
            });
            bizState.populationData?.images?.forEach((url) => {
              module9.push({
                remark: bizState.populationData.note,
                title: '项目所在商圈人口数据',
                url,
              });
            });
            bizState.brandsIntroduction?.images?.forEach((url) => {
              module9.push({
                remark: bizState.brandsIntroduction.note,
                title: '项目所在商场及品牌分布介绍',
                url,
              });
            });
            bizState.peopleStream?.images?.forEach((url) => {
              module9.push({
                remark: bizState.peopleStream.note,
                title: '落位动线图',
                url,
              });
            });
            bizState.shopSign?.images?.forEach((url) => {
              module9.push({
                remark: bizState.shopSign.note,
                title: '店铺照片及招牌示意',
                url,
              });
            });
            bizState.takeoutComparison?.images?.forEach((url) => {
              module9.push({
                remark: bizState.takeoutComparison.note,
                title: '周边外卖对比店情况说明',
                url,
              });
            });
            bizState.bizIntroduction?.images?.forEach((url) => {
              module9.push({
                remark: bizState.bizIntroduction.note,
                title: '店铺平面图（CAD图）',
                url,
              });
            });
            bizState.shopProtection?.images?.forEach((url) => {
              module9.push({
                remark: bizState.shopProtection.note,
                title: '客户风险认知',
                url,
              });
            });
          }
          const module9Length = module9?.length;
          if (module9Length && module9Length > 1) {
            _part9 = floorKeep(_part9, module9Length - 1, 2);
          }
          _data.bizState.module9 = module9;
          /* 项目所在商圈陈述 end */
          setData(_data);
          methods.addMask(`${_data.branchOffice}—${_data.manager}`);
          if (_part9m !== part9m) {
            setPart9m(_part9m);
          }
          if (_part8 !== part8) {
            setPart8(_part8);
          }
          if (_part9 !== part9) {
            setPart9(_part9);
          }
        });
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={styles.container}>
      <FirstPage res={data} />
      {methods.renderMainModule7()}
      {methods.renderMainModule8()}
      <MainModule9Static number={dateFns.doubleDigit(+floorKeep(part9m, 1, 2))} res={data.bizState} />
      {methods.renderMainModule9()}
      <MainModule10 number={dateFns.doubleDigit(+floorKeep(part9, 1, 2))} res={data} />
      <LastPage />
      <div style={waterMarkStyle}></div>
    </div>
  );
};

export default Fishtogether;
