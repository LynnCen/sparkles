/**
 * @Description 基本信息
 */

import { FC } from 'react';
import { isArray } from '@lhb/func';
import { UrlSuffix } from '@/common/enums/qiniu';
import cs from 'classnames';
import styles from './index.module.less';
import IconFont from '@/common/components/IconFont';
import LabelRow from './LabelRow';

const Basic: FC<any> = ({
  token,
  detail,
}) => {

  return (
    <>
      <div className={cs(styles.basicCon)}>
        {
        // https://img.linhuiba.com/FjfDVeu5qh_JN7WAhFwGznLY_h3R-linhuibaoriginal.jpg
          isArray(detail?.picList) && detail.picList.length > 0 ? <div className={styles.imgCon}>
            <img
              src={`${detail.picList[0]}${UrlSuffix.Ori}`}
              width='100%'
              height='100%'
            />
          </div> : <></>
        }
        {/* 占位符*/}
        {/* <div className={styles.imgCon}>
          <img
            src='https://img.linhuiba.com/FjfDVeu5qh_JN7WAhFwGznLY_h3R-linhuibaoriginal.jpg'
            width='100%'
            height='100%'
          />
        </div> */}
        <div className={styles.titLabelCon}>
          <div className='fs-20 bold c-222 ellipsis-2'>
            {detail?.areaName}
          </div>
          <LabelRow id={detail?.id} token={token}/>
        </div>
      </div>
      <div className='mt-16'>
        <IconFont
          iconHref='iconic_map_white_one'
          className='c-006'
        />
        <span className='pl-2'>
          {detail?.cityName}{detail?.districtName}{detail?.centerAddress}
        </span>
      </div>
    </>
  );
};

export default Basic;
