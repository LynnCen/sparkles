import React, { useEffect } from 'react';
import { Col, Form, message, Modal, Row } from 'antd';
import V2Form from '@/common/components/Form/V2Form';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormUpload from '@/common/components/Form/V2FormUpload/V2FormUpload';
import { useMethods } from '@lhb/hook';
import { post } from '@/common/request';
import { BrandModalProps } from '../../ts-config';
const brandTypeOptions = [
  { label: '买家品牌', value: 1 },
  { label: '供应商品牌', value: 2 },
  { label: '服务商品牌', value: 3 },
  { label: '其他品牌', value: 4 },
];
const brandLevelOptions = [
  { label: '高档', value: 1 },
  { label: '中档', value: 2 },
  { label: '低档', value: 3 },
];
const BrandModal: React.FC<BrandModalProps> = ({ onSearch, setBrandModalInfo, brandModalInfo }) => {
  const [form] = Form.useForm();

  const { parseTitle, onOk, onCancel } = useMethods({
    onCancel() {
      setBrandModalInfo({ ...brandModalInfo, visible: false });
      form.resetFields();
    },
    onOk() {
      form.validateFields().then((values: any) => {
        const params = {
          ...values,
          ...(brandModalInfo.id && { id: brandModalInfo.id }),
          logo: (values?.logo && values.logo.length && values.logo[0].url) || null,
          icon: (values?.icon && values.icon.length && values.icon[0].url) || null,
        };
        const url = brandModalInfo.id ? '/resource/brand/update' : '/resource/brand/create';
        post(url, params, true).then(() => {
          message.success(`${brandModalInfo.id ? '修改' : '新建'}品牌成功`);
          onSearch();
          onCancel();
        });
      });
    },

    parseTitle() {
      return brandModalInfo.id ? '编辑品牌' : '新增品牌';
    },
  });

  useEffect(() => {
    if (brandModalInfo.visible && brandModalInfo.id) {
      const photoList =
        (brandModalInfo?.logo && [{ url: brandModalInfo.logo, uid: brandModalInfo.logo, status: 'done' }]) || [];
      const iconList =
        (brandModalInfo?.icon && [{ url: brandModalInfo.icon, uid: brandModalInfo.icon, status: 'done' }]) || [];
      let levelValue = [];
      if (brandModalInfo.level && brandModalInfo.level.includes(']')) {
        levelValue = JSON.parse(brandModalInfo.level);
      }
      form.setFieldsValue({ ...brandModalInfo, logo: photoList, level: levelValue, icon: iconList });
    } else {
      form.resetFields();
    }
    // eslint-disable-next-line
  }, [brandModalInfo.visible]);

  return (
    <Modal
      title={parseTitle()}
      width={640}
      open={brandModalInfo.visible}
      onOk={onOk}
      onCancel={onCancel}
      forceRender>
      <V2Form form={form}>
        <Row gutter={16}>
          <Col span={12}>
            <V2FormInput label='品牌名称' name='name' required/>
            <V2FormSelect label='请选择品牌定位' name='level' mode='multiple' options={brandLevelOptions}/>
            <V2FormUpload
              label='品牌icon'
              name='icon'
              uploadType='image'
              config={{
                maxCount: 1,
                size: 3,
                fileType: ['png', 'jpg', 'jpeg', 'bmp']
              }}
            />
          </Col>
          <Col span={12}>
            <V2FormSelect
              label='品牌类型'
              name='type'
              options={brandTypeOptions}
              required
            />
            <V2FormUpload
              label='品牌logo'
              name='logo'
              uploadType='image'
              config={{
                maxCount: 1,
                size: 3,
              }}
            />
          </Col>
        </Row>
      </V2Form>
    </Modal>
  );
};
export default BrandModal;
