import FormCheckbox from '@/common/components/Form/FormCheckbox';
import FormSelect from '@/common/components/Form/FormSelect';
import { useMethods } from '@lhb/hook';
import { post } from '@/common/request';
import { Form, message, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { ResourceModalProps, ResourceType } from '../../ts-config';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const MergeModal: React.FC<ResourceModalProps> = ({ resourceModalInfo, setResourceModalInfo, resourceType, onMerge, onSearch }) => {
  const [form] = Form.useForm();
  const [options, setOptions] = useState<any>([]);

  const { parseTitle, onCancel, onSubmit } = useMethods({
    parseTitle() {
      return ResourceType.PLACE === resourceType ? '合并场地' : '合并点位';
    },
    onCancel() {
      setResourceModalInfo({ ...resourceModalInfo, visible: false });
    },
    // 确定
    onSubmit() {
      form.validateFields().then((values) => {
        const targetId = values.targetItem;
        const mergeIds = values.mergeItems.filter((item) => item !== targetId);
        if (!mergeIds.length) {
          message.warning('至少选择一项');
        } else {
          post('/mergeResource/merge', { resourceIds: mergeIds, resourceId: targetId, resourceType: resourceType }, true).then(() => {
            message.success('操作成功');
            onMerge();
            onCancel();
            onSearch();
            setTimeout(() => {
              onSearch();
            }, 1000);
          });
        }
      });
    },
  });

  useEffect(() => {
    if (resourceModalInfo.toMergeItems && resourceModalInfo.toMergeItems.length > 0) {
      const ops = resourceModalInfo.toMergeItems.map((item) => {
        return { label: item.name, value: item.id };
      });
      setOptions(ops);
    }
  }, [resourceModalInfo]);

  return (
    <Modal title={parseTitle()} open={resourceModalInfo.visible} onCancel={onCancel} onOk={onSubmit}>
      <Form {...layout} form={form}>
        <FormCheckbox name='mergeItems' config={{ options }} rules={[{ required: true, message: '请选择' }]} />
        <FormSelect
          label='选中项目合并为'
          name='targetItem'
          options={options}
          rules={[{ required: true, message: '请选择' }]}
        />
      </Form>
    </Modal>
  );
};
export default MergeModal;
