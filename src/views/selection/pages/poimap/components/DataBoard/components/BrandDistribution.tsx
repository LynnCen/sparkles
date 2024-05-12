import {
  FC,
  // useMemo,
  useEffect,
  useState,
} from 'react';
import { poiBoardBrand } from '@/common/api/selection';
import { isArray } from '@lhb/func';
import RoundedCornerPie from './RoundedCornerPie';

const BrandDistribution: FC<any> = ({
  info
}) => {
  const [brands, setBrands] = useState<Array<any>>([]);
  // const targetIndustry = useMemo(() => {
  //   const { id } = info;
  //   return targetIndustryFun(id);
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [info.id]);
  // console.log(targetIndustry);

  useEffect(() => {
    const { id } = info;
    id && getTargetBrands();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info.id]);
  // 请求接口
  const getTargetBrands = () => {
    poiBoardBrand(info.id).then((data) => {
      isArray(data) && setBrands(data);
    });
  };

  return (
    <>
      <div className='bold fs-16 mt-18'>
        {info?.name}品牌分布
      </div>
      <RoundedCornerPie
        config={{
          data: brands,
          isDynamicData: true
        }}
        width='100%'
        height='120px'/>
    </>
  );
};

export default BrandDistribution;
