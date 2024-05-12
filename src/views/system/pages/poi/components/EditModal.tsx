import V2Form from '@/common/components/Form/V2Form';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import { useMethods } from '@lhb/hook';
import { Col, Form, Modal, Row } from 'antd';
import { FC, useEffect, useState, } from 'react';
import {
  addBrand,
  updateBrand,
  poiBrandDetail
} from '@/common/api/system';
import V2FormUpload from '@/common/components/Form/V2FormUpload/V2FormUpload';

const EditModal :FC<any> = ({
  modalData,
  setModalData,
  categoryEncode,
  onSuccess
}) => {
  const { visible, id } = modalData;
  const [form] = Form.useForm();
  const [isLock, setIsLock] = useState<boolean>(false);
  const methods = useMethods({
    handleOk() {
      form.validateFields().then((res) => {
        if (isLock) return;
        setIsLock(true);
        const targetFetch = id ? updateBrand : addBrand;
        const params: any = { ...res, logo: res.logo[0].url, categoryEncode };
        if (id) {
          params.id = id;
        }
        targetFetch({ ...params }).then(() => {
          setModalData({ visible: false, id: '' });
          form.resetFields();
          onSuccess();
        }).finally(() => {
          setIsLock(false);
        });
      });
      // setModalData({ visible: false, id: '' });
    },
  });
  const handleCancel = () => {
    form.resetFields();
    setModalData({ visible: false, id: '' });
  };

  useEffect(() => {
    // 数据回显
    if (id) {
      poiBrandDetail({ id }).then((res) => {
        const { logo } = res;
        const formParams = {
          ...res,
          logo: [{ url: logo }]
        };
        form.setFieldsValue(formParams);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <Modal
      title={ id ? '编辑品牌' : '新增品牌' }
      open={visible}
      width={640}
      onOk={methods.handleOk}
      onCancel={() => handleCancel()}>
      <V2Form form={form}>
        <Row gutter={16}>
          <Col span={12}>
            <V2FormInput label='品牌名称' name='name' maxLength={12} required />
            <V2FormInput label='品牌简介' name='content' maxLength={50} required />
            <V2FormUpload
              label='品牌LOGO'
              name='logo'
              uploadType='image'
              config={{
                maxCount: 1,
                size: 4,
                fileType: ['png', 'jpp', 'jpeg']
              }}
              formItemConfig={{
                help: '请上传大小为长15px * 宽16px，且背景为透明的图片',
              }}
              required />
          </Col>
          <Col span={12}>
            <V2FormSelect
              label='竞合关系'
              name='competitionType'
              options={[
                { value: 1, label: '竞争' },
                { value: 2, label: '合作' },
                { value: 3, label: '一般' }
              ]}
              required />
            <V2FormSelect
              label='数据应用范围'
              name='scope'
              options={[
                { value: 1, label: '品牌专享' },
                { value: 2, label: '行业专享' },
                { value: 3, label: '通用' }
              ]}
              required />
          </Col>
        </Row>
      </V2Form>
    </Modal>
  );
};
export default EditModal;
