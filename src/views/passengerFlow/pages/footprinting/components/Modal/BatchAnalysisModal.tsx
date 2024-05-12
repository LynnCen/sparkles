/**
 * @Description
 */

import Modal from '@/common/components/Modal/Modal';
import { useMethods } from '@lhb/hook';
import { Button } from 'antd';
import { FC } from 'react';

export interface BatchAnalysisModalDataProps{
  visible:boolean;
  /** 提示语 */
  contentText:string;
}


interface BatchAnalysisModalProps {
  modalData:any;
  setModalData:Function
  onOk?:Function;
}

const BatchAnalysisModal:FC<BatchAnalysisModalProps> = ({
  onOk,
  modalData = { contentText: '', visible: false },
  setModalData
}) => {

  const methods = useMethods({
    onOk: () => {
      onOk?.();
      methods.onCancel();
    },
    onCancel: () => {
      setModalData({
        ...modalData,
        visible: false
      });
    },
  });



  return <>
    <Modal
      title='提示'
      open={modalData.visible}
      width={480}
      footer={[
        <Button key='submit' type='primary' onClick={methods.onOk}>
          我知道了
        </Button>,
      ]}
      onCancel={methods.onCancel}
    >
      {modalData.contentText}
    </Modal>
  </>;
};

export default BatchAnalysisModal;
