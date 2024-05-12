/**
 * @Description 开发前必读
 */
import { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { getStorage, setStorage } from '@lhb/cache';

const MustReadBeforeDev = () => {
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    // 开发环境才提示
    if (process.env.NODE_ENV === 'development') {
      const hasViewReadMe = getStorage('HAS_VIEW_README');
      if (hasViewReadMe) return;
      setShowModal(true);
    }
  }, []);

  const handleOk = () => {
    setStorage('HAS_VIEW_README', true);
    setShowModal(false);
  };

  return (
    <Modal
      title='开发前必读'
      open={showModal}
      onOk={handleOk}
      closable={false}
      maskClosable={false}
      keyboard={false}
      okText='我已知晓，不再提示'
      onCancel={() => setShowModal(false)}>
      <div>
        开发前请阅读根目录的【README.md】文件和【FAQ.md】文件 !!!
      </div>
    </Modal>
  );
};

export default MustReadBeforeDev;
