/**
 * @Description 限制
 */
import { FC, useEffect, useMemo } from 'react';
import { Form, Modal } from 'antd';
import { dynamicTemplateUpdateProperty } from '@/common/api/location';
import { ControlType } from '@/common/enums/control';
import { isNotEmptyAny } from '@lhb/func';
import { uploadTypeOptions } from '@/views/ressetting/pages/property/ts-config';
import { getRestriction } from '../../ways';
import V2Form from '@/common/components/Form/V2Form';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormInputNumber from '@/common/components/Form/V2FormInputNumber/V2FormInputNumber';
import V2FormRangeInput from '@/common/components/Form/V2FormRangeInput/V2FormRangeInput';

const RechristenModal: FC<any> = ({
  templateId,
  modalData,
  close,
  loadData
}) => {
  const { open, data } = modalData;
  const { controlType } = data || {};
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) return;
    if (!data) return;
    const templateRestriction = getRestriction(data);
    // 暴力赋值
    templateRestriction && form.setFieldsValue(templateRestriction);
  }, [open, data]);

  const isCountType = useMemo(() => {
    return controlType === ControlType.INPUT.value ||
    controlType === ControlType.TEXT_AREA.value ||
    controlType === ControlType.INPUT_NUMBER.value;
  }, [controlType]);

  const onSubmit = () => {
    form.validateFields().then((values: any) => {
      const params = {
        templateId,
        propertyConfigRequestList: [
          {
            ...data,
            templateRestriction: isNotEmptyAny(values) ? JSON.stringify({ ...getRestriction(data), ...values }) : JSON.stringify({})
          },
        ],
      };
      dynamicTemplateUpdateProperty(params).then(() => {
        onCancel();
        loadData && loadData();
      });
    });
  };
  const onCancel = () => {
    form.resetFields();
    close && close();
  };

  return (
    <Modal
      title='设置限制'
      open={open}
      onOk={onSubmit}
      onCancel={onCancel}
      getContainer={false}
      destroyOnClose
    >
      <V2Form form={form}>
        {/* 上传组件的条件限制 */}
        {
          controlType === ControlType.UPLOAD.value ? <>
            <V2FormSelect
              label='限制文件格式'
              name='accept'
              options={uploadTypeOptions}
              config={{ showSearch: true, allowClear: true, mode: 'multiple' }}
            />
            <V2FormInputNumber
              label='限制文件个数'
              name='maxCount'
              placeholder='最多个数'
              precision={0}
              min={1}
              max={99}
              config={{
                addonAfter: '个'
              }}
            />
            <V2FormInputNumber
              label='单个文件大小'
              name='size'
              placeholder='单个文件大小限制'
              precision={0}
              min={1}
              max={9999}
              config={{
                addonAfter: 'M'
              }}
            />
          </> : null
        }
        {
          isCountType ? <>
            <V2FormRangeInput
              name={['min', 'max']}
              label={controlType === ControlType.INPUT_NUMBER.value ? '数字' : '文字数量'}
              min={1}
              max={999999999}
              precision={0}
              minPlaceholder='下限'
              maxPlaceholder='上限'
              extra='个'
              useBaseRules
            />
          </> : null
        }
        {/* 复选类型 */}
        {
          controlType === ControlType.CHECK_BOX.value ? <>
            <V2FormRangeInput
              name={['selectMin', 'selectMax']}
              label='可选择个数'
              min={0}
              max={data?.propertyConfigOptionVOList?.length || 0}
              precision={0}
              minPlaceholder='下限'
              maxPlaceholder='上限'
              extra='个'
              useBaseRules
            />
          </> : null
        }
      </V2Form>
    </Modal>
  );
};

export default RechristenModal;

