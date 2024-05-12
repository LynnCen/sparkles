/**
 * @Description 首页头部
 */

import { FC } from 'react';
// import { Typography } from 'antd';
import cs from 'classnames';
import styles from './index.module.less';
import IconFont from '@/common/components/IconFont';

// const { Paragraph } = Typography;
const HomeHead: FC<any> = ({
  dataInfo,
  detail,
}) => {
  return (
    <div className={styles.headCon}>
      <div className={styles.logoCon}>
        {
          dataInfo?.tenantLogo ? <>
            <div className={styles.targetLogo}>
              <img
                src={dataInfo?.tenantLogo}
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
      <div className={cs(styles.titCon, 'c-222 fs-40 ')}>
        {/* 我是名字撑起来我是名字撑起来我是名字撑起来我是名字撑起来我是名字撑起来 */}
        {/* <Paragraph ellipsis={{
          rows: 2,
          suffix: '市调报告',
        }}
        className='c-222 fs-40 mt-40'
        style={{ width: '305px' }}
        >
          {detail?.areaName}
        </Paragraph> */}
        <span className='c-006'>市调</span>报告-{detail?.areaName}
      </div>
      <div className={cs('mt-24 c-222', styles.cityCon)}>
        <IconFont iconHref='iconic_didian' />
        <span className='pl-4'>{dataInfo?.city || ''}{dataInfo?.district || ''}</span>
      </div>
    </div>
  );
};

export default HomeHead;
