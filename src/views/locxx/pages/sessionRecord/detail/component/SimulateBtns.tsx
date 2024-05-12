import { FC } from 'react';
import styles from './index.module.less';
import { Button } from 'antd';

const SimulateBtns: FC<any> = ({
  showSimulateModal
}) => {
  return (
    <>
      <div className={styles.simulateBtns}>
        <Button type='primary' onClick={() => showSimulateModal(1)}>模拟用户1</Button>
        <Button type='primary' onClick={() => showSimulateModal(2)}>模拟用户2</Button>
      </div>
    </>
  );
};

export default SimulateBtns;
