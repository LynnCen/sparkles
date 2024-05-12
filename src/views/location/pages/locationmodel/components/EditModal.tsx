/**
 * @Description 新增/编辑选址模型
 */

import { FC, useEffect, useState } from 'react';
import { Modal, Form } from 'antd';
import V2Form from '@/common/components/Form/V2Form';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import { addSiteModel, updateSiteModel } from '@/common/api/location';
import V2Message from '@/common/components/Others/V2Hint/V2Message';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const EditModal: FC<any> = ({
  modalData,
  setModalData,
  onSearch,
}) => {
  const [form] = Form.useForm();
  const [isLock, setIsLock] = useState<boolean>(false);

  useEffect(() => {
    if (modalData.visible) {
      if (modalData.id) {
        form.setFieldsValue({ ...modalData });
      } else {
        form.resetFields();
      }
    }
  }, [modalData.visible]);

  const onSubmit = () => {
    form.validateFields().then((values: any) => {
      if (isLock) return;
      setIsLock(true);
      // 增加/更新
      const postApi = modalData.id ? updateSiteModel : addSiteModel;
      if (modalData.id) {
        values = {
          ...values,
          id: modalData.id,
        };
      }
      postApi(values).then((res) => {
        if (res) {
          V2Message.success('提交成功');
          onCancel();
          onSearch();
        }
      }).finally(() => {
        setIsLock(false);
      });
    }).catch(() => {
      // 不要删除catch，删除catch后表单验证失败时会报runtime error
    });
  };

  const onCancel = () => {
    setModalData({ visible: false });
  };

  return (
    <Modal
      title={!modalData.id ? '新建模型' : '编辑模型'}
      open={modalData.visible}
      onOk={onSubmit}
      width={336}
      onCancel={onCancel}
      getContainer={false}
    >
      <V2Form {...layout} form={form}>
        <V2FormInput
          label='模型名称'
          name='name'
          config={{ style: { width: '288px' } }}
          required
          maxLength={32}
        />
        <V2FormInput
          label='模型编号'
          name='code'
          config={{ style: { width: '288px' } }}
          required
          maxLength={100}
        />
      </V2Form>
    </Modal>
  );
};

export default EditModal;
