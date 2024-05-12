import { FC } from 'react';
import styles from './index.module.less';
import cs from 'classnames';
import { Popover } from 'antd';
import V2Title from '@/common/components/Feedback/V2Title';

interface BrandTagProps {
  children: any;
  className?: any;
  honorRankInfo: Array<any>;
  gainHonor: Array<any>;
  tagStyle?: Object;
}

const BrandTag: FC<BrandTagProps> = (props) => {
  const {
    className,
    honorRankInfo,
    gainHonor,
    tagStyle = {},
    children
  } = props;

  return (
    <div className={cs(styles.brandTag, className)} style={tagStyle}>
      <Popover placement='bottom' content={<div className={styles.tagPopoverContent}>
        <V2Title text='荣誉榜单' type='H3' divider/>
        <div className={styles.honorContent}>
          { honorRankInfo.map((item, index) => (
            <div className={styles.honorList} key={index}>{ item.name }</div>
          )) }
        </div>
        <V2Title text='荣誉实力' type='H3' divider className='mt-6' />
        <div className={styles.honorContent}>
          { gainHonor.map((item, index) => (
            <div className={styles.honorList} key={index}>{ item }</div>
          )) }
        </div>
      </div>} trigger='hover'>
        <div className={styles.tagContent}>
          {children}
        </div>
      </Popover>
    </div>
  );
};

export default BrandTag;
