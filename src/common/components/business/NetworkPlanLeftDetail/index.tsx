/**
 * @Description 商圈点位详情
 */
import { FC, useEffect, useMemo, useState } from 'react';
import styles from './index.module.less';
import cs from 'classnames';
import V2Title from '@/common/components/Feedback/V2Title';
import { Col, Row } from 'antd';
import { getPlanClusterDetail, getPlanDetail } from '@/common/api/networkplan';
import PieCharts from './PieEChart';
import { businessType, color } from './ts-config';
import { isNotEmpty } from '@lhb/func';
import { amountStr } from '@/common/utils/ways';
import IconFont from '@/common/components/IconFont';
import V2DetailGroup from '@/common/components/Feedback/V2DetailItem/Group';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';

const NetworkPlanLeftDetail:FC<any> = ({
  id,
  backList,
  style,
  mainHeight,
  type,
  isModelCluster = false // 是否行业商圈（益禾堂），目前只有行业商圈（适用益禾堂）里才传这个字段
}) => {
  const [detail, setDetail] = useState<any>(null);
  const targetHeight = useMemo(() => {
    return mainHeight - 40;
  }, [mainHeight]);
  const getDetail = async() => {
    const fetchMethod = isModelCluster ? getPlanDetail : getPlanClusterDetail;
    const data = await fetchMethod({ id });
    setDetail(data);
  };
  const basicData = [
    { label: '预测日营业额', data: (isNotEmpty(detail?.lowSalesAmountPredict) || isNotEmpty(detail?.upSalesAmountPredict)) ? `${amountStr(detail?.lowSalesAmountPredict)}-${amountStr(detail?.upSalesAmountPredict)}` : '', unit: '元' },
    { label: '已开门店', data: detail?.openStores, unit: '' },
  ];
  const macroscopicAnalysisData = [
    { label: '城市平均房价', data: detail?.macroscopicAnalysis?.avgHousePrice, unit: '元/㎡' },
    { label: '地区生产总值', data: detail?.macroscopicAnalysis?.gdp, unit: '亿元' },
    { label: '城镇人均支配收入', data: detail?.macroscopicAnalysis?.townIncome, unit: '元' },
    { label: '流入人口数量', data: detail?.macroscopicAnalysis?.flowPopulation, unit: '万人' },
    // { label: '商圈客流量', data: detail?.macroscopicAnalysis?.shoppingPassenger1000m, unit: '万人' },
    { label: '女性人口占比', data: detail?.macroscopicAnalysis?.womanPopulationProportion ? (detail?.macroscopicAnalysis?.womanPopulationProportion).toFixed(1) : '', unit: '%' }
  ];
  const peripheralAnalysisData = [
    // { label: '周边美妆品牌数量', data: detail?.peripheralAnalysis?.beautyBrands1000m, unit: '个' },
    // { label: '周边餐饮品牌数量', data: detail?.peripheralAnalysis?.leisureFoodBrands300m, unit: '个' },
    // { label: '周边小区门店数量', data: detail?.peripheralAnalysis?.houseStores1000m, unit: '个' },
    { label: '小区房价_300m', data: detail?.peripheralAnalysis?.housePrice300m, unit: '元/㎡' },
    { label: '小区房价_1km', data: detail?.peripheralAnalysis?.housePrice1000m, unit: '元/㎡' },
    { label: '商务住宅房价', data: detail?.peripheralAnalysis?.apartmentCustomerPrice300m, unit: '元/㎡' },
    { label: '生活服务客单价', data: detail?.peripheralAnalysis?.lifeCustomerPrice1000m, unit: '元' },
    { label: '周边影院票房', data: detail?.peripheralAnalysis?.medicalPrice1000m, unit: '亿' },
    // { label: '周边购物服务数量', data: detail?.peripheralAnalysis?.shoppingStores1000m, unit: '个' },
    // { label: '周边休闲服务数量', data: detail?.peripheralAnalysis?.leisureStores1000m, unit: '个' },
    // { label: '周边餐饮数量', data: detail?.peripheralAnalysis?.foodNumber1000m, unit: '个' },
    // { label: '周边大学数量', data: detail?.peripheralAnalysis?.universityStores1000m, unit: '个' },
    // { label: '周边写字楼数量', data: detail?.peripheralAnalysis?.officeStores300m, unit: '个' },
    // { label: '周边体育休闲服务数量', data: detail?.peripheralAnalysis?.leisureMinDistance300m, unit: '个' },
    // { label: '周边小区数量', data: detail?.peripheralAnalysis?.houseNumber1000m, unit: '个' },
  ];

  useEffect(() => {
    id && getDetail();
  }, [id]);

  return <div className={styles.container}>
    <div className={cs(styles.goBack, 'fs-12')} onClick={() => backList()}>返回列表</div>
    <div
      style={{
        height: `${targetHeight}px`,
        overflowY: 'auto',
        ...style
      }}>
      {type === businessType.synchronizationBusiness && !detail?.branchCompanyReason ? <div className={styles.detailInfo} >
        <div className='fs-16 c-222 bold'>{detail?.areaName || '-'}</div>

        <div className={cs(styles.industryWrapper, 'mt-16')}>
          <div className={styles.titleRow}>
            <div className={cs(styles.titleName, 'fs-12')}>奶茶行业
            </div>
            <span className='ml-12 fs-12 c-999'>{detail?.districtName || ''}{detail?.firstLevelCategory || ''}排名第 <span className='c-006 bold'>{`${detail?.mainBrandsRank || '-'}`}</span> 名</span>
          </div>
          <div className={styles.detailRow}>
            <div className={styles.detailItem}>
              <div className={styles.itemValue}>{Math.floor(detail?.mainBrandsScore) || '-'}</div>
              <div className={styles.itemName}>奶茶行业评分</div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.itemValue}>{detail?.mainBrandsProba ? Math.floor(detail?.mainBrandsProba * 100) + '%' : '-'}</div>
              <div className={styles.itemName}>奶茶行业适合度</div>
            </div>
          </div>
        </div>

        <div className={cs(styles.industryWrapper, 'mt-16')}>
          <div className={styles.titleRow}>
            <div className={cs(styles.titleName, 'fs-12')}>益禾堂
            </div>
            <span className='ml-12 fs-12 c-999'>{detail?.districtName || ''}{detail?.firstLevelCategory || ''}排名第 <span className='c-006 bold'>{`${detail?.yhtRank || '-'}`}</span> 名</span>
          </div>
          <div className={styles.detailRow}>
            <div className={styles.detailItem}>
              <div className={styles.itemValue}>{Math.floor(detail?.totalScore) || '-'}</div>
              <div className={styles.itemName}>益禾堂评分</div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.itemValue}>{detail?.proba || '-'}</div>
              <div className={styles.itemName}>益禾堂适合度</div>
            </div>
          </div>
        </div>

        {/* 基本信息小方块 */}
        <Row gutter={12}>
          <Col span={12}>
            <div className={cs(styles.typeCard, 'mt-12')}>
              <IconFont iconHref='iconic_shangye' className='fs-18'/>
              <div className='c-999 fs-12 mt-4 mb-4'>商圈类型</div>
              <div className='c-222 fs-14 bold'>{detail?.firstLevelCategory}</div>
            </div>
          </Col>
          <Col span={12}>
            <div className={cs(styles.typeCard, 'mt-12')}>
              <IconFont iconHref='iconic_yetaileixing' className='fs-18'/>
              <div className='c-999 fs-12 mt-4 mb-4'>业态类型</div>
              <div className='c-222 fs-14 bold'>{detail?.secondLevelCategory}</div>
            </div>
          </Col>
          {
            basicData.map((item, index) => {
              return <Col span={12} key={index}>
                <div className={cs(styles.itemBlock, 'mt-12')}>
                  <div className={styles.itemName}>{item.label}</div>
                  <div className='mt-10'>
                    <span className={styles.itemValue}>{item.data || '-'}</span>
                    &nbsp;
                    <span className='fs-12'>{item.unit}</span>
                  </div>
                </div>
              </Col>;
            })
          }
        </Row>

        {/* 业态饼图 */}
        {detail?.peripheralProperties?.length
          ? <V2Title divider type='H3' className='mt-16'>
            <div className='bold c-222'>业态概览</div>
          </V2Title>
          : <></>}
        {/* 注意piecharts宽度，防止宽度过大，引起x方向可滚动 */}
        <PieCharts config={{
          data: detail?.peripheralProperties || []
        }} width={284} height={180}/>
        <Row gutter={19}>
          {
            detail?.peripheralProperties?.map((item, index) => <Col span={12} className={styles.tooltip} key={index}>
              <div>
                <span
                  className={styles.colorBlock}
                  style={{
                    backgroundColor: color[index]
                  }}></span>
                <span className='inline-block mr-4'>{item.name}</span>
                <span className={styles.number}>
                  {+item.value >= 10000
                    ? `${(item.value / 10000)?.toFixed(1)}w` : item.value}
                </span>
              </div>
              <span className='inline-block pr-4'>{item.rate}</span>
            </Col>
            )
          }
        </Row>

        {/* 宏观分析，当macroscopicAnalysisData有数据的时候，展示标题 */}
        {macroscopicAnalysisData.some((item) => item.data)
          ? <V2Title divider type='H3' className='mt-16'>
            <div className='bold c-222'>城市数据</div>
          </V2Title> : <></>}
        <Row gutter={12}>
          {
            macroscopicAnalysisData.map((item, index) => {
              return item.data ? <Col span={12} key={index}>
                <div className={cs(styles.itemBlock, 'mt-12')}>
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
        </Row>

        {/* 周边分析，当peripheralAnalysisData有数据的时候，展示标题 */}
        {peripheralAnalysisData.some((item) => item.data)
          ? <V2Title divider type='H3' className='mt-16'>
            <div className='bold c-222'>其他数据</div>
          </V2Title> : <></>}
        <Row gutter={12}>
          {
            peripheralAnalysisData.map((item, index) => {
              return item.data ? <Col span={12} key={index}>
                <div className={cs(styles.itemBlock, 'mt-12')}>
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
        </Row>

      </div> : <div className={styles.addBusinessDetail}>
        <div className='fs-16 c-222 bold'>{detail?.areaName || '-'}</div>
        <div className={styles.cardBox}>
          <div className={cs(styles.card, 'mr-12')}>
            <IconFont iconHref='iconic_shangye' className='fs-18'/>
            <div className='c-999 fs-12 mt-4 mb-4'>商圈类型</div>
            <div>{detail?.firstLevelCategory}</div>
          </div>
          <div className={styles.card}>
            <IconFont iconHref='iconic_yetaileixing' className='fs-18'/>
            <div className='c-999 fs-12 mt-4 mb-4'>业态类型</div>
            <div>{detail?.secondLevelCategory}</div>
          </div>
        </div>
        <div className={styles.otherInfo}>
          <V2Title divider type='H3' className='mt-16'>
            <div className='bold c-222'>其他信息</div>
          </V2Title>
          <V2DetailGroup direction='horizontal' labelLength={4}>
            <V2DetailItem label='新增时间' value={detail?.createdAt || '-'}/>
            <V2DetailItem label='操作人员' value={detail?.userName || '系统'}/>
            <V2DetailItem label='规划城市' value={detail?.address || '-'}/>
            <V2DetailItem label='新增原因' value={detail?.branchCompanyReason || '-'}/>
          </V2DetailGroup>
        </div>
      </div>}
    </div>
  </div>;
};
export default NetworkPlanLeftDetail;

