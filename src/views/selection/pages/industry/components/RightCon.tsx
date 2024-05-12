import { FC, useEffect, useRef, useState } from 'react';
import styles from '../entry.module.less';
import cs from 'classnames';
import IconFont from '@/common/components/IconFont';
import DrawerSide from './DrawerSide';
import { beautifyThePrice, debounce, downloadFile, isArray } from '@lhb/func';
import { Button, Col, Row, Tabs } from 'antd';
import { valueFormat } from '@/common/utils/ways';
import { carSaleMap, cityInfoMap } from '../ts-config';
import { CITY_LEVEL } from '@/common/components/AMap/ts-config';
import { getCityAreaInfoByCityId } from '@/common/api/selection';
import Greeting from '@/common/components/NotFound';
import { tenantCheck } from '@/common/api/common';
import BrandInfo from './BrandInfo';
import ShopDetailDraw from '@/common/components/business/IndustryMap/ShopDetailDraw';

const ItemInfo = (value, label, unit?, isMini?) => {
  // 查找当前字段
  const targetFields: any = cityInfoMap.find((item: any) => item.label === label) || {};
  // 需要展示正整数且千分位展示的字段
  const needKeepIntKey = ['area', 'population', 'flowPopulation', 'gdp'];
  const isTargetKey = needKeepIntKey.includes(targetFields?.key);
  return <div key={label} className={cs(styles.itemInfo, isMini && styles.miniItemInfo, isMini ? 'mb-6' : 'mb-12')}>
    <span className={cs(isMini ? 'fn-18' : 'fn-20', 'c-132 bold ct')}>
      {
        isTargetKey ? beautifyThePrice(Math.floor(value), ',', 0) : valueFormat(value)
      }
    </span>
    <span className='fn-12 c-656'>
      {label}{unit && `(${unit})`}
    </span>
  </div>;
};
const RightCon: FC<any> = ({
  brandListOnCountry,
  _mapIns,
  city,
  level,
  curAreaInfo,
  month
}) => {
  const listRef = useRef<any>(null);
  const [brandList, setBrandList] = useState<any>([]);
  const [actKey, setActKey] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(true);
  const [leftBtnDisabled, setLeftBtnDisabled] = useState<boolean>(true);
  const [rightBtnDisabled, setRightBtnDisabled] = useState<boolean>(false);
  const [type, setType] = useState<string>('point');
  const [cityAreaInfo, setCityAreaInfo] = useState<any>(null);
  const [isLuguoqiche, setIsLuguoqiche] = useState<boolean>(false);
  const checkIsLuguoqiche = async () => {
    const { isLuguoqiche } = await tenantCheck();
    setIsLuguoqiche(isLuguoqiche);
  };
  const [shopDetailDrawData, setShopDetailDrawData] = useState<any>({
    open: false,
    id: null
  });
  useEffect(() => {
    checkIsLuguoqiche();
  }, []);
  useEffect(() => {
    // 当前点击商圈变化时自动选中商圈具体信息tab
    if (curAreaInfo) {
      setType('area');
    }
  }, [curAreaInfo]);
  useEffect(() => {
    setActKey(0);
    setBrandList(brandListOnCountry);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandListOnCountry]);
  useEffect(() => {
    if (level >= CITY_LEVEL) {
      getCityAreaInfo(city.id);
    } else if (type === 'city') {
      setType('point');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city, level]);
  const getCityAreaInfo = async (cityId) => {
    const res = await getCityAreaInfoByCityId({ cityId });
    setCityAreaInfo(res || {});
  };
  const onClickBrand = (ind) => {
    setActKey(ind);
  };
  // 点击按钮自动滚动的方法
  const onClickSild = (type) => {
    const dom: any = listRef.current;
    const currentLeft = dom.scrollLeft;
    let num = 0;
    if (type === 'left') {
      if (currentLeft === 0) return;
      num = currentLeft - 114;
    } else {
      num = currentLeft + 114;
    }
    dom.scrollTo({
      left: num,
      behavior: 'smooth'
    });
  };
  // 控制左右按钮是否可点击
  const scrollList = debounce((e) => {
    const left = e.target.scrollLeft;
    const len = brandList.length - 2 < 0 ? 0 : brandList.length - 2;
    let leftStatus = true;
    let rightStatus = false;
    if (left !== 0) {
      leftStatus = false;
    }
    // len * 单个按钮的宽度<=滚动距离禁用（滚动距离超出计算出的左侧最长长度）
    if (len * 114 <= left) {
      rightStatus = true;
    };
    leftStatus !== leftBtnDisabled && setLeftBtnDisabled(leftStatus);
    rightStatus !== rightBtnDisabled && setRightBtnDisabled(rightStatus);
  }, 200);
  const onChangeType = (key) => {
    setType(key);
  };
  // 将部分数值以千分位的形式展示
  const thousandsNum = (targetNum: any) => {
    if (+targetNum) {
      return beautifyThePrice(Math.floor(targetNum), ',', 0);
    }
    return targetNum;
  };
  const filterInfo = ['省', '市', '区', '地理围栏',
    '商圈ID'
  ];
  const isTargetRow = (arr: any[], index: number) => {
    const targetRow = arr[index];
    const targetIdRow = arr.find((item: any) => item.name === '商圈ID');
    return targetIdRow && targetRow?.name === '商圈名称';
  };
  // 显示详情
  const showShopDetail = (arr: any[], index: number) => {
    if (isTargetRow(arr, index)) {
      const targetIdRow = arr.find((item: any) => item.name === '商圈ID');
      const { value: id } = targetIdRow;
      setShopDetailDrawData({
        open: true,
        id: +id
      });
    }
  };
  return <>
    <div className={
      cs(styles.zoomBtn, 'bg-fff', open && styles.zoomShow)
    }>
      <div
        onClick={() => _mapIns && _mapIns.zoomIn()}
        className={cs(styles.borderBottom, 'lh-36 ct pointer c-132')}>
        <IconFont iconHref='iconadd' />
      </div>
      <div
        onClick={() => _mapIns && _mapIns.zoomOut()}
        className='lh-36 ct pointer c-132'>
        <IconFont iconHref='iconminus' />
      </div>
    </div>
    <DrawerSide
      placement='right'
      visible={open}
      onClose={() => setOpen(false)}
      onShow={() => setOpen(true)}
      style={{ height: '100%' }}
    >
      <div className={cs(styles.rightCon, 'mr-16 mt-16 pt-20')} >
        <Tabs
          activeKey={type}
          type='card'
          onChange={onChangeType}>
          <Tabs.TabPane tab='网点信息' key='point'>
            <div className={cs(styles.pointBody, styles.infoBody, 'pt-16 bg-fff')}>
              {brandList.length
                ? <>
                  <div className={styles.brandBtn}>
                    <div className={cs(styles.btn, 'c-006 bg-fff')} onClick={() => onClickSild('left')}>
                      <IconFont className={cs('fn-12', leftBtnDisabled && 'c-959')} style={{ width: '24px' }} iconHref='iconarrow-left' />
                    </div>
                    <div
                      className={styles.listCon}
                      onScroll={scrollList}
                      ref={listRef}>
                      {brandList.map((item, ind) =>
                        <div
                          onClick={() => onClickBrand(ind)}
                          key={item.id}
                          className={cs(styles.item, 'bg-fff', actKey === ind && styles.active)}>
                          <div className={cs(styles.imgCon, 'bg-fff')}><img src={item.logo ? item.logo : 'https://staticres.linhuiba.com/project-custom/locationpc/img_placeholder.png'} /></div>
                          <div className={cs(styles.name, 'c-132 fn-14 ct')}>{item.name}</div>
                        </div>)}
                    </div>
                    <div className={cs(styles.btn, 'c-006 bg-fff')} onClick={() => onClickSild('right')}>
                      <IconFont className={cs(rightBtnDisabled && 'c-959', 'fn-12')} style={{ width: '24px' }} iconHref='iconarrow-right' />
                    </div>
                  </div>
                  <div className={cs(styles.infoCon, 'mt-24 ml-16 mr-16')}>
                    <div className={styles.infoTop}>
                      <div className={cs(styles.topImg, 'bg-fff')}>
                        <img src={brandList[actKey]?.logo ? brandList[actKey]?.logo : 'https://staticres.linhuiba.com/project-custom/locationpc/img_placeholder.png'} />
                      </div>
                      <div className={styles.description}>
                        <div className='fn-16 c-132 bold'>{brandList[actKey]?.name}</div>
                        <div className={cs(styles.label, 'mt-8')}><div className={cs(styles.labelItem, 'c-006 ft-12 ct')}>品牌</div></div>
                      </div>
                    </div>
                    {/* <div className={cs(styles.infoBox, 'mt-36')}>
                      {ItemInfo(brandList[actKey]?.total, '网点总数')}
                      {ItemInfo(brandList[actKey]?.monthAdded, '当月新增')}
                      {ItemInfo(brandList[actKey]?.provinceCount, '覆盖省份')}
                      {ItemInfo(brandList[actKey]?.cityCount, '覆盖城市')}
                    </div> */}
                    <BrandInfo brand={brandList[actKey]} month={month}/>
                  </div>
                </>
                : <Greeting
                  imgClassName={styles.noData}
                  text='暂无数据' />}
            </div>
          </Tabs.TabPane>
          {
            level >= CITY_LEVEL && cityAreaInfo && <Tabs.TabPane tab='城市商圈信息' key='city'>
              <div className={styles.infoBody}>
                {Object.keys(cityAreaInfo).filter(key => cityAreaInfo[key]).length === 0
                  ? <Greeting
                    imgClassName={styles.noData}
                    text='暂无数据' />
                  : <>
                    {/* 城市信息 */}
                    {cityAreaInfo.cityInfo && <div className='mt-16'>
                      <p className='bold ml-16 mb-12'>城市信息</p>
                      <div className={cs(styles.infoBox, 'pl-16 pr-16')}>
                        {cityInfoMap.map(item => ItemInfo(cityAreaInfo.cityInfo[item.key], item.label, item.unit, true))}
                        {isLuguoqiche && ItemInfo(cityAreaInfo.cityInfo['townIncome'], '人均收入', '元', true)}
                      </div>
                    </div>}
                    {/* 汽车销量信息 */}
                    {cityAreaInfo.carSale && <div className={cityAreaInfo.cityInfo ? 'mt-6' : 'mt-16'}>
                      <p className='bold ml-16 mb-12'>上一年度城市汽车销量：{valueFormat(
                        thousandsNum(cityAreaInfo.carSale.totalSales), '辆')}
                      </p>
                      <div className={cs(styles.infoBox, 'pl-16 pr-16')}>
                        {carSaleMap.map(item => ItemInfo(thousandsNum(cityAreaInfo.carSale[item.key]), item.label, null, true))}
                        {ItemInfo(thousandsNum(Number(cityAreaInfo.carSale.conventionalHybrid) + Number(cityAreaInfo.carSale.electricHybrid)), '混合动力', null, true)}
                      </div>
                    </div>}
                    {/* 商圈信息 */}
                    {cityAreaInfo.areaCountList && <div className={cityAreaInfo.cityInfo || cityAreaInfo.carSale ? 'mt-6' : 'mt-16'}>
                      <p className='bold ml-16 mb-12'>商圈总数</p>
                      <div className={cs(styles.infoBox, 'pl-16 pr-16')}>
                        {cityAreaInfo.areaCountList.map(item => ItemInfo(item.total, item.areaName, null, true))}
                      </div>
                    </div>}

                    {/* 新能源汽车保有量 判断是否为小鹏汽车*/}
                    {isLuguoqiche && cityAreaInfo.cityInfo && <div className='mt-16'>
                      <p className='bold ml-16 mb-12'>新能源汽车保有量</p>
                      <div className={cs(styles.infoBox, 'pl-16 pr-16')}>
                        {/* {cityInfoMap.map(item => ItemInfo(cityAreaInfo.cityInfo[item.key], item.label, item.unit, true))} */}
                        {/* 1.判断是否为汽车，2.拿到保有量和千人拥有量的key*/}
                        {ItemInfo(3400, '保有量', '万辆', true)}
                        {ItemInfo(47.9, '千人拥有量', '', true)}
                      </div>
                    </div>}

                    {/* 新能源汽车保有量 判断是否为小鹏汽车*/}
                    {isLuguoqiche && cityAreaInfo.cityInfo && <div className='mt-16'>
                      <p className='bold ml-16 mb-12'>各新能源品牌市占率</p>
                      <div className={cs(styles.infoBox, 'pl-16 pr-16')}>
                        {/* {cityInfoMap.map(item => ItemInfo(cityAreaInfo.cityInfo[item.key], item.label, item.unit, true))} */}
                        {/* 1.判断是否为汽车，2.这块需要动态遍历 */}
                        {ItemInfo('23.78%', '小鹏', '', true)}
                        {ItemInfo('18.98%', '理想', '', true)}
                        {ItemInfo('14.21%', '蔚来', '', true)}
                      </div>
                    </div>}
                  </>}
                {isLuguoqiche && <div className={cs(styles.infoBox, 'pl-16 pr-16 mt-20')}>
                  <Button type='primary' block onClick={() => {
                    downloadFile({
                      url: 'https://staticres.linhuiba.com/project-custom/locationpc/file/行业地图导出模版.xlsx'
                    });
                  }}>导出信息</Button>
                </div>}
              </div>
            </Tabs.TabPane>
          }
          {
            curAreaInfo && <Tabs.TabPane tab='商圈具体信息' key='area'>
              <div className={styles.infoBody}>
                <Row className='pd-16' gutter={[16, 10]}>
                  {/* {areaDeatil.map(detail => curAreaInfo.hasOwnProperty(detail.key) && <Col span={24} key={detail.key}>
                    <div className='c-132'>
                      <span className='c-959'>{detail.label}：</span>
                      {valueFormat(curAreaInfo[detail.key], detail.unit)}
                    </div>
                  </Col>)} */}
                  {isArray(curAreaInfo.importValues) && curAreaInfo.importValues.length && curAreaInfo.importValues.map((detail) => {
                    if (filterInfo.includes(detail.name)) {
                      return;
                    } else {
                      return (
                        <Col span={24} key={detail.index}>
                          <div>
                            <span className='c-132 bold'>{detail.name}：</span>
                            <span
                              className={cs(
                                'c-132',
                                styles.content,
                                isTargetRow(curAreaInfo.importValues, detail.index) ? 'pointer c-006' : '')}
                              onClick={() => showShopDetail(curAreaInfo.importValues, detail.index)}
                            >
                              {valueFormat(detail.value)}
                            </span>
                          </div>
                        </Col>
                      );
                    }

                  }
                  ) }
                  {isLuguoqiche && <Col span={24}>
                    <span className='c-132 bold'>客群画像：</span>
                    <span
                      onClick={() => downloadFile({
                        url: 'https://staticres.linhuiba.com/project-custom/locationpc/file/客群画像.pdf'
                      })}
                      className={'c-006 pointer'}>点击查看</span>
                  </Col>}
                </Row>
              </div>
            </Tabs.TabPane>
          }
        </Tabs>
      </div>
    </DrawerSide>

    <ShopDetailDraw
      drawData={shopDetailDrawData}
      close={() => setShopDetailDrawData({ open: false, id: null })}
    />
  </>;
};

export default RightCon;

