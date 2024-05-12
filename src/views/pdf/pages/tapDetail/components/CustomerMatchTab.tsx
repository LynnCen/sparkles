// import DetailInfo from './DetailInfo';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';
// import { Row } from 'antd';
import { FC, useMemo } from 'react';
import { isArray } from '@lhb/func';
import styles from './index.module.less';
import TabTitle from './TabTitle';

const ShowBrandItem: FC<any> = ({
  brands,
  brandsName
}) => {
  const isHistory = useMemo(() => {
    if (isArray(brands) && brands.length) {
      const uniqueBrands = Array.from(new Set(brands));
      // 历史数据填的是个数，接口返回的是由-1组成的填写个数的的数组
      return uniqueBrands.length === 1 && uniqueBrands[0] === -1;
    }
    return false;
  }, [brands]);
  const brandsStr = useMemo(() => {
    if (isArray(brandsName) && brandsName.length) {
      return brandsName.join('、');
    }
    return '';
  }, [brandsName]);
  return (
    <span className='c-333'>
      {
        isArray(brands) && brands.length
          ? (<>
            {
              isHistory
                ? (<>
                  {brands.length}个
                </>)
                : (<>
                  { brands.length }个
                  { brandsStr ? `（${brandsStr}）` : '' }
                </>)
            }
          </>)
          : <>-</>
      }
    </span>
  );
};

const CustomerMatchTab:FC<any> = ({ data, isOpen }) => {

  return (
    <div className={styles.tabInfoContent}>
      <TabTitle name='客群匹配度' />
      <TitleTips className={styles.secondTitle} name='商场品牌落位情况' showTips={false} />
      <div className={styles.flexSectionCon}>
        {
          isOpen ? (<>
            <div className='mr-40 mb-8'>
              <span className='color-help'>同商场有无亚瑟士：</span><span>{data.hasAsicsInMallName}</span>
            </div>
            <div className='mr-40 mb-8'>
              <span className='color-help'>运动品牌：</span><ShowBrandItem brands={data.sportBrand} brandsName={data.sportBrandName}/>
            </div>
            <div className='mr-40 mb-8'>
              <span className='color-help'>儿童运动品牌：</span><ShowBrandItem brands={data.kidSportBrand} brandsName={data.kidSportBrandName}/>
            </div>
            <div className='mr-40 mb-8'>
              <span className='color-help'>大型游乐设施：</span>{data.largeAmusementFacility}个
            </div>

          </>) : (<>
            <div className='mr-40 mb-8'>
              <span className='color-help'>同城有无亚瑟士：</span>{data.hasAsicsInCityName}
            </div>
            <div className='mr-40 mb-8'>
              <span className='color-help'>国际一线奢侈品牌：</span><ShowBrandItem brands={data.interFirLuxuryBrand} brandsName={data.interFirLuxuryBrandName}/>
            </div>
            <div className='mr-40 mb-8'>
              <span className='color-help'>国际二线奢侈品牌：</span><ShowBrandItem brands={data.interSecLuxuryBrand} brandsName={data.interSecLuxuryBrandName}/>
            </div>
            <div className='mr-40 mb-8'>
              <span className='color-help'>优质零售品牌：</span><ShowBrandItem brands={data.excellentRetailBrand} brandsName={data.excellentRetailBrandName}/>
            </div>
            <div className='mr-40 mb-8'>
              <span className='color-help'>优质零售集合店：</span><ShowBrandItem brands={data.excellentRetailStore} brandsName={data.excellentRetailStoreName}/>
            </div>
            <div className='mr-40 mb-8'>
              <span className='color-help'>优秀儿童零售品牌：</span><ShowBrandItem brands={data.excellentKidRetailBrand} brandsName={data.excellentKidRetailBrandName}/>
            </div>
            <div className='mr-40 mb-8'>
              <span className='color-help'>优秀儿童游乐品牌：</span><ShowBrandItem brands={data.excellentKidAmusementBrand} brandsName={data.excellentKidAmusementBrandName}/>
            </div>
            <div className='mr-40 mb-8'>
              <span className='color-help'>选择类比商场：</span>{data.analogMallName || '-'}
            </div>
          </>)
        }
        <div>
          <span className='color-help'>竞品品牌数量：</span><ShowBrandItem brands={data.signedCompeteBrand} brandsName={data.signedCompeteBrandName}/>
        </div>
        <div>
          <span className='color-help'>客流匹配指数(分)：</span>{data.flowMatchIndex}
        </div>
      </div>
      {/* <Row className={styles.infoContent} gutter={[16, 0]}>
        { isOpen && <DetailInfo title='同商场有无亚瑟士' value={data.hasAsicsInMallName} /> }
        { !isOpen && (
          <>
            <DetailInfo title='同城有无亚瑟士' value={data.hasAsicsInCityName} />
            <DetailInfo title='国际一线奢侈品牌(个)'>
              <ShowBrandItem brands={data.interFirLuxuryBrand} brandsName={data.interFirLuxuryBrandName}/>
            </DetailInfo>
            <DetailInfo title='国际二线奢侈品牌(个)' value={data.interSecLuxuryBrand} />
          </>
        ) }
        { isOpen && <DetailInfo title='运动品牌(个)' value={data.sportBrand} /> }
        { !isOpen && (
          <>
            <DetailInfo title='优质零售品牌(个)' value={data.excellentRetailBrand} />
            <DetailInfo title='优质零售集合店(个)' value={data.excellentRetailStore} />
          </>
        ) }
        { isOpen && <DetailInfo title='儿童运动品牌(个)' value={data.kidSportBrand} /> }
        { !isOpen && (
          <>
            <DetailInfo title='优秀儿童零售品牌(个)' value={data.excellentKidRetailBrand} />
            <DetailInfo title='优秀儿童游乐品牌(个)' value={data.excellentKidAmusementBrand} />
          </>
        ) }
        { isOpen && <DetailInfo title='大型游乐设施(家)' value={data.largeAmusementFacility} /> }
        <DetailInfo title='竞品品牌数量(个)' value={data.signedCompeteBrand} />
        <DetailInfo title='品牌落位信息备注' value={data.brandPlacementRemark} />
        {
          !isOpen && <DetailInfo title='选择类比商场' value={data.analogMallName} />
        }
        <DetailInfo title='客流匹配指数' value={data.flowMatchIndex} />
      </Row> */}
    </div>
  );
};

export default CustomerMatchTab;
