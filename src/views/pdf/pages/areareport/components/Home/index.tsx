/**
 * @Description 首页
 */
import { FC } from 'react';
import { dateFns } from '@lhb/func';
import { ChildreClass } from '../../ts-config';
import cs from 'classnames';
import styles from './index.module.less';
import Head from './Head';
import Map from './Map';

const Home: FC<any> = ({
  detail,
  homeData,
  targetChildClass,
}) => {
  return (
    <div className={cs(styles.homeCon, ChildreClass, targetChildClass || '')}>
      {/* 头部 */}
      <Head
        detail={detail}
        dataInfo={homeData}
      />
      {/* 地图 */}
      <Map dataInfo={homeData}/>
      <div className={styles.illustrationCon}>
        <img
          src='https://staticres.linhuiba.com/project-custom/locationpc/chancepointReport/chancepoint_report_illustration@2x.png'
          width='100%'
          height='100%'
        />
      </div>
      <div className='c-666 fs-14 ml-40 mt-24'>
        报告时间：{dateFns.currentTime('-', true)}
      </div>
      {/* 底部 */}
      <div className={styles.pagingCon}></div>
    </div>
  );
};

export default Home;
