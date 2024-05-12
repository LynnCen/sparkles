/**
 * @Description 锚点
 */

import { FC } from 'react';
import { Anchor } from 'antd';
// import cs from 'classnames';
import styles from './index.module.less';
import V2Anchor from '@/common/components/Others/V2Anchor';

const { Link } = Anchor;

const AnchorCom: FC<any> = ({
  anchorItems
}) => {
  return (
    <div className={styles.anchorCon}>
      <V2Anchor
        getContainer={() => {
          // 微应用记得判断 container
          const target: HTMLElement = document.querySelector('.recommendIndustryCircle .ant-modal-body') || document.body;
          return target;
        }}
        // offsetTop={25}
        // style={{ float: 'right', marginTop: '16px' }}
      >
        { anchorItems.map(item =>
          <Link
            key={item.title}
            href={`#${item.id}`}
            title={item.title}
          />
        )}
      </V2Anchor>
    </div>
  );
};

export default AnchorCom;
