import DetailInfo from '@/common/components/business/DetailInfo';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import { Row } from 'antd';
import { FC } from 'react';
import { isArray } from '@lhb/func';

interface IProps {
  result: any;
}

// const ShowBrandItem: FC<any> = ({
//   brands,
//   brandsName
// }) => {
//   const isHistory = useMemo(() => {
//     if (isArray(brands) && brands.length) {
//       const uniqueBrands = Array.from(new Set(brands));
//       // 历史数据填的是个数，接口返回的是由-1组成的填写个数的的数组
//       return uniqueBrands.length === 1 && uniqueBrands[0] === -1;
//     }
//     return false;
//   }, [brands]);
//   const brandsStr = useMemo(() => {
//     if (isArray(brandsName) && brandsName.length) {
//       return brandsName.join('、');
//     }
//     return '';
//   }, [brandsName]);
//   return (
//     <>
//       {
//         isArray(brands) && brands.length
//           ? (<>
//             {
//               isHistory
//                 ? (<>
//                   {brands.length}个
//                 </>)
//                 : (<>
//                   {/* <Tooltip title={brandsStr || `${brands.length}个`}> */}
//                   { brands.length }个{brandsStr ? `（${brandsStr}）` : ''}
//                   {/* </Tooltip> */}
//                 </>)
//             }
//           </>)
//           : <>-</>
//       }
//     </>
//   );
// };

const FlowMatch: FC<IProps> = ({ result }) => {
  function brandItemStr(brands: Array<any>, brandsName: Array<string>) {
    if (isArray(brands) && brands.length) {
      const uniqueBrands = Array.from(new Set(brands));
      const isHistory = uniqueBrands.length === 1 && uniqueBrands[0] === -1;
      const brandsStr = isArray(brandsName) && brandsName.length ? brandsName.join('、') : '';
      if (isHistory) return `${brands.length}个`;
      return `${brands.length}个${brandsStr ? `（${brandsStr}）` : ''}`;

    }
    return '';
  }
  return (
    <>
      <TitleTips name='商场品牌落位情况' showTips={false} />
      <Row gutter={16}>
        {
          result?.isOpenMall === 1 && (
            <>
              <DetailInfo title='同商场有无亚瑟士' value={result.flowMatchAsics.hasAsicsInMallName} />
              <DetailInfo
                title='运动品牌'
                value={brandItemStr(result.flowMatchAsics?.sportBrand, result.flowMatchAsics?.sportBrandName)}/>
              <DetailInfo
                title='儿童运动品牌'
                value={brandItemStr(result.flowMatchAsics?.kidSportBrand, result.flowMatchAsics?.kidSportBrandName)}/>
              <DetailInfo title='大型游乐设施(个)' value={result.flowMatchAsics.largeAmusementFacility} />
            </>
          )
        }
        {
          result?.isOpenMall !== 1 && (
            <>
              <DetailInfo title='同城有无亚瑟士' value={result.flowMatchAsics.hasAsicsInCityName} />
              <DetailInfo
                title='国际一线奢侈品牌'
                value={brandItemStr(result.flowMatchAsics?.interFirLuxuryBrand, result.flowMatchAsics?.interFirLuxuryBrandName)}/>
              <DetailInfo
                title='国际二线奢侈品牌'
                value={brandItemStr(result.flowMatchAsics?.interSecLuxuryBrand, result.flowMatchAsics?.interSecLuxuryBrandName)}/>
              <DetailInfo
                title='优质零售品牌'
                value={brandItemStr(result.flowMatchAsics?.excellentRetailBrand, result.flowMatchAsics?.excellentRetailBrandName)}/>
              <DetailInfo
                title='优质零售集合店'
                value={brandItemStr(result.flowMatchAsics?.excellentRetailStore, result.flowMatchAsics?.excellentRetailStoreName)}/>
              <DetailInfo
                title='优质儿童零售品牌'
                value={brandItemStr(result.flowMatchAsics?.excellentKidRetailBrand, result.flowMatchAsics?.excellentKidRetailBrandName)}/>
              <DetailInfo
                title='优质儿童游乐品牌'
                value={brandItemStr(result.flowMatchAsics?.excellentKidAmusementBrand, result.flowMatchAsics?.excellentKidAmusementBrandName)}/>
            </>
          )
        }
        <DetailInfo
          title='竞品品牌数量'
          value={brandItemStr(result.flowMatchAsics.signedCompeteBrand, result.flowMatchAsics.signedCompeteBrandName)}/>
        <DetailInfo title='品牌落位信息备注' value={result.flowMatchAsics.brandPlacementRemark} />
        {
          result?.isOpenMall !== 1 && <DetailInfo title='选择类比商场' value={result.flowMatchAsics.analogMallName} />
        }
        <DetailInfo title='客流匹配指数(分)' value={result.flowMatchAsics.flowMatchIndex} />
      </Row>
    </>
  );
};

export default FlowMatch;
