import { FC, useEffect } from 'react';
import { Col, Form, Modal, Row, message } from 'antd';
import { useMethods } from '@lhb/hook';
import { flowDeviceDetail, postFlowDeviceAdd, postFlowDeviceUpdate } from '@/common/api/passenger-flow';
import { contrast } from '@lhb/func';
import { SourceValue, StoreDetail } from '../../../ts-config';
import V2Form from '@/common/components/Form/V2Form';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormRadio from '@/common/components/Form/V2FormRadio/V2FormRadio';
import FormSetName from '@/common/components/Form/FormSetName/FormSetName';

const useOptions = [
  { label: '过店', value: 1 },
  { label: '进店', value: 2 },
  { label: '巡店', value: 3 },
  { label: '多用途', value: 4 },
];

const indoorTypeOptions = [
  { label: '目标识别', value: 1 },
  { label: '过线统计', value: 2 },
];

const indoorDirectionOptions = [
  { label: '正向', value: 1 },
  { label: '反向', value: 2 },
];

const passbyTypeOptions = [
  { label: '目标识别', value: 1 },
  { label: '过线统计', value: 2 },
];

export interface DeviceModalData {
  visible: boolean;
  type: number; // 1 新增 2 编辑
  flowStoreId: any; // 新增时必须
  sourceName: string;
  detail: StoreDetail;
  deviceData: any;
}

export interface DeviceModalProps {
  data: DeviceModalData,
  setData: Function;
  onChange: Function;
}

const DeviceModal: FC<DeviceModalProps> = ({
  data,
  setData,
  onChange,
}) => {
  const [form] = Form.useForm();

  const isHW = data.detail.source === SourceValue.HW;

  const indoorType = Form.useWatch('indoorType', form);

  const methods = useMethods({
    submit() {
      form.validateFields().then((values: any) => {
        const params = {
          ...values,
          ...(data.type === 1 ? { flowStoreId: data.flowStoreId } : {}),
          ...(data.type === 2 ? { id: data.deviceData.id } : {}),
        };
        !isHW && delete params.indoorType;
        (!isHW || params.indoorType !== 2) && delete params.indoorDirection;
        !isHW && delete params.passType;

        const func = data.type === 1 ? postFlowDeviceAdd : postFlowDeviceUpdate;
        func(params).then(() => {
          onChange && onChange();
          message.success(data.type === 1 ? '关联成功' : '编辑成功');
          setData({
            ...data,
            visible: false,
          });
        });
      });
    }
  });

  useEffect(() => {
    if (data.visible) {
      if (data.type === 2) {
        getDeviceDetail();
      } else {
        form.setFieldsValue({
          sn: null,
          name: null,
          chnno: null,
          use: null,
          indoorType: null,
          indoorDirection: null,
          passType: null,
          openHotspot: false,
          openLive: false,
          openPlayback: false,
        });
      }
    }
  }, [data.visible]);

  const getDeviceDetail = async () => {
    const res = await flowDeviceDetail({ id: data.deviceData.id });
    const initData = {
      sn: contrast(res, 'sn'),
      name: contrast(res, 'name'),
      chnno: contrast(res, 'chnno'),
      use: contrast(res, 'use'),
      indoorType: contrast(res, 'indoorType'),
      indoorDirection: contrast(res, 'indoorDirection'),
      passType: contrast(res, 'passType'),
      openHotspot: contrast(res, 'openHotspot'),
      openLive: contrast(res, 'openLive'),
      openPlayback: contrast(res, 'openPlayback'),
    };
    form.setFieldsValue(initData);
  };

  return (
    <Modal
      title='关联设备'
      width='640px'
      open={data.visible}
      maskClosable={false}
      onOk={methods.submit}
      onCancel={() => setData({ ...data, visible: false })}>
      <V2Form form={form}>
        <Row gutter={16}>
          <Col span={12}>
            <V2FormInput
              label={`${data.sourceName}设备SN号`}
              name='sn'
              maxLength={50}
              placeholder='请输入设备SN号'
              required/>
            <V2FormInput
              label='关联NVR通道号'
              name='chnno'
              maxLength={10}
              placeholder='请输入通道号'
              required/>
            <V2FormRadio
              label='进店统计方式'
              name='indoorType'
              options={indoorTypeOptions}
              onChange={(e) => {
                // 过店和进店的统计方式互斥
                form.setFieldValue('passType', e.target.value === 1 ? 2 : 1);
              }}
              formItemConfig={{
                hidden: !isHW,
              }}
              required={isHW}
            />
            <V2FormRadio
              label='进店统计方向'
              name='indoorDirection'
              options={indoorDirectionOptions}
              formItemConfig={{
                hidden: !isHW || indoorType !== 2,
              }}
              required={isHW && indoorType === 2}
            />
          </Col>
          <Col span={12}>
            <V2FormInput
              label='设备名称'
              name='name'
              maxLength={10}
              required/>
            <V2FormRadio
              label='设备用途'
              name='use'
              options={useOptions}
              required
            />
            <V2FormRadio
              label='过店统计方式'
              name='passType'
              options={passbyTypeOptions}
              onChange={(e) => {
                // 过店和进店的统计方式互斥
                form.setFieldValue('indoorType', e.target.value === 1 ? 2 : 1);
              }}
              formItemConfig={{
                hidden: !isHW,
              }}
              required={isHW}
            />
          </Col>
          {/* 这三个值接口必穿，最小改动少用一个 state */}
          <FormSetName name='openHotspot'></FormSetName>
          <FormSetName name='openPlayback'></FormSetName>
          <FormSetName name='openLive'></FormSetName>
          {/* <Col span={24}>
            <Row gutter={16}>
              <Col span={6}>
                <V2FormSwitch
                  label='热力图'
                  name='openHotspot'
                  valuePropName='checked'
                  required
                />
              </Col>
              <Col span={6}>
                <V2FormSwitch
                  label='视频回放功能'
                  name='openPlayback'
                  valuePropName='checked'
                  required
                />
              </Col>
              <Col span={6}>
                <V2FormSwitch
                  label='实时视频功能'
                  name='openLive'
                  valuePropName='checked'
                  required
                />
              </Col>
            </Row>
          </Col> */}
        </Row>
      </V2Form>
    </Modal>
  );
};

export default DeviceModal;
