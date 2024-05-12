/**
 * @Description 配置初始化弹窗
 */
import { copyStatus, tenantCopy, tenantPagesByKey } from '@/common/api/location';
import Fuzzy from '@/common/components/Form/V2Fuzzy/Fuzzy';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { Modal } from 'antd';
import { FC, useEffect, useRef, useState } from 'react';
const ConfigModal:FC<any> = ({
  showConfigModal,
  setShowConfigModal,
}) => {

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [sourceTntId, setSourceTntId] = useState<number>(0);

  const timerRef = useRef<any>(null);

  // 处理点击取消
  const handleCancel = () => {
    setShowConfigModal((state) => ({
      ...state,
      visible: false
    }));
    timerRef.current && clearInterval(timerRef.current);
    timerRef.current = null;
  };

  // 处理点击确定
  const handleOk = () => {
    if (!sourceTntId) {
      V2Message.error('请选择参考租户');
      return;
    }
    setConfirmLoading(true);

    tenantCopy({
      // copy的租户
      sourceTntId,
      // 需要初始化的租户
      targetTntId: showConfigModal.id
    });
    V2Message.info('正在初始化中，请稍等');
    handlePoll();
  };

  // 轮询请求是否已经初始化完成
  const handlePoll = () => {
    timerRef.current = setInterval(async() => {
      const { status } = await copyStatus({
        tenantId: showConfigModal.id
      });
      if (status) {
        // 轮训接口是否完成,完成后关闭弹窗
        setConfirmLoading(false);
        handleCancel();
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }, 1000);
  };

  const loadData = async(name) => {
    const data = await tenantPagesByKey({ name });
    return data.objectList;
  };

  // 清除定时器
  useEffect(() => {
    return () => {
      timerRef.current && clearInterval(timerRef.current);
    };
  }, []);

  return <div>
    <Modal
      title='配置初始化'
      open={showConfigModal.visible}
      confirmLoading={confirmLoading}
      onOk={handleOk}
      onCancel={handleCancel}
      destroyOnClose
    >
      <Fuzzy
        loadData={loadData}
        fieldNames={{
          label: 'name',
          value: 'id',
        }}
        onChange={(value) => { setSourceTntId(value); }}
        style={{ width: '460px' }}
        placeholder='选择参考租户'
      />
    </Modal>

  </div>;
};
export default ConfigModal;
