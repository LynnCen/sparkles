/**
 * @Description 首页
 */
import { FC } from 'react';
import { ChancePdfPageClass } from '../../ts-config';
import cs from 'classnames';
import styles from './home.module.less';
import HomeHead from './HomeHead';
import HomeMap from './HomeMap';

const Home: FC<any> = ({
  detail,
  dataInfo,
}) => {

  return (
    <div className={cs(styles.pageContainer, ChancePdfPageClass)}>
      {/* 头部 */}
      <HomeHead
        detail={detail}
        dataInfo={dataInfo}
      />
      {/* 地图 */}
      <HomeMap dataInfo={dataInfo}/>
      <div className={styles.illustrationCon}>
        <img src='https://staticres.linhuiba.com/project-custom/locationpc/chancepointReport/chancepoint_report_illustration@2x.png' width='100%' height='100%' />
      </div>
      <div className='c-666 fs-14 ml-40 mt-24'>
        报告时间：{dataInfo?.createdAt}
      </div>
      {/* 底部 */}
      <div className={styles.pagingCon}></div>
    </div>
  );
};

export default Home;
