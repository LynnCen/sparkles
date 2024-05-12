import { useMethods } from '@lhb/hook';
import { post } from '@/common/request';
import { Form, message, Modal, InputNumber } from 'antd';
import React, { useEffect } from 'react';
import { isNotEmptyAny } from '@lhb/func';
import { ControlType } from '@/common/enums/control';
import { uploadTypeOptions } from '@/views/ressetting/pages/property/ts-config';
import FormInputNumber from '@/common/components/Form/FormInputNumber';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import styles from '../entry.module.less';


const FieldLimitSet: React.FC<any> = ({
  fieldLimitConfig,
  setFieldLimitConfig,
  onSearch,
  templateId
}) => {
  const { controlType, templateRestriction } = fieldLimitConfig;
  const [form] = Form.useForm();

  const { onCancel, onOk } = useMethods({
    onCancel() {
      setFieldLimitConfig({ ...fieldLimitConfig, visible: false });
    },
    onOk() {
      form.validateFields().then((values: any) => {
        const params = {
          templateId,
          propertyConfigRequestList: [{
            ...fieldLimitConfig,
            templateRestriction: isNotEmptyAny(values) ? JSON.stringify({ ...JSON.parse(templateRestriction || '{}'), ...values }) : JSON.stringify({})
          }]
        };
        const url = '/dynamic/property/update';
        post(url, params, { proxyApi: '/blaster', needHint: true }).then((success) => {
          message.success('编辑配置成功');
          if (success) {
            onCancel();
            onSearch();
          }
        });
      });
    },
  });



  useEffect(() => {
    if (!fieldLimitConfig.visible) {
      form.resetFields();
      return;
    }
    // 限制设置使用模板限制
    templateRestriction && form.setFieldsValue(JSON.parse(templateRestriction));

    // eslint-disable-next-line
  }, [fieldLimitConfig.visible]);


  return (
    <Modal title='设置限制' open={fieldLimitConfig.visible} onOk={onOk} onCancel={onCancel}>
      <Form form={form}>
        {controlType === ControlType.UPLOAD.value && <div className={styles.uploadInput}>
          <V2FormSelect
            label='限制文件格式'
            name='accept'
            options={uploadTypeOptions}
            config={{ showSearch: true, allowClear: true, mode: 'multiple' }}
          />
          <Form.Item label='限制文件个数' name='maxCount'>
            <InputNumber
              min={1}
              max={9999}
              placeholder='最多个数'
              addonAfter='个' />
          </Form.Item>
          <Form.Item label='单个文件大小' name='size'>
            <InputNumber
              min={1}
              max={9999}
              placeholder='单个文件大小限制'
              addonAfter='M' />
          </Form.Item>
        </div>}
        {(controlType === ControlType.INPUT.value || controlType === ControlType.TEXT_AREA.value || controlType === ControlType.INPUT_NUMBER.value) && <div className={styles.doubleInput}>
          <FormInputNumber
            label={controlType === ControlType.INPUT_NUMBER.value ? '数字' : '文字数量'}
            placeholder='下限'
            name='min'
            min={1}
            max={9999}
            formItemConfig={{
              style: { display: 'inline-block', marginRight: '14px' },
            }}
            config={{
              addonAfter: '个',
              precision: 0,
            }}
          />
          <span style={{ lineHeight: '30px' }}>-</span>
          <FormInputNumber

            placeholder='上限'
            name='max'
            min={1}
            max={9999}
            formItemConfig={{
              style: { display: 'inline-block', marginLeft: '14px', width: '150px' },
            }}
            config={{
              addonAfter: '个',
              precision: 0,
            }}
          />
        </div>}
        {(controlType === ControlType.CHECK_BOX.value) && <div className={styles.doubleInput}>
          <FormInputNumber
            placeholder='最少选'
            name='selectMin'
            min={0}
            max={fieldLimitConfig.propertyConfigOptionVOList?.length || 0}
            formItemConfig={{
              style: { display: 'inline-block', marginRight: '14px', width: '180px' },
            }}
            config={{
              addonAfter: '个',
              precision: 0,
            }}
          />
          <span style={{ lineHeight: '30px' }}>-</span>
          <FormInputNumber
            placeholder='最多选'
            name='selectMax'
            min={0}
            max={fieldLimitConfig.propertyConfigOptionVOList?.length || 0}
            formItemConfig={{
              style: { display: 'inline-block', marginLeft: '14px', width: '180px' },
            }}
            config={{
              addonAfter: '个',
              precision: 0,
            }}
          />
        </div>}
      </Form>
    </Modal>
  );
};
export default FieldLimitSet;
