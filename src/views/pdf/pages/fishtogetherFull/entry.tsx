import { FC, ReactNode, useEffect, useState } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import styles from './entry.module.less';
import FirstPage from './components/FirstPage';
import MainModule1 from './components/MainModule1';
import MainModule2 from './components/MainModule2';
import MainModule3 from './components/MainModule3';
import MainModule4 from './components/MainModule4';
import MainModule5 from './components/MainModule5';
import MainModule6 from './components/MainModule6';
import MainModule7 from './components/MainModule7';
import MainModule8 from './components/MainModule8';
import MainModule9 from './components/MainModule9';
import MainModule10 from './components/MainModule10';
import MainModule11 from './components/MainModule11';
import LastPage from './components/LastPage';
import { useMethods } from '@lhb/hook';
import { dateFns, floorKeep, matchQuery } from '@lhb/func';
import MainModule9Static from './components/MainModule9Static';
import { get, post } from '@/common/request';
import MainModule12 from './components/MainModule12';
const Fishtogether: FC<any> = () => {
  const id = matchQuery(location.search, 'id');
  const [waterMarkStyle, setWaterMarkStyle] = useState({});
  const [data, setData] = useState<any>({});
  const [part1, setPart1] = useState(1); // 一、项目综述 页面初始值是 第1页
  const [part3, setPart3] = useState(floorKeep(part1, 2, 2)); // 三、选址23不要 页面初始值是 第3页
  const [part5, setPart5] = useState(floorKeep(part3, 3, 2)); // 五、营业额预估 页面初始值是 第 6 页
  const [part8, setPart8] = useState(floorKeep(part5, 3, 2)); // 八、选址须知/工程条件确认 页面初始值是 第 9 页
  const [part9, setPart9] = useState(floorKeep(part8, 1, 2));
  const [part12, setPart12] = useState(floorKeep(part9, 3, 2));
  const methods = useMethods({
    renderMainModule1() {
      const arr: ReactNode[] = [];
      const start = 1;
      const end = floorKeep(part1, 1, 2);
      for (let i = start; i < end; i++) {
        const index = i - start;
        arr.push(<MainModule1
          key={`moduleOne${i}`}
          number={dateFns.doubleDigit(i)}
          index={index}
          res={data.overview}/>);
      }
      return arr;
    },
    renderMainModule3() {
      const arr: ReactNode[] = [];
      const start = +floorKeep(part1, 2, 2);
      const end = +floorKeep(part3, 1, 2);
      for (let i = start; i < end; i++) {
        const index = i - start;
        arr.push(<MainModule3
          key={`moduleOne${i}`}
          number={dateFns.doubleDigit(i)}
          index={index}
          res={data.forbidden23}/>);
      }
      return arr;
    },
    renderMainModule5() {
      const arr: ReactNode[] = [];
      const start = +floorKeep(part3, 3, 2);
      const end = +floorKeep(part5, 1, 2);
      for (let i = start; i < end; i++) {
        const index = i - start;
        arr.push(<MainModule5
          key={`moduleOne${i}`}
          number={dateFns.doubleDigit(i)}
          index={index}
          res={data.forecastSales}/>);
      }
      return arr;
    },
    renderMainModule8() {
      const arr: ReactNode[] = [];
      const start = +floorKeep(part5, 3, 2);
      const end = +floorKeep(part8, 1, 2);
      for (let i = start; i < end; i++) {
        const index = i - start;
        const targetStart = +floorKeep(index, 2, 3);
        const targetEnd = targetStart + 2;
        arr.push(<MainModule8
          key={`moduleEight${i}`}
          remark={!index ? data.selectionNotice?.note : undefined}
          res={data.selectionNotice?.images?.slice(targetStart, targetEnd)}
          number={dateFns.doubleDigit(i)}/>);
      }
      return arr;
    },
    renderMainModule9() {
      const arr: ReactNode[] = [];
      const start = +floorKeep(part8, 2, 2);
      const end = +floorKeep(part9, 1, 2);
      for (let i = start; i < end; i++) {
        const index = i - start;
        const targetStart = +floorKeep(index, 2, 3);
        const targetEnd = targetStart + 2;
        arr.push(<MainModule9
          key={`moduleEight${i}`}
          index={index}
          res={data.bizState?.module9?.slice(targetStart, targetEnd)}
          number={dateFns.doubleDigit(i)}/>);
      }
      return arr;
    },
    renderMainModule12() {
      const arr: ReactNode[] = [];
      const start = +floorKeep(part9, 3, 2);
      const end = +floorKeep(part12, 1, 2);
      for (let i = start; i < end; i++) {
        const index = i - start;
        const targetStart = +floorKeep(index, 2, 3);
        const targetEnd = targetStart + 2;
        arr.push(<MainModule12
          key={`moduleEight${i}`}
          remark={!index ? data.rest?.images?.remark : undefined}
          res={data.rest?.images?.slice(targetStart, targetEnd)}
          number={dateFns.doubleDigit(i)}/>);
      }
      return data.rest?.images?.length ? arr : undefined;
    },
    addMask(str) {
      const can = document.createElement('canvas');
      const body = document.body;
      body.appendChild(can);
      can.width = 660;
      can.height = 482;
      can.style.display = 'none';
      const cans: any = can.getContext('2d');
      cans.rotate(-20 * Math.PI / 180);
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
        width: '1124px'
      });
    }
  });
  useEffect(() => {
    // https://yapi.lanhanba.com/project/497/interface/api/51526
    post('/yn/changePoint/pdfReport', {
      id: +id
    }, {
      needHint: true,
    }).then(res => {
      const _data = res.data;
      get('/map/shop/yn/surroundingShops', {
        lng: _data.overview.longitude,
        lat: _data.overview.latitude,
        cityId: _data.overview.cityId
      }, {
        // isMock: true,
        // mockId: 349,
        // mockSuffix: '/api',
        needHint: true,
        isZeus: true,
      }).then((res2) => {
        const selfShop = { distance: 0, process: 2, lat: _data.overview.latitude, lng: _data.overview.longitude };
        // 五公里相关数据插入
        if (res2.surroundingShops?.length) {
          res2.surroundingShops.unshift(selfShop);
        } else {
          res2.surroundingShops = [selfShop];
        }
        _data.bizState.module9StaticList = res2.surroundingShops?.filter(item => item.process === 2);
        _data.bizState.module9StaticCenter = {
          longitude: _data.overview.longitude,
          latitude: _data.overview.latitude
        };
        unstable_batchedUpdates(() => {
          let _part1 = 1; // 如果part 选址23不要检查-数据不多的时候（小于等于3条）， part1 = 2;
          /* 一、项目综述 多页判断 start */
          const part1ArrLength = _data.overview.forbidden23?.length;
          // 如果有选址23不要检查模块，就判断
          // 3条以内只要1页，12条2页，21条3页，以此类推
          if (part1ArrLength && part1ArrLength > 3) {
            const page = Math.ceil(+floorKeep(part1ArrLength, 3, 1) / 12);
            _part1 = +floorKeep(1, page, 2); // 这里是通过part1的数字来确定part
          }
          _data.overview.surroundingShops = res2.surroundingShops?.filter(item => item.process === 2 && item.distance <= 200);
          /* 一、项目综述 多页判断 end */
          /* 二、加盟商信息 start */
          _data.franchisee.count = res2.historyCount;
          _data.franchisee.shopCount = res2.count;
          /* 二、加盟商信息 end */
          /* 三、选址23不要 start */
          let _part3 = floorKeep(_part1, 2, 2);
          const explanationLength = _data.forbidden23?.explanation?.length;
          if (explanationLength && explanationLength > 5) {
            const page = Math.ceil(+floorKeep(explanationLength, 5, 1) / 11);
            _part3 = floorKeep(_part3, page, 2);
          }
          /* 三、选址23不要 end */
          /* 四、数据审核表 多页判断 start */
          if (_data.dataCheck?.bizInfo?.length) {
            const baseArr: any[] = [];
            const bigArr: any[] = [];
            _data.dataCheck.bizInfo.forEach(item => {
              if (item?.value.length > 19) {
                bigArr.push(item);
              } else {
                baseArr.push(item);
              }
            });
            _data.dataCheck.bizInfo = baseArr.concat(bigArr);
          }
          /* 四、数据审核表 多页判断 end */
          /* 五、营业额预估 多页判断 start */
          let _part5 = floorKeep(_part3, 3, 2);
          const module5: any[] = [];
          const forecastSales = _data.forecastSales || {};
          const allMethods = forecastSales.methods.allMethods;
          // 产品说了，会严格按照如下格式塞入allMethods，如果出现问题，就让产品自己取校验顺序
          // ['综合对比法', '街铺商圈法', '竞对法（堂食法）', '竞对法（7080法）', '捕获率法', '外卖法']
          // 直接导入对应的数据，如果产品设置顺序错了，让产品改，不需要研发改
          forecastSales.methods.methods.forEach(item => {
            // 如果 methods里的数据和allMethods里的数据，名称有一丝不同，就不显示，产品说的，必须按照要求填
            if (allMethods.indexOf(item) === 0) {
              if (forecastSales.overall?.length) {
                module5.push({
                  name: allMethods[0],
                  list: forecastSales.overall
                });
              }
            } else if (allMethods.indexOf(item) === 1) {
              if (forecastSales.bizDistrict?.length) {
                module5.push({
                  name: allMethods[1],
                  list: forecastSales.bizDistrict
                });
              }
            } else if (allMethods.indexOf(item) === 2) {
              if (forecastSales.competitor?.length) {
                module5.push({
                  name: allMethods[2],
                  list: forecastSales.competitor
                });
              }
            } else if (allMethods.indexOf(item) === 3) {
              if (forecastSales.competitor7080?.length) {
                module5.push({
                  name: allMethods[3],
                  list: forecastSales.competitor7080
                });
              }
            } else if (allMethods.indexOf(item) === 4) {
              if (forecastSales.catching?.length) {
                module5.push({
                  name: allMethods[4],
                  list: forecastSales.catching
                });
              }
            } else if (allMethods.indexOf(item) === 5) {
              if (forecastSales.takeout?.length) {
                module5.push({
                  name: allMethods[5],
                  list: forecastSales.takeout
                });
              }
            }
          });
          const part5Size = module5.length;
          if (part5Size) {
            // 产品明确是0-6个模块，所以不需要判断别的
            if (part5Size > 2) {
              const page = Math.ceil(+floorKeep(part5Size, 2, 1) / 2);
              _part5 = floorKeep(_part3, page + 3, 2);
            }
          }
          _data.forecastSales.module5 = module5;
          /* 五、营业额预估 多页判断 end */
          /* 八、选址须知/工程条件确认 start */
          let _part8 = floorKeep(_part5, 3, 2);
          const module8Length = _data.selectionNotice?.images?.length;
          if (module8Length) {
            const page = Math.ceil(module8Length / 2);
            if (page > 1) {
              _part8 = floorKeep(_part5, page + 2, 2);
            }
          }
          /* 八、选址须知/工程条件确认 end */
          /* 九、项目所在商圈陈述 start */
          let _part9 = floorKeep(_part8, 1, 2);
          const module9: any[] = [];
          const bizState = _data.bizState;
          if (bizState) {
            bizState.cityImage?.images?.forEach(url => {
              module9.push({
                remark: bizState.cityImage.note,
                title: '城市截图',
                url
              });
            });
            bizState.shopProtection?.images?.forEach(url => {
              module9.push({
                remark: bizState.shopProtection.note,
                title: '门店保护情况',
                url
              });
            });
            bizState.populationData?.images?.forEach(url => {
              module9.push({
                remark: bizState.populationData.note,
                title: '项目所在商圈人口数据',
                url
              });
            });
            bizState.shopStreet?.images?.forEach(url => {
              module9.push({
                remark: bizState.shopStreet.note,
                title: '项目所在街铺陈述',
                url
              });
            });
            bizState.brandsIntroduction?.images?.forEach(url => {
              module9.push({
                remark: bizState.brandsIntroduction.note,
                title: '项目所在各楼层品牌分布',
                url
              });
            });
            bizState.bizIntroduction?.images?.forEach(url => {
              module9.push({
                remark: bizState.bizIntroduction.note,
                title: '项目所在商业介绍',
                url
              });
            });
            bizState.peopleStream?.images?.forEach(url => {
              module9.push({
                remark: bizState.peopleStream.note,
                title: '点位所在项目人流动线图',
                url
              });
            });
            bizState.shopSign?.images?.forEach(url => {
              module9.push({
                remark: bizState.shopSign.note,
                title: '项目所在店铺展示面',
                url
              });
            });
            bizState.takeoutComparison?.images?.forEach(url => {
              module9.push({
                remark: bizState.takeoutComparison.note,
                title: '外卖对比图',
                url
              });
            });
          }
          const module9Length = module9?.length;
          if (module9Length) {
            const page = Math.ceil(module9Length / 2);
            if (page > 1) {
              _part9 = floorKeep(_part9, page, 2);
            }
          }
          _data.bizState.module9 = module9;
          /* 九、项目所在商圈陈述 end */
          /* 十二、项目所在商圈陈述 start */
          let _part12 = floorKeep(_part9, 3, 2);
          const module12Length = _data.rest?.images?.length;
          if (module12Length) {
            const page = Math.ceil(module12Length / 2);
            if (page > 1) {
              _part12 = floorKeep(_part9, page + 2, 2);
            }
          }
          /* 十二、项目所在商圈陈述 end */
          setData(_data);
          methods.addMask(`${_data.branchOffice}—${_data.manager}`);
          if (_part1 !== part1) {
            setPart1(_part1);
          }
          if (_part3 !== part3) {
            setPart3(_part3);
          }
          if (_part5 !== part5) {
            setPart5(_part5);
          }
          if (_part8 !== part8) {
            setPart8(_part8);
          }
          if (_part9 !== part9) {
            setPart9(_part9);
          }
          if (_part12 !== part12) {
            setPart12(_part12);
          }
        });
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={styles.container}>
      <FirstPage res={data}/>
      { methods.renderMainModule1() }
      <MainModule2 number={dateFns.doubleDigit(+floorKeep(part1, 1, 2))} res={data.franchisee}/>
      { methods.renderMainModule3() }
      <MainModule4 title='商务信息' number={dateFns.doubleDigit(+floorKeep(part3, 1, 2))} res={data.dataCheck?.bizInfo}/>
      <MainModule4 title='加盟商投资预算总计（含首期租金及押金）' number={dateFns.doubleDigit(+floorKeep(part3, 2, 2))} res={data.dataCheck?.budget}/>
      { methods.renderMainModule5() }
      <MainModule6 number={dateFns.doubleDigit(+floorKeep(part5, 1, 2))} name={data.shopName} res={data.finCalc}/>
      <MainModule7 number={dateFns.doubleDigit(+floorKeep(part5, 2, 2))} res={data.basicInfo}/>
      {methods.renderMainModule8()}
      <MainModule9Static number={dateFns.doubleDigit(+floorKeep(part8, 1, 2))} res={data.bizState}/>
      {methods.renderMainModule9()}
      <MainModule10 number={dateFns.doubleDigit(+floorKeep(part9, 1, 2))} res={data}/>
      <MainModule11 number={dateFns.doubleDigit(+floorKeep(part9, 2, 2))} res={data.attachments}/>
      { methods.renderMainModule12() }
      <LastPage />
      <div style={waterMarkStyle}></div>
    </div>
  );
};

export default Fishtogether;
