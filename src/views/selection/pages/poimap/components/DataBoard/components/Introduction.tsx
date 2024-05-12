import {
  FC,
  useMemo
  // useState
} from 'react';
import styles from '../../../entry.module.less';

const Introduction: FC<any> = ({
  info,
  targetIndustryFun
}) => {

  const targetIndustry = useMemo(() => {
    const { id } = info;
    return targetIndustryFun(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info.id]);

  return (
    <>
      <div className={styles.introductionBg}>
        <img src={targetIndustry.bgUrl} width='100%' height='100%' />
      </div>
      <div className='fs-14 c-656 mt-10'>
        {info.name}，{targetIndustry.introduce}
      </div>
    </>
  );
};

export default Introduction;
