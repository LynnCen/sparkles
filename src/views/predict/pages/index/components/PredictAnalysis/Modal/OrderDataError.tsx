/**
 * 无门店数据/数据缺失
 */

import { FC } from 'react';
import { Modal } from 'antd';
import { OrderDataErrorProps } from '../../../ts-config';
import styles from '../index.module.less';
import { dispatchNavigate } from '@/common/document-event/dispatch';

const OrderDataError: FC<OrderDataErrorProps> = ({ visible, message, onClose }) => {
  return (
    <Modal
      open={visible}
      title='提示'
      okText='去导入订单'
      className={styles.orderDataError}
      onOk={() => dispatchNavigate('/order/manage')}
      onCancel={onClose}
    >
      {message}
      {/* {type === 'noData' && <p>导入门店距今至少前30天的订单数据，方可预测哦。</p>}
      {type === 'missingData' && (
        <p className={styles.missingText}>
          当前已有订单数据中<span>福福饼店</span>门店的<span>第13天、第15天</span>数据是缺失的，需补全方可预测哦。
        </p>
      )} */}
    </Modal>
  );
};

export default OrderDataError;
