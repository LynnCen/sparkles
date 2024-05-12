import { useMethods } from '@lhb/hook';
import { Form, Modal, message } from 'antd';
import { FC, useEffect, useState } from 'react';
import { getRequirementSelection, postRequirementUpdateInternalLabel } from '@/common/api/demand-management';
import { refactorSelectionNew } from '@/common/utils/ways';
import { contrast, getKeysFromObjectArray } from '@lhb/func';
import V2Form from '@/common/components/Form/V2Form';
import V2FormSelector from '@/common/components/Form/V2FormSelector/V2FormSelector';
import style from '../index.module.less';

// 内部标签编辑
const Component:FC<{
  editLabelData: { visible:boolean },
  setEditLabelData: any
  locxxRequirementId: number|string
  internalLabels: Array<any>
  onRefresh: any
}> = ({
  editLabelData,
  setEditLabelData,
  locxxRequirementId,
  internalLabels,
  onRefresh
}) => {
  const [selection, setSelection] = useState({
    locxxInternalLabels: [], // 内部标签
  });
  const [requesting, setRequesting] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (editLabelData.visible) {
      methods.getSelection();
      form.setFieldValue('internalLabelIds', Array.isArray(internalLabels) && internalLabels.length ? getKeysFromObjectArray(internalLabels, 'id') : []);
    }
  }, [editLabelData]);

  const methods = useMethods({
    getSelection() {
      getRequirementSelection({ modules: 'locxxLabel,locxxInternalLabel' }).then((response) => {
        setSelection(val => ({ ...val,
          locxxInternalLabels: refactorSelectionNew({ selection: contrast(response, 'locxxInternalLabels', []) }),
        }));
        methods.getSelection = () => {};
      });
    },
    submit() {
      form.validateFields().then((values:any) => {
        setRequesting(true);
        postRequirementUpdateInternalLabel({ locxxRequirementIds: [locxxRequirementId], internalLabelIds: values?.internalLabelIds || [] }).then(() => {
          message.success('编辑内部标签成功');
          setEditLabelData(state => ({ ...state, visible: false }));
          onRefresh?.();
        }).finally(() => {
          setRequesting(false);
        });
      });
    }
  });

  return (<Modal
    title='选择内部标签'
    width='548px'
    open={editLabelData?.visible}
    maskClosable={false}
    onCancel={() => setEditLabelData(state => ({ ...state, visible: false }))}
    onOk={methods.submit}
    confirmLoading={requesting}
  >
    <V2Form form={form} layout='horizontal' colon={false}>
      <V2FormSelector
        label='内部标签'
        name='internalLabelIds'
        options={selection.locxxInternalLabels}
        mode='multiple'
        className={style.editLabel}/>
    </V2Form>
  </Modal>);
};

export default Component;
