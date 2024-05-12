/*
* 二维码弹出框
*/

import { FC, useEffect, useState } from 'react';
import Modal from '@/common/components/Modal/Modal';
import { Image, Spin } from 'antd';
import { getPlaceInfoAppCode } from '@/common/api/locxx';
import { useMethods } from '@lhb/hook';

interface CodeModalProps {
  visible?:any
  hideModal:()=> void,
  footer?:any
  maskClosable?:any
  id?:any
}

const CodeModal:FC<CodeModalProps> = ({
  visible = false,
  hideModal,
  footer = false,
  maskClosable = false,
  id
}) => {
  const [codeUrl, setCodeUrl] = useState('');
  const [loading, setLoading] = useState(false);// CodeModal的loading

  const methods = useMethods({
    init() {
      methods.initLoad();
    },
    async initLoad() {
      setLoading(true);
      if (id) {
        const res = await getPlaceInfoAppCode({ tenantPlaceId: id });
        if (res) {
          setCodeUrl(res.url);
          setLoading(false);
        }
      }
    }
  });

  useEffect(() => {
    if (visible) {
      methods.init();
    }
  }, [visible]);
  return (
    <>
      <Modal
        open={visible}
        onCancel={hideModal}
        maskClosable={maskClosable}
        footer={footer}
        style={{ textAlign: 'center' }}
        width={480}
      >
        <Spin tip='正在加载图片...' spinning={loading}>
          <Image src={codeUrl} preview={false} style={{ width: '400px', height: '400px' }}></Image>
        </Spin>
      </Modal>
    </>
  );
};


export default CodeModal;
