/**
 * @Description 目前是机会点和商圈详情报告导出时的弹窗提醒
 */

import { FC } from 'react';
import { Modal } from 'antd';
// import cs from 'classnames';
// import styles from './entry.module.less';

const HintModal: FC<any> = ({
  open,
  setOpen,
}) => {

  return (
    <>
      <Modal
        title='信息提示'
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}>
        <div>
          报告正在生成中...，请稍后查看
        </div>
      </Modal>
    </>
  );
};

export default HintModal;
