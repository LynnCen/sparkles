import { FC } from 'react';
import styles from '../entry.module.less';
import cs from 'classnames';
import TopTitle from './Base/TopTitle';
import BottomLogo from './Base/BottomLogo';
import V2Title from '@/common/components/Feedback/V2Title';
const MainModule4: FC<any> = ({
  number,
  title,
  res = []
}) => {
  const leftComps = (list) => {
    const res: any[] = [];
    list.forEach((item, index) => {
      res.push(<tr key={index}>
        <td width={256}>{item.name}</td>
        <td>{item.value}</td>
      </tr>);
    });
    return res;
  };
  return (
    <div className={cs(styles.mainModule, styles.mainModule4)}>
      <TopTitle number={number}>四、数据审核表</TopTitle>
      <div className={styles.mainModuleWrapper}>
        <V2Title divider type='H3' text={title} style={{ marginBottom: '10px' }}/>
        <div className={styles.module4Flex}>
          <div className={styles.conLeft}>
            <table>
              <tbody>
                <tr>
                  {
                    title === '商务信息' ? <td colSpan={2}>{title}</td> : <>
                      <td>投资信息</td>
                      <td>费用（元）</td>
                    </>
                  }
                </tr>
                {leftComps(res?.slice(0, 20))}
              </tbody>
            </table>
          </div>
          {
            res?.length > 26 && <div className={styles.conRight}>
              <table>
                <tbody>
                  <tr>
                    {
                      title === '商务信息' ? <td colSpan={2}>{title}</td> : <>
                        <td>投资信息</td>
                        <td>费用（元）</td>
                      </>
                    }
                  </tr>
                  {leftComps(res?.slice(20))}
                </tbody>
              </table>
            </div>
          }
        </div>
      </div>
      <BottomLogo/>
    </div>
  );
};

export default MainModule4;
