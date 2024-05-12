/**
 * @Description 评分区间
 */
import { FC, useState } from 'react';
import V2FormRangeInput from '@/common/components/Form/V2FormRangeInput/V2FormRangeInput';
import styles from './index.module.less';
import V2Form from '@/common/components/Form/V2Form';
import { debounce } from '@lhb/func';
const ScoreSection:FC<any> = ({
  setScore,
  form
}) => {
  const [isHovering, setIsHovering] = useState<boolean>(false);

  const clear = () => {
    form.resetFields();
    setScore({
      mainBrandsScoreMin: undefined,
      mainBrandsScoreMax: undefined
    });
  };
  const onChange = debounce(() => {
    setScore({
      mainBrandsScoreMin: form.getFieldsValue()?.mainBrandsScoreMin,
      mainBrandsScoreMax: form.getFieldsValue()?.mainBrandsScoreMax
    });
  }, 300);
  return <div
    className={styles.scoreSection}
    onMouseEnter={() => setIsHovering(true)}
    onMouseLeave={() => setIsHovering(false)}
  >
    {/* 卡片顶部信息 */}
    <div>
      <span className='bold'>评分区间</span>
      {isHovering ? <span className={styles.clear} onClick={clear}>清除</span> : <></>}
    </div>
    <div className={styles.form}>
      <V2Form validateTrigger={['onChange', 'onBlur']} form={form}>
        <V2FormRangeInput name={['mainBrandsScoreMin', 'mainBrandsScoreMax']} config={{
          onChange
        }}/>
      </V2Form>
    </div>
    <div className={styles.line}></div>
  </div>;
};
export default ScoreSection;
