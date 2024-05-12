import React from 'react';
import { PageLayout } from '../Layout';
import styles from './index.module.less';
import V2Title from '@/common/components/Feedback/V2Title';
import { Row, Col } from 'antd';
import SexRatio from './SexRatio';
import AgeDistribution from './AgeDistribution';
import EducationPie from './EducationPie';
import ConsumeLevelRatio from './ConsumeLevelRatio';
import FoodConsumeLevelRatio from './FoodConsumeLevelRatio';
import HousePriceRatio from './HousePriceRatio';
import { isNotEmptyAny } from '@lhb/func';
// import { BusinessReportContext } from '../../entry';

// 人口客群
interface DemographicCustomerBaseProps {
  demographicDetail: any;
  targetChildClass?: string;
  homeData:any;
  computeModuleMap?:any;
  moduleMapCount?:any
  isChancepoint?: boolean;
}
const DemographicCustomerBase: React.FC<DemographicCustomerBaseProps> = ({
  demographicDetail,
  targetChildClass,
  homeData,
  isChancepoint,
  // computeModuleMap,
  // moduleMapCount
}) => {
  // const { demographicDetail } = useContext(BusinessReportContext);
  const { userGroup, consumer } = demographicDetail;
  // useEffect(() => {
  //   if (isNotEmptyAny(demographicDetail)) {
  //     computeModuleMap('populationGroup', true);
  //   }
  // }, [demographicDetail]);
  return <>
    {userGroup.isShowPage && <UserGroup {...userGroup} childClass={targetChildClass} homeData={homeData}
      isChancepoint={isChancepoint}
    //  moduleMapCount={moduleMapCount}
    />}
    {consumer.isShowPage && <Consumer {...consumer} childClass={targetChildClass} homeData={homeData}
      isChancepoint={isChancepoint}
    // moduleMapCount={moduleMapCount}
    />}
  </>;
};
export default DemographicCustomerBase;



// 客群
interface UserGroupReviewsProps{
  [k:string]:any
}

const UserGroup:React.FC<UserGroupReviewsProps> = (props) => {
  const { description, sexRate, ageRate, educational, childClass, homeData,
    isChancepoint,
  } = props;
  return <PageLayout
    title={isChancepoint ? '商圈·人口客群' : '人口客群' }
    // moduleCount={Number(moduleMapCount?.populationGroup)}
    // totalPage={32}
    // currentPage={Number('04')}
    childClass={childClass}
    logo={homeData?.tenantLogo}

  >
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <V2Title divider type='H2' text='客群点评'/>
        <div className={styles.desc}>{description}</div>
      </Col>
      {isNotEmptyAny(sexRate) && <Col span={24}>
        <SexRatio sexInfo={sexRate}/>
      </Col>}
      {
        isNotEmptyAny(ageRate) && <Col span={24}>
          <AgeDistribution ageDetail={ageRate}/>
        </Col>
      }
      {
        isNotEmptyAny(educational) && <Col span={24}>
          <EducationPie educationdetail={educational}/>
        </Col>
      }
    </Row>
  </PageLayout>;
};


// 消费
interface ConsumerProps{
  [k:string]:any
}

const Consumer:React.FC<ConsumerProps> = (props) => {
  const { description, consumeLevel, foodConsumeLevel, housePrice, childClass, homeData,
    isChancepoint,
  } = props;
  return <PageLayout
    logo={homeData?.tenantLogo}
    title={isChancepoint ? '商圈·人口客群' : '人口客群'}
    // moduleCount={Number(moduleMapCount?.populationGroup)}
    // totalPage={32}
    // currentPage={Number('04')}
    childClass={childClass}
  >
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <V2Title divider type='H2' text='消费点评'/>
        <div className={styles.desc}>{description}</div>
      </Col>
      {
        isNotEmptyAny(consumeLevel) && <Col span={24}>
          <ConsumeLevelRatio detail={consumeLevel} />
        </Col>
      }
      {
        isNotEmptyAny(foodConsumeLevel) && <Col span={24}>
          <FoodConsumeLevelRatio detail={foodConsumeLevel}/>
        </Col>
      }
      {
        isNotEmptyAny(housePrice) && <Col span={24}>
          <HousePriceRatio detail={housePrice}/>
        </Col>
      }
    </Row>
  </PageLayout>;

};
