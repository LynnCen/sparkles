import { FC, useEffect, useRef, useState } from 'react';
import { isMobile } from '@lhb/func';
import SimulatedResponse from 'src/views/locxx/pages/simulatedResponse/index';
import V2Drawer from 'src/common/components/Feedback/V2Drawer/index';
import { Modal } from 'antd';

const SimulateModal: FC<any> = ({
  data,
  onClose
}) => {
  const modalRef: any = useRef(null);
  const [modalSetData, setModalSetData] = useState<any>();

  useEffect(() => {
    if (data.visible) {
      modalRef.current.logout();
      setModalSetData({
        /** 来源：pms、locxx，以哪个身份发起会话  */
        source: data.source,
        mobile: data.mobile,
        tenantId: data.tenantId,
        contactId: data.contactId,
        consultation: 1,
        virtualAccount: data.virtualAccount
      });
    } else {
      setModalSetData(undefined);
    }
  }, [data.visible]);

  // 兼容手机端展示
  const mobileMode = isMobile();
  // 全屏样式
  const mobileModeStyle = mobileMode ? {
    top: 0,
    margin: 0,
    width: '100vw',
    maxWidth: 'none',
    height: '100vh',
    padding: 0,
  } : {};

  const mobileModeBodyStyle = mobileMode ? {
    height: 'calc(100vh - 48px)',
    padding: 0,
    width: '100vw',
  } : {};

  const ContainerNode = () => <SimulatedResponse ref={modalRef} modalSetData={modalSetData}/>;

  return (
    <>
      { mobileMode ? <Modal
        width={mobileMode ? '100vw' : 422}
        style={{
          top: '30px',
          ...mobileModeStyle
        }}
        bodyStyle={{
          maxHeight: 739,
          height: '85vh',
          ...mobileModeBodyStyle
        }}
        title='模拟聊天窗口'
        maskClosable={false}
        open={data.visible}
        onCancel={onClose}
        footer={null}
        forceRender
        destroyOnClose>
        {ContainerNode()}
      </Modal> : <V2Drawer open={data.visible} onClose={onClose} >{ContainerNode()}</V2Drawer>}
    </>
  );
};

export default SimulateModal;
