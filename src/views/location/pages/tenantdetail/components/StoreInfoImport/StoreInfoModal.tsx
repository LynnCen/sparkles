import { Form, message, Modal } from 'antd';
import { useMethods } from '@lhb/hook';
import { FC, useEffect, useState } from 'react';
import Logo from './Logo';
import FormInput from '@/common/components/Form/FormInput';
import { get, post } from '@/common/request';

const StoreInfoModal: FC<any> = ({ editModal, setEditModal, onSuccess, tenantId }) => {
  const { visible, id } = editModal;
  const [form] = Form.useForm();
  const [isLock, setIsLock] = useState<boolean>(false);
  const [visibleLogo, setVisibleLogo] = useState<boolean>(false);
  const [imgUrl, setImgUrl] = useState<any>('');
  const methods = useMethods({
    handleOk: () => {
      form.validateFields().then((res) => {
        if (imgUrl === '') {
          message.error('请上传品牌Logo！');
          return;
        }
        if (isLock) return;
        setIsLock(true);
        // 处理接口（编辑或新增）
        const url = '/demo/save';
        const params: any = { ...res, logo: imgUrl };
        if (id) {
          params.id = id;
        }
        post(url, { tenantId, ...params }, { proxyApi: '/blaster' })
          .then(() => {
            setEditModal({ visible: false, id: '' });
            form.resetFields();
            onSuccess();
          })
          .finally(() => {
            setIsLock(false);
          });
      });
    },
  });
  const handleCancel = () => {
    form.resetFields();
    setEditModal({ visible: false, id: '' });
  };

  useEffect(() => {
    // 数据回显
    if (id) {
      get('/demo/show', { id }, { proxyApi: '/blaster' }).then((res) => {
        const { logo } = res;
        const formParams = {
          ...res,
        };
        // 图片回显
        setImgUrl(logo);
        form.setFieldsValue(formParams);
      });
      return;
    }
    setImgUrl('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  return (
    <Modal title={id ? '编辑品牌' : '新增品牌'} open={visible} onOk={methods.handleOk} onCancel={() => handleCancel()}>
      <Form
        form={form}
        labelCol={{
          span: 6,
        }}
        size='large'
      >
        <FormInput
          label='数据名称'
          name='name'
          maxLength={20}
          rules={[{ required: true, message: '请输入品牌名称' }]}
        />
        <FormInput label='简介' name='content' maxLength={20} rules={[{ required: true, message: '请输入品牌简介' }]} />

        <Logo
          imgUrl={imgUrl}
          setImgUrl={setImgUrl}
          label='品牌LOGO'
          visible={visibleLogo}
          setVisible={setVisibleLogo}
        />
      </Form>
    </Modal>
  );
};
export default StoreInfoModal;
