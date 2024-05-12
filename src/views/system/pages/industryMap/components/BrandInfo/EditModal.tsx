import { Col, Form, Modal, Row } from 'antd';
import { useMethods } from '@lhb/hook';
import { FC, useEffect, useState } from 'react';
import { addIndustryBrand, industryBrandDetail, updateIndustryBrand } from '@/common/api/system';
import Logo from './Logo';
import { competitionType } from '../../ts-config';
import FormColorPicker from './FormColorPicker';
import V2Form from '@/common/components/Form/V2Form';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';

const EditModal :FC<any> = ({
  editModal,
  setEditModal,
  onSuccess
}) => {
  const { visible, id } = editModal;
  const [form] = Form.useForm();
  const [isLock, setIsLock] = useState<boolean>(false);
  const [visibleLogo, setVisibleLogo] = useState<boolean>(false);
  const [imgUrl, setImgUrl] = useState<any>('');
  const [color, setColor] = useState<string>('#008cff');// 取色器颜色，默认取 取色器组件默认颜色#008cff
  const [isSystem, setIsSystem] = useState<boolean>(false);
  const methods = useMethods({
    handleOk: () => {
      form.validateFields().then((res) => {
        if (isLock) return;
        setIsLock(true);
        // 处理接口（编辑或新增）
        const targetFetch = id ? updateIndustryBrand : addIndustryBrand;
        const params: any = { ...res, logo: imgUrl, color };
        if (id) {
          params.id = id;
        }
        targetFetch({ ...params }).then(() => {
          setEditModal({ visible: false, id: '' });
          form.resetFields();
          // 区分是否编辑
          onSuccess(!!id);
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
      industryBrandDetail({ id }).then((res) => {
        const { logo, color, origin } = res;
        const formParams = {
          ...res,
        };
        // 图片回显
        setImgUrl(logo);
        color && setColor(color);
        origin && setIsSystem(origin === 2);
        form.setFieldsValue(formParams);
      });
      return;
    }
    setIsSystem(false);
    setImgUrl('');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  return (
    <Modal
      title={ id ? '编辑品牌' : '新增品牌' }
      open={visible}
      width={640}
      onOk={methods.handleOk}
      onCancel={() => handleCancel()}>
      <V2Form form={form} >
        <Row gutter={16}>
          <Col span={12}>
            <V2FormInput
              label='品牌名称'
              name='name'
              maxLength={20}
              required
              config={{
                // 系统创建人状态下为只读
                readOnly: isSystem,
                disabled: isSystem
              }}
            />
            <V2FormInput label='品牌简称' name='shortName' maxLength={20} />
            <Logo
              imgUrl={imgUrl}
              setImgUrl={setImgUrl}
              label='品牌LOGO'
              visible={visibleLogo}
              setVisible={setVisibleLogo}
              readOnly={isSystem}
            />
          </Col>
          <Col span={12}>
            <V2FormSelect label='竞合关系' name='competition' options={competitionType} required />
            <FormColorPicker color={color} setColor={setColor} label='聚合饼图颜色' />
          </Col>
        </Row>
      </V2Form>
    </Modal>

  );
};
export default EditModal;
