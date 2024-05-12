import { FC, useMemo } from 'react';
import styles from '../entry.module.less';
import cs from 'classnames';
import TopTitle from './Base/TopTitle';
import BottomLogo from './Base/BottomLogo';
import V2Title from '@/common/components/Feedback/V2Title';
import Item from './Base/Item';
import { floorKeep, replaceEmpty } from '@lhb/func';
import { imgUrlSuffix } from '../ts-config';

const MainModule3: FC<any> = ({
  number,
  index,
  res = {},
}) => {
  const newExplanation = useMemo(() => {
    if (!index) {
      return res.explanation?.slice(0, 5);
    } else {
      const coefficients = floorKeep(index - 1, 11, 3);
      const start = floorKeep(coefficients, 5, 2);
      const end = floorKeep(start, 11, 2);
      return res.explanation?.slice(start, end);
    }
  }, [res, index]);
  return (
    <div className={cs(styles.mainModule, styles.mainModule3)}>
      <TopTitle number={number}>三、选址23不要</TopTitle>
      <div className={styles.mainModuleWrapper}>
        {
          !index && <div className={styles.conLeft}>
            <table>
              <tbody>
                <tr>
                  <td className={styles.firstTd}>分类</td>
                  <td className={styles.secondTd}>23不要</td>
                  <td>是</td>
                  <td>否</td>
                </tr>
                {/* 商圈三不要 */}
                {
                  res.biz3?.map((item, index) => {
                    return <tr key={`biz3-${index}`}>
                      {
                        !index && <td className={styles.firstTd} rowSpan={3}>商圈<br/>三不要</td>
                      }
                      <td className={styles.secondTd}>{index + 1}.{replaceEmpty(item.name)}</td>
                      <td className={styles.yesTd}>{item.value === '是' ? '✔️' : undefined}</td>
                      <td className={styles.noTd}>{item.value === '否' ? '✔️' : undefined}</td>
                    </tr>;
                  })
                }
                {/* 点位十二不要 */}
                {
                  res.poi12?.map((item, index) => {
                    return <tr key={`poi12-${index}`}>
                      {
                        !index && <td className={styles.firstTd} rowSpan={12}>点位<br/>十二不要</td>
                      }
                      <td className={styles.secondTd}>{index + 1}.{replaceEmpty(item.name)}</td>
                      <td className={styles.yesTd}>{item.value === '是' ? '✔️' : undefined}</td>
                      <td className={styles.noTd}>{item.value === '否' ? '✔️' : undefined}</td>
                    </tr>;
                  })
                }
                {/* 商业环境六不要 */}
                {
                  res.env6?.map((item, index) => {
                    return <tr key={`env6-${index}`}>
                      {
                        !index && <td className={styles.firstTd} rowSpan={6}>商业环境<br/>六不要</td>
                      }
                      <td className={styles.secondTd}>{index + 1}.{replaceEmpty(item.name)}</td>
                      <td className={styles.yesTd}>{item.value === '是' ? '✔️' : undefined}</td>
                      <td className={styles.noTd}>{item.value === '否' ? '✔️' : undefined}</td>
                    </tr>;
                  })
                }
                {/* 商务条件3不要 */}
                {
                  res.cond3?.map((item, index) => {
                    return <tr key={`cond3-${index}`}>
                      {
                        !index && <td className={styles.firstTd} rowSpan={3}>商务条件<br/>三不要</td>
                      }
                      <td className={styles.secondTd}>{index + 1}.{replaceEmpty(item.name)}</td>
                      <td className={styles.yesTd}>{item.value === '是' ? '✔️' : undefined}</td>
                      <td className={styles.noTd}>{item.value === '否' ? '✔️' : undefined}</td>
                    </tr>;
                  })
                }
              </tbody>
            </table>
          </div>
        }
        <div className={styles.conRight}>
          {
            !index && <>
              <V2Title divider type='H3' text='特批支持文件' style={{ marginBottom: '10px' }}/>
              <div>
                {
                  res.files?.slice(0, 2).map((item, index) => {
                    return <img key={index} src={`${item}${imgUrlSuffix.size220}`} alt=''/>;
                  })
                }
              </div>
            </>
          }
          <V2Title divider type='H3' text='特殊说明' style={{ marginBottom: '10px', marginTop: '24px' }}/>
          {
            newExplanation?.map((item, index) => {
              return <Item key={index} className='mb-16' label={item.label}>{item.value}</Item>;
            })
          }
        </div>
      </div>
      <BottomLogo/>
    </div>
  );
};

export default MainModule3;
