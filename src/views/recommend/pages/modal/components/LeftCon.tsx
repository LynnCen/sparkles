import { tenantCheck } from '@/common/api/common';
import { modelCircle } from '@/common/api/recommend';
import Radar from '@/common/components/EChart/Radar';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import { CaretDownOutlined } from '@ant-design/icons';
import { isArray } from '@lhb/func';
import { useMethods } from '@lhb/hook';
import { Avatar, Checkbox, Tooltip } from 'antd';
import { FC, useEffect, useRef, useState } from 'react';
import { areaIcon, leftIcon } from '../../reportdetail/ts-config';
import styles from '../entry.module.less';
import MapDrawer from '@/common/components/business/MapDrawer';
import cs from 'classnames';
import { rankOptions, rankStatus } from '../ts-config';
const LeftCon: FC<any> = ({ id, _mapIns, model, setModel }) => {
  const labelRef = useRef<any>(null);
  const areaLabelRef = useRef<any>(null);
  const showIndRef = useRef<any>(null); // 用作地图图标事件内做判断使用
  const poiLabel = useRef<any>(null);
  const allPointMarker = useRef<any>([]);
  const [protectedAreaGroup, setProtectedAreaGroup] = useState<any>(null);
  const [visible, setVisible] = useState(false);
  const [indicator, setIndicator] = useState<any>(null);
  const [radarData, setRadarData] = useState<any>(null);
  const [isCoffee, setIsCoffee] = useState<boolean>(false);
  const [areaData, setAreaData] = useState<any>([]); // 前xx模型推荐圈
  const [allAreaData, setAllAreaData] = useState<any>([]);// 存储所有模型推荐圈
  const [showInd, setShowInd] = useState(-1);
  const [mapType, setMapType] = useState(false); // false设置默认地图，true卫星地图
  const [leftDrawerVisible, setLeftDrawerVisible] = useState(true);
  const [rankActive, setRankActive] = useState<string>(rankStatus.rank100);
  const methods = useMethods({
    // 获取模型推荐圈列表
    getAreaData: async () => {
      const res = await modelCircle({ id });
      setModel({ ...res });
      setAreaData(res.items || []);
      setAllAreaData(res.items || []);
    },
    // 选择区域
    selectArea(val, ind) {
      const changeIcon = (ind, value) => {
        areaData[ind]?.areaMarker.setContent(
          `<div class='iconCon'><div class='iconText'>${ind > 2 ? ind + 1 : ''}</div><div><img src='${`//staticres.linhuiba.com/project-custom/locationpc/map/${value}.png`}' class='iconStyle'></img></div></div>`);
      };
      if (areaData[showInd]) {
        // https://lbs.amap.com/api/jsapi-v2/documentation#circlemarker
        areaData[showInd]?.circle?.setOptions({
          strokeColor: '#006AFF',
          fillColor: '#006AFF',
        });
        areaData[showInd]?.polygon?.setOptions({
          strokeColor: '#006AFF',
          fillColor: '#006AFF',
        });
        if (showInd === 0) {
          changeIcon(showInd, 'pointone');
        } else if (showInd === 1) {
          changeIcon(showInd, 'pointtwo');
        } else if (showInd === 2) {
          changeIcon(showInd, 'pointthree');
        } else {
          changeIcon(showInd, 'marker');
        }
      }
      areaData[ind]?.circle?.setOptions({
        strokeColor: '#FC7657',
        fillColor: '#FC7657',
      });
      areaData[ind]?.polygon?.setOptions({
        strokeColor: '#FC7657',
        fillColor: '#FC7657',
      });
      if (ind === 0) {
        changeIcon(ind, 'selectone');
      } else if (ind === 1) {
        changeIcon(ind, 'selecttwo');
      } else if (ind === 2) {
        changeIcon(ind, 'selectthree');
      } else {
        changeIcon(ind, 'selectmarker');
      }

      showIndRef.current = ind;
      setShowInd(ind);
      val.areaMarker.setIcon(
        new window.AMap.Icon(methods.getAreaIconOpt(ind, true))
      );
      // _mapIns.setCenter([val.lng, val.lat]);
      // _mapIns.setZoom(17);
      if (val?.lng && val?.lat) {
        _mapIns.setZoomAndCenter(17, [+val.lng, +val.lat], false, 200);
        areaLabelRef.current.setPosition([+val.lng, +val.lat]);
      }
      areaLabelRef.current.setContent(
        `<div class='icon-label'><div class='trangle'></div><span class='text-name'>${
          val.name
        }-<span class='text-rank'>${Math.round(
          val.totalScore
        )}分</span></span></div>`
      );
    },
    // 绘制区域
    drawArea: async () => {
      allPointMarker.current.forEach((item) => {
        _mapIns.remove(item);
      });
      const protectedAreaGroup: any = [];
      const allMarker:any = [];
      // 添加圆圈
      areaData.forEach((val, ind) => {
        let polygon:any = null;
        // 添加围栏
        if (isArray(val.border) && val.border.length) {
          const arr = val.border.map((item) => {
            return [+item.lng, +item.lat];
          });
          polygon = methods.createBorder(arr);
          val.polygon = polygon;
          protectedAreaGroup.push(polygon);

        }
        const circle = methods.createCircle(val);
        const areaMarker = new window.AMap.Marker({
          zooms: [1, 20],
          zIndex: 13,
          // icon: new window.AMap.Icon(methods.getAreaIconOpt(ind)),
          anchor: 'bottom-center',
          position: new window.AMap.LngLat(val.lng, val.lat),
          content: `<div class='iconCon'><div class='iconText'>${ind > 2 ? ind + 1 : ''}</div><div><img src=${methods.getAreaIconOpt(ind).image} class='iconStyle'></img></div></div>`
        });
        // 中心点位的hover
        areaMarker.on('mouseover', function () {
          showIndRef.current !== ind &&
            areaMarker.setIcon(
              new window.AMap.Icon(methods.getAreaIconOpt(ind, true))
            );
          circle?.setOptions({
            fillOpacity: 0.2,
          });
          polygon?.setOptions({
            fillOpacity: 0.2,
          });
          showIndRef.current !== ind &&
            labelRef.current.setPosition([val.lng, val.lat]);
          showIndRef.current !== ind &&
            labelRef.current.setContent(
              `<div class='icon-label'><div class='trangle'></div><span class='text-name'>${
                val.name
              }-<span class='text-rank'>${Math.round(
                val.totalScore
              )}分</span></span></div>`
            );
        });
        // 中心定位的移除hover
        areaMarker.on('mouseout', function () {
          showIndRef.current !== ind &&
            areaMarker.setIcon(
              new window.AMap.Icon(methods.getAreaIconOpt(ind))
            );
          circle?.setOptions({
            fillOpacity: 0.1,
          });
          polygon?.setOptions({
            fillOpacity: 0.1,
          });
          showIndRef.current !== ind && labelRef.current.setContent(` `);
        });
        // 中心定位的点击
        areaMarker.on('click', function () {
          const dom = document.getElementById(`area${ind}`);
          if (dom) {
            methods.selectArea(val, ind)
            ;(dom as any).scrollIntoView({ block: 'start', behavior: 'smooth' });
          }
        });
        val.areaMarker = areaMarker;
        val.circle = circle;
        ind === 0 && _mapIns.setFitView([circle]);
        ind === 0 && methods.selectArea(val, 0);
        val.brandMark && protectedAreaGroup.push(circle, areaMarker);
        !val.brandMark && _mapIns.add([circle, areaMarker]);
        allMarker.push(circle, areaMarker);
      });
      allPointMarker.current = allMarker;
      const overlayGroups = new window.AMap.OverlayGroup(protectedAreaGroup);
      setProtectedAreaGroup(overlayGroups);
      _mapIns.add(overlayGroups);
    },
    createCircle: (val) => {
      const circle = new window.AMap.Circle({
        center: [val.lng, val.lat],
        radius: val.radius, // 半径
        strokeColor: '#006AFF',
        strokeWeight: 2,
        strokeOpacity: 1,
        fillOpacity: 0.1,
        strokeStyle: 'dashed',
        strokeDasharray: [10, 10],
        fillColor: '#006AFF',
        zIndex: 50,
        bubble: true,
      });
      // 范围圆圈的hover
      circle.on('mouseover', function () {
        circle?.setOptions({
          fillOpacity: 0.2,
        });
      });
      // 范围圆圈的移除hover
      circle.on('mouseout', function () {
        circle?.setOptions({
          fillOpacity: 0.1,
        });
      });
      return circle;
    },
    getAreaIconOpt: (ind, select) => {
      let image = '';
      if (select) {
        image =
          ind < 3
            ? areaIcon[ind + 3].url
            : '//staticres.linhuiba.com/project-custom/locationpc/map/selectmarker.png';
      } else {
        image =
          ind < 3
            ? areaIcon[ind].url
            : '//staticres.linhuiba.com/project-custom/locationpc/map/marker.png';
      }
      return {
        image,
        size: [48, 48],
        imageSize: [48, 48],
      };
    },
    changeMapType() {
      const type = !mapType;
      setMapType(!mapType);
      const layers = _mapIns.getLayers();
      layers.forEach(
        (layer) =>
          layer.CLASS_NAME === 'AMap.TileLayer.Satellite' &&
          (type ? layer.show() : layer.hide())
      );
    },
    createBorder: (val) => {
      const polygon = new window.AMap.Polygon({
        path: val,
        fillColor: '#006AFF',
        strokeOpacity: 1,
        fillOpacity: 0.1,
        strokeColor: '#006AFF',
        strokeWeight: 1,
        strokeStyle: 'dashed',
        zIndex: 60,
        anchor: 'bottom-center',
        bubble: true,
      });
      polygon.on('mouseover', function(e) {
        e?.target?.setOptions({
          fillOpacity: 0.4,
        });

      });
      polygon.on('mouseout', function(e) {
        e?.target?.setOptions({
          fillOpacity: 0.1,
        });
      });
      return polygon;
    },
    handleRank: (key) => {
      setRankActive(key);
    }
  });
  const getTargetTenent = () => {
    tenantCheck().then(({ isCoffee }) => {
      setIsCoffee(isCoffee);
    });
  };

  const handleRadarInfo = () => {
    if (!areaData?.length) return;
    const indicatorData: any = [];
    const radarData: any = [];

    areaData.map((item, index) => {
      indicatorData[index] = [];
      radarData[index] = [];
      item.scores.map((val) => {
        indicatorData[index].push({
          name: val.name,
          max: 100,
        });
        radarData[index].push(val.score);
      });
    });
    setIndicator(indicatorData);
    setRadarData(radarData);
  };

  useEffect(() => {
    handleRadarInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaData]);
  useEffect(() => {
    methods.getAreaData();
    getTargetTenent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  // 绘制区域点
  useEffect(() => {
    // 初始化页面内容，包含生成区域和生成作为label的marker
    if (!_mapIns || areaData.length === 0) return;
    const option = {
      zooms: [1, 20],
      map: _mapIns,
      content: ' ',
      zIndex: 99,
    };
    poiLabel.current = new window.AMap.Marker({
      content: ' ',
      map: _mapIns,
      anchor: 'top-left',
      offset: [-34, 6],
    });
    if (!labelRef.current) {
      const textIns = new window.AMap.Marker(option);
      labelRef.current = textIns;
    }
    if (!areaLabelRef.current) {
      const textIns2 = new window.AMap.Marker(option);
      areaLabelRef.current = textIns2;
    }
    methods.drawArea();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_mapIns, areaData, id]);

  useEffect(() => {
    if (!protectedAreaGroup) return;
    if (!visible) {
      protectedAreaGroup.show();
    } else {
      protectedAreaGroup.hide();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, protectedAreaGroup]);

  useEffect(() => {
    if (!allAreaData.length) return;
    const length = rankOptions.filter((item) => item.key === rankActive)?.[0]?.value;
    const arr = allAreaData.slice(0, length);
    setAreaData(arr);
  }, [rankActive, allAreaData]);

  return (
    <div>
      <MapDrawer
        placement='left'
        mapDrawerStyle={{
          width: '310px',
          top: '48px',
          height: 'max-content', // 动态高度
          left: '10px',
          maxHeight: 'calc(100vh - 70px)', // 动态高度，70是根据UI稿
          transform:
          leftDrawerVisible ? 'translateX(0%)' : 'translateX(-320px)'
        }}
        visible={leftDrawerVisible}
        setVisible={setLeftDrawerVisible}
      >
        <div className={styles.leftCon}>
          <div className={styles.top}>
            <div className={styles.title}>
              <div>{model.address}</div>
              <div>{model.modelName}推荐结果</div>
            </div>
            {
              !isCoffee && (
                <div className={styles.check}>
                  <Checkbox
                    checked={visible}
                    onChange={(e) => {
                      setVisible(e.target.checked);
                    }}
                  >
                    <span className={styles.checkLabel}>
                隐藏本品牌已开店保护区域
                    </span>
                  </Checkbox>
                </div>)
            }
          </div>
          {/* 前xx名筛选项 */}
          <div className={styles.rankCon}>
            {
              rankOptions.map((item) => <div
                key={item.key}
                className={cs(styles.rankItem, rankActive === item.key ? styles.active : '')}
                onClick={() => methods.handleRank(item.key)}
              >
                {item.name}
              </div>)
            }
          </div>
          <div className={styles.listCon}>
            <div className={styles.list}>
              {areaData.map(
                (val, ind) =>
                  !(val.brandMark && visible) && (
                    <div
                      id={`area${ind}`}
                      className={styles.item}
                      key={val.clusterId}
                      onClick={() => methods.selectArea(val, ind)}
                    >
                      <div className={styles.list_top}>
                        {/* 前三名奖牌 */}
                        {ind < 3 ? (
                          <div className={styles.avatar}>
                            <Avatar
                              shape='square'
                              size={24}
                              src={leftIcon[ind].url}
                            />
                          </div>)
                          : <div className={styles.avatar}></div>
                        }
                        {/* 得分 */}
                        <div className={styles.score}>
                          {Math.round(val.totalScore)}分
                        </div>
                        <div>
                          <Tooltip
                            placement='bottom'
                            title={`NO.${ind + 1}-${val.name}`}
                            color='#000000'
                            overlayClassName={styles.tooltipName}
                          >
                            <span className={styles.name}>
                              {/* {`NO.${ind + 1}-${val.name}`}     */}

                              {`NO.${ind + 1}-${val.name}`}
                            </span>
                          </Tooltip>
                        </div>
                        <div className={styles.logo}>
                          {val.logo && <img src={val.logo}/>}
                        </div>

                        <div className={styles.caret}>
                          {ind === showInd ? (
                          // <CaretUpOutlined style={{ color: '#656E85' }} />
                            <></>
                          ) : (
                            <CaretDownOutlined style={{ color: '#656E85' }} />
                          )}
                        </div>
                      </div>

                      {/* 雷达图 */}
                      {ind === showInd && indicator && radarData && (
                        <Radar
                          data={radarData[ind]}
                          indicator={indicator[ind]}
                          title={Math.round(areaData[ind].totalScore)}
                          titleLabel='总分'
                          radius={60}
                          height='226px'
                          titleTextFontSize={['16px', '10px']}
                          radarInfo={{
                            rich: {
                              a: {
                                color: '#999999',
                                lineHeight: 18,
                                fontSize: '10px',
                                align: 'center',
                              },
                              b: {
                                color: '#222222',
                                align: 'center',
                                fontWeight: 'bolder',
                                fontSize: '12px',
                              },
                            },
                          }}
                          shape= 'polygon'
                          startAngle={90}
                        />
                      )}
                      {/* 查看详情 */}
                      {ind === showInd && (
                        <a
                          onClick={() =>
                            dispatchNavigate(
                              `/recommend/detail?id=${id}&ind=${ind}`
                            )
                          }
                        >
                        查看详情 {'>'}
                        </a>
                      )}
                    </div>
                  )
              )}
            </div>
          </div>
          {/* 产品团威要求所有租户隐藏该入口 */}
          {/* {isCoffee ? null : (
          <a
            onClick={() => dispatchNavigate(`/recommend/modelreport?id=${id}`)}
          >
            查看完整报告 {'>'}
          </a>
        )} */}
        </div>
      </MapDrawer>
    </div>
  );
};
export default LeftCon;
