/**
 * @Description 试用版-温馨提示框
 */

import { Modal } from 'antd';
import styles from './index.module.less';
import IconFont from '../../IconFont';
const ModalHint:any = ({
  visible,
  setVisible,
  title = '温馨提示',
  content = '联系客服，查询更多数据'
}) => {
  return (
    <Modal
      open={visible}
      onOk={() => setVisible(true)}
      onCancel={() => setVisible(false)}
      footer={null}
      closable={false}
      width={335}
      centered={true}
      className={styles.modal}
    >
      <div className={styles.top}>
        <span className={styles.title}>{title}</span>
        <IconFont iconHref={'iconic_close_colour_seven'} className={styles.icon}
          onClick={() => setVisible(false)}
        />
      </div>
      <div className={styles.content}>
        {content}
      </div>
      <div className={styles.img}>
        <img src='https://staticres.linhuiba.com/project-custom/locationpc/demo/qr_code.jpg' alt='' />
      </div>
      <div className={styles.bottom}>
      微信扫一扫 联系客服
      </div>
    </Modal>
  );
};
export default ModalHint;
