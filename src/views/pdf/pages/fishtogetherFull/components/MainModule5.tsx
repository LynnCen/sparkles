import { FC, useMemo } from 'react';
import styles from '../entry.module.less';
import cs from 'classnames';
import TopTitle from './Base/TopTitle';
import BottomLogo from './Base/BottomLogo';
import V2Title from '@/common/components/Feedback/V2Title';
import { floorKeep, replaceEmpty } from '@lhb/func';

const MainModule5: FC<any> = ({
  res = {},
  number,
  index
}) => {
  const newRes = useMemo(() => {
    const start = floorKeep(index, 2, 3);
    const end = floorKeep(start, 2, 2);
    return res?.module5?.slice(start, end);
  }, [res, index]);
  return (
    <div className={cs(styles.mainModule, styles.mainModule5)}>
      <TopTitle number={number}>五、营业额预估</TopTitle>
      <div className={styles.mainModuleWrapper}>
        {
          !index && <div className={styles.mainModuleTotal}>
            <V2Title type='H3' text={`该店铺适应的预估方法为：${res.methods?.methods?.length ? `${res.methods.methods.join('、')}${res.methods.methods.length}种` : '-'}`} style={{ marginBottom: '10px' }}/>
            <div className={styles.moduleTotal}>
              <div className={styles.moduleTotalItem}>
                <div className={styles.totalItemTop}>{replaceEmpty(res.dailySales)}元</div>
                <div className={styles.totalItemBottom}>预估日销</div>
              </div>
              <div className={styles.moduleTotalItem}>
                <div className={styles.totalItemTop}>{replaceEmpty(res.dailyTakeoutSales)}元</div>
                <div className={styles.totalItemBottom}>预估日外卖销量</div>
              </div>
            </div>
          </div>
        }
        {
          newRes?.map((item, index) => {
            return <div key={index}>
              <V2Title divider type='H3' text={item.name} style={{ marginBottom: '10px', marginTop: '16px' }}/>
              <table>
                <tbody>
                  {
                    item.list.map((item2, index2) => {
                      return <tr key={`${index}-${index2}`}>
                        <td width={302}>{item2.name}</td>
                        <td>{item2.value1}</td>
                        <td>{item2.value2}</td>
                        {/* 产品明确直接按照第4个数据是 竞对法（7080法）去做判断 */}
                        {item2.name === res.methods.allMethods[3] && <td>{item2.value3}</td>}
                      </tr>;
                    })
                  }
                </tbody>
              </table>
            </div>;
          })
        }
      </div>
      <BottomLogo/>
    </div>
  );
};

export default MainModule5;
