import {
  FC,
  useMemo
} from 'react';
import { Progress } from 'antd';
import { isArray } from '@lhb/func';
import styles from '../../../entry.module.less';

const Revenue: FC<any> = ({
  info,
  targetIndustryFun
}) => {

  const targetIndustry = useMemo(() => {
    const { id } = info;
    return targetIndustryFun(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info.id]);

  // 总营收
  const totalRevenue = useMemo(() => {
    if (targetIndustry && isArray(targetIndustry.revenue)) {
      return targetIndustry.revenue.reduce((pre, cur) => pre + cur.data, 0);
    }
    return 0;
  }, [targetIndustry]);

  return (
    <>
      <div className='bold fs-16 mt-18'>
        {info.name}营收TOP10
      </div>
      {
        isArray(targetIndustry?.revenue) && (<>
          {
            targetIndustry.revenue.map((item: any, index: number) => (
              <div className={styles.progressRow} key={index}>
                <div className={styles.labelCon} title={item.name}>
                  { item.name }
                </div>
                <div className={styles.valCon}>
                  <Progress
                    percent={item.data / totalRevenue * 100}
                    strokeColor='#FCA119'
                    trailColor='#eee'
                    format={() => `${item.data ? `${item.data}亿` : '更新中'}`}
                    style={{
                      width: '155px'
                    }}/>
                </div>
              </div>
            ))
          }
        </>)
      }
    </>
  );
};

export default Revenue;
