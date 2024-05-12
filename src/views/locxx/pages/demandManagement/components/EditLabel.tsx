// 编辑标签弹窗（内部标签、需求标签）
import { useState, FC, forwardRef, useImperativeHandle } from 'react';
import { useMethods } from '@lhb/hook';
import { Modal, Form, message } from 'antd';
import { replaceEmpty, contrast } from '@lhb/func';
import V2Form from '@/common/components/Form/V2Form';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import { postRequirementUpdateInternalLabel, getRequirementSelection, postRequirementUpdateLabel } from '@/common/api/demand-management';
import { refactorSelectionNew } from '@/common/utils/ways';

const layout = {
  labelCol: { span: 6 }, // label 宽度
  wrapperCol: { span: 18 }, // 内容宽度
};

// 标签类型
export const enum LabelType {
  /** 需求标签 */
  LABEL = 'LABEL',
  /** 内部标签 */
  INTERNAL_LABEL = 'INTERNAL_LABEL',
}

const EditInternalLabel:FC<{
  onRefresh: Function; // 父组件页面刷新
  ref?: any
}> = forwardRef(({
  onRefresh
}, ref) => {

  useImperativeHandle(ref, () => ({
    init: methods.init
  }));

  const [visible, setVisible] = useState(false);
  const [requesting, setRequesting] = useState(false);

  const [type, setType] = useState(LabelType.LABEL);
  const [formData] = Form.useForm();
  const [ids, setIds] = useState<Array<number | string>>([]); // 需求ids
  const [selection, setSelection] = useState({
    // 需求标签
    locxxLabels: [],
    // 内部标签
    locxxInternalLabels: [],
  });

  const title = type === LabelType.INTERNAL_LABEL ? '内部标签' : '需求标签';

  const methods = useMethods({
    init({ type = LabelType.LABEL, ids = [], labelIds = [], internalLabelIds = [] }: {
      type: LabelType; // 标签类型
      ids: Array<number | string>,
      labelIds?: Array<number>,
      internalLabelIds?: Array<number>
    }) {
      methods.getSelection();
      setIds(ids || []);
      setType(type || LabelType.LABEL);
      formData.setFieldValue('labelIds', labelIds || []);
      formData.setFieldValue('internalLabelIds', internalLabelIds || []);
      setVisible(true);
    },
    getSelection() {
      getRequirementSelection({ modules: 'locxxLabel,locxxInternalLabel' }).then((response) => {
        setSelection(val => ({ ...val,
          locxxLabels: refactorSelectionNew({ selection: contrast(response, 'locxxLabels', []) }),
          locxxInternalLabels: refactorSelectionNew({ selection: contrast(response, 'locxxInternalLabels', []) }),
        }));

        methods.getSelection = () => {};
      });
    },
    submit() {
      formData.validateFields().then(() => {
        setRequesting(true);
        const params = formData.getFieldsValue();
        const apiMap = {
          [LabelType.LABEL]: postRequirementUpdateLabel,
          [LabelType.INTERNAL_LABEL]: postRequirementUpdateInternalLabel,
        };
        apiMap[type]({ locxxRequirementIds: ids, labelIds: params?.labelIds || [], internalLabelIds: params?.internalLabelIds || [] }).then(() => {
          message.success(`编辑${title}成功！`);
          setVisible(false);
          onRefresh();
        }).finally(() => {
          setRequesting(false);
        });
      }).catch(() => {
        message.warning('请完善信息');
      });
    },
  });

  return (
    <Modal
      title={replaceEmpty(title)}
      width='520px'
      open={visible}
      maskClosable={false}
      onCancel={() => setVisible(false)}
      onOk={methods.submit}
      confirmLoading={requesting}
    >
      <V2Form form={formData} layout='horizontal' {...layout} >
        {type === LabelType.LABEL && <V2FormSelect
          label='需求标签'
          name='labelIds'
          placeholder='选择标签'
          options={selection.locxxLabels}
          allowClear
          required
          config={{ mode: 'multiple' }}
        />}
        {type === LabelType.INTERNAL_LABEL && <V2FormSelect
          label='内部标签'
          name='internalLabelIds'
          placeholder='选择标签'
          options={selection.locxxInternalLabels}
          allowClear
          required
          config={{ mode: 'multiple' }}
        />}
      </V2Form>
    </Modal>
  );
});

export default EditInternalLabel;
