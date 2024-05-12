import React from 'react';
import { PageLayout } from '../Layout';
import { Col, Row } from 'antd';
import V2Title from '@/common/components/Feedback/V2Title';
import styles from './index.module.less';
import StockBusiness from './StockBusiness';
import TermBusiness from './TermBusiness';
import OldStoreDetail from './OldStoreDetail';
import { isNotEmptyAny } from '@lhb/func';
// import { BusinessReportContext } from '../../entry';

// 经营门店
interface OperateAStoreProps {
  operateAStoreDetail: any;
  targetChildClass?: string;
  homeData:any,
  computeModuleMap?:any;
  moduleMapCount?:any;
  isChancepoint?: boolean;
}
const OperateAStore: React.FC<OperateAStoreProps> = ({
  operateAStoreDetail,
  targetChildClass,
  homeData,
  isChancepoint,
  // computeModuleMap,
  // moduleMapCount
}) => {
  // const { operateAStoreDetail } = useContext(BusinessReportContext);
  const { operateAStoreChartData, oldStoreDetail } = operateAStoreDetail;
  // useEffect(() => {
  //   if (isNotEmptyAny(operateAStoreDetail)) {
  //     computeModuleMap('operateStore', true);
  //   }
  // }, [operateAStoreDetail]);
  return <>
    {operateAStoreChartData.isShowPage && <BusinessChart {...operateAStoreChartData} childClass={targetChildClass} homeData={homeData}
      isChancepoint={isChancepoint}
    // moduleMapCount={moduleMapCount}
    />
    }
    {oldStoreDetail.isShowPage && <BusinessTable data={oldStoreDetail.oldStoreDetail} childClass={targetChildClass} homeData={homeData}
      isChancepoint={isChancepoint}
    // moduleMapCount={moduleMapCount}
    />
    }

  </>;
};

export default OperateAStore;


// 经营门店图表页
interface BusinessChartProps{
  [k:string]:any
}

const BusinessChart:React.FC<BusinessChartProps> = (props) => {
  const { description, stockBusinessList, foodTermBusinessList, isBusiness,
    childClass,
    homeData,
    isChancepoint,
    // moduleMapCount
  } = props;
  return <PageLayout
    logo={homeData?.tenantLogo}
    title={isChancepoint ? '商圈·经营门店' : '经营门店'}
    // moduleCount={Number(moduleMapCount?.operateStore)}
    // totalPage={32}
    // currentPage={Number('04')}
    childClass={childClass}
  >
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <V2Title divider type='H2' text='经营点评' style={{ marginBottom: 8 }}/>
        <div className={styles.desc}>{description}</div>
      </Col>
      {isNotEmptyAny(stockBusinessList) && <Col span={24}>
        <StockBusiness detail={stockBusinessList}/>
      </Col>}
      {isNotEmptyAny(foodTermBusinessList) && <Col span={24}>
        <TermBusiness detail={foodTermBusinessList} isBusiness={isBusiness}/>
      </Col>}
    </Row>
  </PageLayout>;
};


// 经营门店行业信息明细
interface BusinessTableProps{
  [k:string]:any
}

const BusinessTable:React.FC<BusinessTableProps> = (props) => {
  const { childClass, homeData, data,
    isChancepoint,
  } = props;
  return <PageLayout
    logo={homeData?.tenantLogo}
    title={isChancepoint ? '商圈·经营门店' : '经营门店'}
    // moduleCount={Number(moduleMapCount?.operateStore)}
    // totalPage={32}
    // currentPage={Number('04')}
    childClass={childClass}
  >
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <V2Title divider type='H2' text={`${data?.categoryName}老店明细`}/>
        {/* <div className={styles.desc}>{data?.categoryName}</div> */}
      </Col>
      <Col span={24}>
        <OldStoreDetail dataSource={data?.pois || []}/>
      </Col>
    </Row>
  </PageLayout>;
};
