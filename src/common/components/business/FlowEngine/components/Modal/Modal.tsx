/**
 * 统一定制弹出框
 */
import React from 'react';
import { Modal as ATModal } from 'antd';
import { ModalCustomProps } from './ts-config';
import styles from './index.module.less';

const Modal: React.FC<ModalCustomProps> = (props) => {
  const { visible, open, ...restProps } = props;
  return (
    <ATModal
      className={styles.modal}
      {...restProps}
      open={visible || open}
    />
  );
};

export default Modal;
