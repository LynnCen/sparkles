import FormInput from '@/common/components/Form/FormInput';
import { useMethods } from '@lhb/hook';
import { Form, Modal } from 'antd';
import { FC, useEffect, useState } from 'react';
import { addIndustryMall, industryMallDetail, updateIndustryMall } from '@/common/api/system';


const EditModal :FC<any> = ({
  editModal,
  setEditModal,
  onSuccess
}) => {
  const { visible, id } = editModal;
  const [form] = Form.useForm();
  const [isLock, setIsLock] = useState<boolean>(false);
  const methods = useMethods({
    handleOk: () => {
      form.validateFields().then((res) => {
        if (isLock) return;
        setIsLock(true);
        // 处理接口（编辑或新增）；
        const targetFetch = id ? updateIndustryMall : addIndustryMall;
        if (id) {
          res.id = id;
        }
        targetFetch({ ...res }).then(() => {
          setEditModal({ visible: false, id: '' });
          form.resetFields();
          onSuccess();
        }).finally(() => {
          setIsLock(false);
        });
      });
    }
  });
  const handleCancel = () => {
    form.resetFields();
    setEditModal({ visible: false, id: '' });
  };
  useEffect(() => {
    // 数据回显
    if (id) {
      industryMallDetail({ id }).then((res) => {

        form.setFieldsValue(res);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  return (
    <Modal
      title={ id ? '编辑商场' : '新增商场' }
      open={visible}
      onOk={methods.handleOk}
      onCancel={() => handleCancel()}>
      <Form
        form={form}
        labelCol={{
          span: 6
        }}
        size='large'>
        <FormInput
          label='商场名称'
          name='name'
          maxLength={8}
          rules={[{ required: true, message: '请输入商场名称' }]}
        />
        <FormInput
          label='商场简介'
          name='content'
          maxLength={20}
          rules={[{ required: true, message: '请输入商场简介' }]}
        />

      </Form>
    </Modal>
  );
};
export default EditModal;
