/**
 * @Description 具体网规详情
 */
import { FC, useEffect, useMemo, useState } from 'react';
import styles from './index.module.less';
import cs from 'classnames';
// import V2Title from '@/common/components/Feedback/V2Title';
import IconFont from '@/common/components/IconFont';
import { Button, Tooltip } from 'antd';
import { getModelClusterDetail, postModelClusterFavor } from '@/common/api/networkplan';
// import PieCharts from '@/common/components/business/NetworkPlanLeftDetail/PieEChart';
// import { color } from '@/common/components/business/NetworkPlanLeftDetail/ts-config';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import SurroundInfo from '@/views/recommend/pages/industrycircle/components/SurroundInfo';

const NetworkPlanLeftDetail:FC<any> = ({
  id,
  backList,
  // style,
  mainHeight,
  amapIns,
  setDetailData,
}) => {
  const [detail, setDetail] = useState<any>(null);
  const targetHeight = useMemo(() => {
    return mainHeight - 40;
  }, [mainHeight]);
  const getDetail = async() => {
    const data = await getModelClusterDetail({ id });
    setDetail(data);
    setDetailData({
      id,
      visible: true,
      detail: data
    });
  };

  const basicData = [
    { label: '行业评分', data: Math.floor(detail?.mainBrandsScore) || '-', unit: '' },
    { label: '行业适合度', data: detail?.mainBrandsProba ? Math.floor(detail?.mainBrandsProba * 100) + '%' : '-', unit: '' },
    { label: '商圈类型', data: `${detail?.firstLevelCategory || ''} | ${detail?.secondLevelCategory || ''}`, unit: '' },
    { label: '商圈地址', data: `${detail?.provinceName && (detail?.provinceName !== detail?.cityName) ? detail.provinceName : ''}${detail?.cityName || ''}${detail?.districtName || ''}`, unit: '' },
  ];
  // const macroscopicAnalysisData = [
  //   { label: '城市平均房价', data: detail?.macroscopicAnalysis?.avgHousePrice, unit: '元/㎡' },
  //   { label: '地区生产总值', data: detail?.macroscopicAnalysis?.gdp, unit: '亿元' },
  //   { label: '城镇人均支配收入', data: detail?.macroscopicAnalysis?.townIncome, unit: '元' },
  //   { label: '流入人口数量', data: detail?.macroscopicAnalysis?.flowPopulation, unit: '万人' },
  //   // { label: '商圈客流量', data: detail?.macroscopicAnalysis?.shoppingPassenger1000m, unit: '万人' },
  //   { label: '女性人口占比', data: detail?.macroscopicAnalysis?.womanPopulationProportion ? (detail?.macroscopicAnalysis?.womanPopulationProportion).toFixed(1) : '', unit: '%' }
  // ];
  // const peripheralAnalysisData = [
  //   // { label: '周边美妆品牌数量', data: detail?.peripheralAnalysis?.beautyBrands1000m, unit: '个' },
  //   // { label: '周边餐饮品牌数量', data: detail?.peripheralAnalysis?.leisureFoodBrands300m, unit: '个' },
  //   // { label: '周边小区门店数量', data: detail?.peripheralAnalysis?.houseStores1000m, unit: '个' },
  //   { label: '小区房价_300m', data: detail?.peripheralAnalysis?.housePrice300m, unit: '元/㎡' },
  //   { label: '小区房价_1km', data: detail?.peripheralAnalysis?.housePrice1000m, unit: '元/㎡' },
  //   { label: '商务住宅房价', data: detail?.peripheralAnalysis?.apartmentCustomerPrice300m, unit: '元/㎡' },
  //   { label: '生活服务客单价', data: detail?.peripheralAnalysis?.lifeCustomerPrice1000m, unit: '元' },
  //   { label: '周边影院票房', data: detail?.peripheralAnalysis?.medicalPrice1000m, unit: '亿' },
  //   // { label: '周边购物服务数量', data: detail?.peripheralAnalysis?.shoppingStores1000m, unit: '个' },
  //   // { label: '周边休闲服务数量', data: detail?.peripheralAnalysis?.leisureStores1000m, unit: '个' },
  //   // { label: '周边餐饮数量', data: detail?.peripheralAnalysis?.foodNumber1000m, unit: '个' },
  //   // { label: '周边大学数量', data: detail?.peripheralAnalysis?.universityStores1000m, unit: '个' },
  //   // { label: '周边写字楼数量', data: detail?.peripheralAnalysis?.officeStores300m, unit: '个' },
  //   // { label: '周边体育休闲服务数量', data: detail?.peripheralAnalysis?.leisureMinDistance300m, unit: '个' },
  //   // { label: '周边小区数量', data: detail?.peripheralAnalysis?.houseNumber1000m, unit: '个' },
  // ];

  useEffect(() => {
    id && getDetail();
  }, [id]);

  const handleFavor = () => {
    const build = !detail?.isFavourate;
    postModelClusterFavor({
      clusterId: detail.id,
      build,
    }).then(() => {
      V2Message.success(build ? '收藏成功' : '取消收藏成功');
      getDetail();
    });
  };

  return <div className={styles.container}>
    <div className={cs(styles.goBack, 'fs-12 c-222 pl-12')} onClick={() => backList()}>
      <IconFont iconHref='iconic_fanhui'/>
      <span className='ml-8'>返回可视范围列表</span>
    </div>
    <div className={styles.areaTitle}>
      <div className='fs-16 c-222 bold mt-4'>{detail?.areaName || '-'}</div>
      <Tooltip placement='top' title={detail?.isFavourate ? '取消收藏' : '收藏'}>
        <Button onClick={handleFavor} className={styles.favorBtn}>
          <IconFont
            iconHref={detail?.isFavourate ? 'iconic_weisoucang' : 'iconic_ic_weisoucang'}
            className={cs(styles.favorIcon, detail?.isFavourate && 'c-006')}
          />
        </Button>
      </Tooltip>
    </div>
    <div
      style={{
        height: `${targetHeight}px`,
        overflowY: 'auto'
      }}>
      <div className={styles.detailInfo} >

        <div className={styles.industryWrapper}>
          <div className={styles.titleRow}>
            <div className={cs(styles.titleName, 'fs-14')}>行业评分
            </div>
            <span className='ml-12 fs-14 c-999'>{detail?.districtName || ''}{detail?.firstLevelCategory || ''}排名第 <span className='c-006 bold'>{`${detail?.mainBrandsRank || '-'}`}</span> 名</span>
          </div>
          <div className='pl-16 pr-16 pb-16'>
            {basicData.map((item, index) => (
              <div key={index} className={cs(styles.detailRow, 'fs-14 mt-12')}>
                <div className={cs(styles.itemName, 'c-666')}>{item.label}</div>
                <div className={cs(styles.itemValue, 'c-222')}>{item.data || '-'}</div>
              </div>
            ))}
          </div>
        </div>

        {/* TODO: 这块暂时false掉，不确定是否还需要 */}

        {/* <>
          {detail?.peripheralProperties?.length
            ? <V2Title divider type='H3' className='mt-16'>
              <div className='bold c-222'>业态概览</div>
            </V2Title>
            : <></>} */}
        {/* 注意piecharts宽度，防止宽度过大，引起x方向可滚动 */}
        {/* <PieCharts config={{
            data: detail?.peripheralProperties || []
          }} width={284} height={180}/>
          <Row gutter={19}>
            {
              detail?.peripheralProperties?.map((item, index) => <Col span={12} className={styles.tooltip}>
                <div>
                  <span
                    className={styles.colorBlock}
                    style={{
                      backgroundColor: color[index]
                    }}></span>
                  <span className='inline-block mr-8'>{item.name}</span>
                  <span className={styles.number}>
                    {+item.value >= 10000
                      ? `${(item.value / 10000)?.toFixed(1)}w` : item.value}
                  </span>
                </div>
                <span className='inline-block pr-4'>{item.rate}</span>
              </Col>
              )
            }
          </Row> */}

        {/* 宏观分析，当macroscopicAnalysisData有数据的时候，展示标题 */}
        {/* {macroscopicAnalysisData.some((item) => item.data)
            ? <V2Title divider type='H3' className='mt-16'>
              <div className='bold c-222'>城市数据</div>
            </V2Title> : <></>}
          <Row gutter={12}>
            {
              macroscopicAnalysisData.map((item, index) => {
                return item.data ? <Col span={12}>
                  <div key={index} className={cs(styles.itemBlock, 'mt-12')}>
                    <div className={styles.itemName}>{item.label}</div>
                    <div className='mt-10'>
                      <span className={styles.itemValue}>{item.data}</span>
                    &nbsp;
                      <span className='fs-12'>{item.unit}</span>
                    </div>
                  </div>
                </Col> : null;
              })
            }
          </Row> */}

        {/* 周边分析，当peripheralAnalysisData有数据的时候，展示标题 */}
        {/* {peripheralAnalysisData.some((item) => item.data)
            ? <V2Title divider type='H3' className='mt-16'>
              <div className='bold c-222'>其他数据</div>
            </V2Title> : <></>}
          <Row gutter={12}>
            {
              peripheralAnalysisData.map((item, index) => {
                return item.data ? <Col span={12}>
                  <div key={index} className={cs(styles.itemBlock, 'mt-12')}>
                    <div className={styles.itemName}>{item.label}</div>
                    <div className='mt-10'>
                      <span className={styles.itemValue}>{item.data}</span>
                    &nbsp;
                      <span className='fs-12'>{item.unit}</span>
                    </div>
                  </div>
                </Col> : null;
              })
            }
          </Row> */}

        {/* </> */}
        {/* 业态饼图 */}
      </div>

      {/* 周边信息*/}
      <SurroundInfo
        detail = {detail} // 商圈信息
        mainHeight={mainHeight}
        amapIns={amapIns} // 地图实例
      />
    </div>
  </div>;
};
export default NetworkPlanLeftDetail;

