/**
 * @Description 首页头部
 */

import { FC } from 'react';
import { ClusterOutlined, UserOutlined } from '@ant-design/icons';
import cs from 'classnames';
import styles from './home.module.less';

const HomeHead: FC<any> = ({
  dataInfo,
  detail,
}) => {
  return (
    <div className={styles.headCon}>
      <div className={styles.logoCon}>
        {
          dataInfo?.standardChancePointReportLogo ? <>
            <div className={styles.targetLogo}>
              <img
                src={dataInfo?.standardChancePointReportLogo}
                width='100%'
                height='100%'
              />
            </div>
            <div className='c-ddd fs-18 ml-8 mr-8 mt-4'>X</div>
          </> : <></>
        }
        <div className={styles.selfLogo}>
          <img
            src='https://staticres.linhuiba.com/project-custom/locationpc/chancepointReport/chancepoint_report_logo_location@2x.png'
            width='100%'
            height='100%'
          />
        </div>
      </div>
      <div className={cs('c-333 fs-48 mt-50', styles.titleCon)}>
        点位<span className='c-006'>评估</span>报告
      </div>
      <div className={cs('mt-12 fs-15 c-333', styles.addressCon)}>
        {detail?.address}
      </div>
      <div className={cs('mt-28 c-222', styles.useCon)}>
        <div className={styles.nameCon}>
          <UserOutlined />
          <span className='pl-4'>{dataInfo?.userName}</span>
        </div>
        {
          dataInfo?.department ? <>
            <div className='ml-10 mr-16'>|</div>
            <div className={styles.departmentCon}>
              <ClusterOutlined />
              <span className='pl-4'>{dataInfo?.department}</span>
            </div>
          </> : <></>
        }
      </div>
    </div>
  );
};

export default HomeHead;
