/**
 * @Description 图片部分
 */

import { FC } from 'react';
import { Carousel } from 'antd';
// import cs from 'classnames';
import styles from './index.module.less';
import { bigdataBtn } from '@/common/utils/bigdata';
import { UrlSuffix } from '@/common/enums/qiniu';

const ImgGroup: FC<any> = ({
  imgs
}) => {
  return (
    <Carousel className={styles.imgGroupCon} autoplay>
      {
        imgs?.map((imgItem: any, index: number) => <div
          className={styles.imgItemCon}
          key={index}
          onClick={() => {
            bigdataBtn('5e641ed4-efff-4ce4-938d-8f6c34e52cb2', '选址地图', '商圈详情-图片', '点击商圈详情-图片');
          }}
        >
          <img
            src={imgItem ? `${imgItem}${UrlSuffix.Ori}` : ''}
            width='100%'
            height='100%'
          />
        </div>)
      }
    </Carousel>
  );
};

export default ImgGroup;
