import { FC, useEffect, useRef, useState } from 'react';
import { Col, Form, Modal, Row, message } from 'antd';
import { useMethods } from '@lhb/hook';
import { StoreDetail, SourceValue } from '../../../ts-config';
import { postStoreFlowOpen, postStoreFlowChange } from '@/common/api/passenger-flow';
import FormYD from '@/common/components/FormBusiness/FormYD';
import { contrast } from '@lhb/func';
import { ConfirmModal } from '@/common/components/Modal/ConfirmModal';
import V2Form from '@/common/components/Form/V2Form';
import V2FormRadio from '@/common/components/Form/V2FormRadio/V2FormRadio';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormInputNumber from '@/common/components/Form/V2FormInputNumber/V2FormInputNumber';

const solutionOptions = [
  { label: '云盯', value: SourceValue.YD },
  { label: '华为', value: SourceValue.HW },
  { label: '汇纳', value: SourceValue.HN },
];

export interface SolutionModalData {
  visible: boolean;
  type: number; // 1 开通 2 切换
  detail: StoreDetail;
}

export interface SolutionModalProps {
  data: SolutionModalData,
  setData: Function;
  onChange: Function;
  setSource: Function;
}

const accurateOptions = [
  { label: '是', value: 1 },
  { label: '否', value: 0 },
];

const SolutionModal: FC<SolutionModalProps> = ({
  data,
  setData,
  onChange,
  setSource
}) => {
  const ydRef:any = useRef();
  const [form] = Form.useForm();
  const source = Form.useWatch('source', form);
  const [sourceName, setSourceName] = useState('');

  useEffect(() => {
    const options = solutionOptions.filter(itm => itm.value === source);
    const name = options.length ? options[0].label : '';
    setSourceName(name);
  }, [source]);

  const methods = useMethods({
    submit() {
      form.validateFields().then((res) => {
        if (data.type === 1) {
          // 开通时
          methods.postData(res);
        } else {
          // 切换时需要二次确认
          ConfirmModal({
            content: '切换解决方案，将会清空关联的设备，请确定是否继续?',
            onSure: () => {
              methods.postData(res);
            }
          });
        }
      });
    },

    postData(res: any) {
      const params = {
        ...res,
        storeId: data.detail.id,
      };
      // 云盯或者汇纳方案时，才需要三方门店id参数
      (params.source !== SourceValue.YD && params.source !== SourceValue.HN) && delete params.flowStoreId;

      const func = data.type === 1 ? postStoreFlowOpen : postStoreFlowChange;
      func(params).then(() => {
        setSource(params.source);
        message.success(data.type === 1 ? '开通成功' : '切换成功');
        setData({
          ...data,
          visible: false,
        });
        // 延时刷新，否则无法获取到更新后的数据
        setTimeout(() => {
          onChange();
        }, 500);
      });
    },
    changeFlowStoreId(_) {
      form.setFieldValue('accurate', ydRef.current?.getItem([_])[0]?.accurate);
    },
    // 切换解决方案时清空三方门店id（原本回显就有问题）
    changeSource() {
      form.setFieldValue('accurate', null);
      form.setFieldValue('flowStoreId', null);
      form.setFieldValue('duration', 30);
    }
  });

  useEffect(() => {
    if (data.visible) {
      let initData = {};
      // 如果已经选择了客流实施方案，就是在进行切换方案的操作，此时需要进行数据填充。
      if (data.detail.source) {
        initData = data.detail;
      }

      form.setFieldsValue({
        source: contrast(initData, 'source'),
        flowStoreId: contrast(initData, 'flowStoreId'),
        nvr: undefined,
        duration: contrast(initData, 'duration')
      });

      contrast(initData, 'source') === SourceValue.YD && setTimeout(() => {
        ydRef.current?.addOption({
          flowStoreName: contrast(initData, 'flowStoreName'),
          flowStoreId: contrast(initData, 'flowStoreId'),
        });
      }, 100);
    } else {
      form.resetFields();
    }
  }, [data.visible]);
  return (
    <Modal
      title={data.type === 1 ? '开通客流' : '切换解决方案'}
      width='640px'
      open={data.visible}
      onOk={methods.submit}
      maskClosable={false}
      onCancel={() => setData({ ...data, visible: false, })}>
      <V2Form form={form}>
        <Row gutter={16}>
          <Col span={12}>
            <V2FormRadio
              label='解决方案'
              name='source'
              options={solutionOptions}
              formItemConfig={{
                style: { marginBottom: '8px' }
              }}
              required
              onChange={methods.changeSource}
            />
            {
              source === SourceValue.YD && <>
                <FormYD
                  label={`${sourceName}门店`}
                  name='flowStoreId'
                  allowClear
                  extraParams={{
                    source,
                  }}
                  onChange={methods.changeFlowStoreId}
                  placeholder={`搜索并选择${sourceName}门店`}
                  rules={[{ required: true }]}
                  ydRef={ydRef}
                />
                <V2FormInputNumber
                  label='人次分段统计值'
                  name='duration'
                  min={2}
                  max={999999}
                  precision={0}
                  required
                  config={{ addonAfter: 's' }} />
              </>
            }
            {
              source === SourceValue.HN && <FormYD
                label={`${sourceName}门店`}
                name='flowStoreId'
                allowClear
                extraParams={{
                  source,
                }}
                onChange={methods.changeFlowStoreId}
                placeholder={`搜索并选择${sourceName}门店`}
                rules={[{ required: true }]}
                ydRef={ydRef}
              />
            }
          </Col>
          <Col span={12}>
            <V2FormInput
              label='NVR'
              name='nvr'
              maxLength={50}/>
            <V2FormRadio
              form={form}
              disabled
              label='是否精准门店'
              name='accurate'
              options={accurateOptions} />
          </Col>
        </Row>
      </V2Form>
    </Modal>
  );
};

export default SolutionModal;
