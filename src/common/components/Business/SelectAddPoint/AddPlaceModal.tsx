/**
 * @Description
 */
import { Col, Form, Modal, Row, message } from 'antd';
import { FC, useEffect, useState } from 'react';
import V2Form from '../../Form/V2Form';
import V2FormInput from '../../Form/V2FormInput/V2FormInput';
import FormMapAddress from '../../Form/FormMapAddress';
import { post } from '@/common/request';
import V2FormProvinceList from '../../Form/V2FormProvinceList';
import { placeCategoryList } from '@/common/api/common';
import FormSelect from '../../Form/FormSelect';

interface AddPlaceModalProps {
  visible?: boolean;
  zIndex?: number;
  onHidden?: () => void;
  onSuccess?: (result?: any) => void;
  channel?: string;
  extraParams?: any;
}

const AddPlaceModal: FC<AddPlaceModalProps> = ({ visible, channel, onHidden, extraParams, zIndex, onSuccess }) => {
  const [form] = Form.useForm();
  const [storeAddressInfo, setStoreAddressInfo] = useState<any>({});
  const [placeCategoryOptions, setPlaceCategoryOptions] = useState<any>([]);

  useEffect(() => {
    if (visible) {
      form.resetFields();
      getPlaceCategoryOptions();
    }
  }, [visible]);

  useEffect(() => {
    if (visible && extraParams.longitude) {
      setStoreAddressInfo({ ...extraParams });
    }
  }, [extraParams, visible]);

  const onSubmit = async () => {
    form.validateFields().then(async (values) => {
      const params = {
        ...values,
        channel,
        address: storeAddressInfo,
      };
      if (values.pcdIds?.length) {
        const area = {
          provinceId: values.pcdIds[0],
          cityId: values.pcdIds[1],
          districtId: values.pcdIds[2],
        };
        params.area = area;
      }
      const result = await post('/place/examine/create', params, true);
      if (result) {
        message.success('新增成功');
        onSuccess?.(result);
      }
    });
  };

  const getPlaceCategoryOptions = async () => {
    const result = await placeCategoryList({});
    setPlaceCategoryOptions(result || []);
  };

  return (
    <Modal
      title='新建项目'
      open={visible}
      onOk={onSubmit}
      // 两列弹窗要求640px
      width={640}
      onCancel={onHidden}
      forceRender
      zIndex={zIndex}
    >
      <V2Form form={form}>
        <Row gutter={16}>
          <Col span={12}>
            <FormSelect
              label='选择类目'
              name='placeCategoryId'
              options={placeCategoryOptions}
              config={{
                allowClear: true,
                fieldNames: { label: 'name', value: 'id' },
                getPopupContainer: (node) => node.parentNode,
              }}
              rules={[{ required: true, message: '请选择项目类目' }]}
              placeholder='请选择项目类目'
            />
          </Col>
          <Col span={12}>
            <V2FormInput name='placeName' label='项目名称' required/>
          </Col>
          <Col span={12}>
            <V2FormProvinceList
              label='所在城市'
              name='pcdIds'
            />
          </Col>
          <Col span={24}>
            <FormMapAddress
              form={form}
              label='详细地址'
              name='address'
              rules={[{ required: true, message: '请输入详细地址' }]}
              needLayout={false}
              defaultAddress={storeAddressInfo}
              onChange={(val) => setStoreAddressInfo({ ...storeAddressInfo, ...val })}
            />
          </Col>
        </Row>
      </V2Form>
    </Modal>
  );
};
export default AddPlaceModal;
