// 会话记录详情页
import { FC } from 'react';
import { matchQuery } from '@lhb/func';
import cs from 'classnames';
import styles from './entry.module.less';
import Detail from './component/index';

const Component:FC = () => {

  const id = +matchQuery(location.search, 'id') || null;
  // 全屏
  const fullscreen = !!matchQuery(location.search, 'source');

  return <div className={cs(styles.container, fullscreen && styles.fullscreen)}>
    <Detail id={id}/>
  </div>;
};

export default Component;
