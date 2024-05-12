import {
  FC,
  useMemo
} from 'react';
import { Progress } from 'antd';
import { isArray } from '@lhb/func';
import { IndustryId } from '../../../ts-config';
import cs from 'classnames';
import styles from '../../../entry.module.less';

const MarketShares: FC<any> = ({
  info,
  targetIndustryFun
}) => {
  const targetIndustry = useMemo(() => {
    const { id } = info;
    return targetIndustryFun(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info.id]);

  // 总规模
  const totalVal = useMemo(() => {
    if (targetIndustry && isArray(targetIndustry.marketShares)) {
      return targetIndustry.marketShares.reduce((pre, cur) => pre + cur.data, 0);
    }
    return 0;
  }, [targetIndustry]);

  const titleName = useMemo(() => {
    const { id } = info;
    if (id === IndustryId.Catering) {
      return '近十年';
    }
    return '上年';
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info.id]);

  return (
    <>
      <div className='bold fs-16 mt-18'>
        {titleName}市场规模
      </div>
      {
        isArray(targetIndustry?.marketShares) && (<>
          {
            targetIndustry.marketShares.map((item: any, index: number) => (
              <div className={styles.progressRow} key={index}>
                <div className={cs(styles.labelCon, styles.small)}>
                  { item.name }
                </div>
                <div className={styles.valCon}>
                  <Progress
                    percent={item.data / totalVal * 100}
                    strokeColor='#00B3D8'
                    trailColor='#eee'
                    format={() => `${item.data}${item.unit || '亿'}`}
                    style={{
                      width: '180px'
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

export default MarketShares;
