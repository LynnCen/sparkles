import { FC } from 'react';
import styles from './places.module.less';
import cs from 'classnames';
import { Button } from 'antd';

const Empty:FC<{ add:Function }> = ({ add }) => {
  return <div className={cs(['ct', styles.empty])}>
    <img className={styles['void-img']} src='https://staticres.linhuiba.com/project-custom/custom-flow/img_404@2x.png'></img>
    <div>暂无场地点位，
      <Button type='link' className={styles.add} onClick={() => add()}>去添加</Button>
    </div>
  </div>;
};

export default Empty;
