/**
 * @Description 企业余额不足弹窗
 */

import { Modal } from 'antd';
import styles from '../index.module.less';
import IconFont from '@/common/components/IconFont';

const ModalHint:any = ({
  visible,
  setVisible,
  title,
  children,
  width = 360
}) => {
  return (
    <Modal
      open={visible}
      onOk={() => setVisible(true)}
      onCancel={() => setVisible(false)}
      footer={null}
      closable={false}
      width={width}
      centered={true}
      className={styles.modal}
    >
      <div className={styles.top}>
        <span className={styles.title}>{title}</span>
        <IconFont iconHref={'iconic_close_colour_seven'} className={styles.icon}
          onClick={() => setVisible(false)}
        />
      </div>
      {children}
    </Modal>
  );
};
export default ModalHint;
