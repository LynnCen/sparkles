import { useState, FC, forwardRef, useImperativeHandle } from 'react';
import { useMethods } from '@lhb/hook';
import { Modal, Form, message } from 'antd';
import { refactorSelection, replaceEmpty } from '@lhb/func';
import V2Form from '@/common/components/Form/V2Form';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import { getRequirementSelection } from '@/common/api/demand-management';
import { post } from '@/common/request';

const layout = {
  labelCol: { span: 6 }, // label 宽度
  wrapperCol: { span: 18 }, // 内容宽度
};

// 编辑跟进阶段
const EditRequirementStage:FC<{
  title?: string;
  onRefresh: Function; // 父组件页面刷新
  ref?: any
}> = forwardRef(({
  title = '跟进阶段',
  onRefresh
}, ref) => {
  useImperativeHandle(ref, () => ({
    init: methods.init
  }));
  const [visible, setVisible] = useState(false);
  const [selection, setSelection] = useState<any>({});

  const [requesting, setRequesting] = useState(false);
  const [formData] = Form.useForm();
  const [id, setId] = useState(null);

  const methods = useMethods({
    init({ id, requirementStageId }) {
      formData.setFieldValue('requirementStageId', requirementStageId);
      setId(id || null);
      setVisible(true);
      methods.getSelection();
    },
    getSelection() {
      getRequirementSelection({ modules: 'locxxRequirementStage' }).then((response) => {
        setSelection(response);
        methods.getSelection = () => {};
      });
    },
    submit() {
      formData.validateFields().then(() => {
        setRequesting(true);
        const params = formData.getFieldsValue();
        // https://yapi.lanhanba.com/project/307/interface/api/62600
        post('/locxx/requirement/updateStage', { locxxRequirementId: id, ...params }, { proxyApi: '/lcn-api' }).then(() => {
          message.success('更新跟进阶段成功');
          setVisible(false);
          onRefresh();
        }).finally(() => {
          setRequesting(false);
        });
      });
    }
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
        <V2FormSelect
          label='跟进阶段'
          name='requirementStageId'
          required
          options={refactorSelection(selection.locxxRequirementStages)}
        />
      </V2Form>
    </Modal>
  );
});

export default EditRequirementStage;
