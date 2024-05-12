/**
 * @Description
 */

import { FC } from 'react';
// import cs from 'classnames';
// import styles from './entry.module.less';
import Node from './Node';

const RowItem: FC<any> = ({
  config
}) => {

  return (
    <>
      <Node node={config}/>
      {
        config.childNode ? <RowItem config={config.childNode}/> : <></>
      }
    </>
  );
};

export default RowItem;
