// 添加跟进记录弹窗
import { useState, FC, forwardRef, useImperativeHandle } from 'react';
import { useMethods } from '@lhb/hook';
import { Modal, Form, message } from 'antd';
import { refactorSelection, replaceEmpty } from '@lhb/func';
import dayjs from 'dayjs';
import V2Form from '@/common/components/Form/V2Form';
import V2FormTextArea from '@/common/components/Form/V2FormTextArea/V2FormTextArea';
import { postRequirementSaveFollowRecord, postSessionRecordSaveFollowRecord } from '@/common/api/demand-management';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import { getRequirementSelection } from '@/common/api/demand-management';
import FormUserList from '@/common/components/FormBusiness/FormUserList';
import V2FormDatePicker from 'src/common/components/Form/V2FormDatePicker/V2FormDatePicker';

const layout = {
  labelCol: { span: 6 }, // label 宽度
  wrapperCol: { span: 18 }, // 内容宽度
};

const AddFollowRecord:FC<{
  title?: string;
  /** 父组件页面刷新 */
  onRefresh?: Function;
  /** 提供给：demand 需求（默认），sessionRecord 会话记录 */
  provideFor?: string;
  ref?: any
}> = forwardRef(({
  title = '跟进记录',
  provideFor = 'demand',
  onRefresh
}, ref) => {
  useImperativeHandle(ref, () => ({
    init: methods.init
  }));
  const [visible, setVisible] = useState(false);
  const [selection, setSelection] = useState<any>({});

  const [requesting, setRequesting] = useState(false);
  const [form] = Form.useForm();
  const [id, setId] = useState(null);

  const disabledDate = (current) => current && current < dayjs().endOf('day');
  const TYPE_DEMAND_FOLLOW = 1;// 需求跟进
  const methods = useMethods({
    init({ id, requirementStageId }) {
      form.resetFields();
      form.setFieldValue('content', '');
      form.setFieldValue('requirementStageId', requirementStageId);
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
      form.validateFields().then(() => {
        setRequesting(true);

        const params = form.getFieldsValue();
        params.remindDate = params.remindDate && dayjs(params.remindDate).format('YYYY-MM-DD');
        let api = postRequirementSaveFollowRecord;
        if (provideFor === 'demand') {
          params.locxxRequirementId = id;
        } else if (provideFor === 'sessionRecord') {
          api = postSessionRecordSaveFollowRecord;
          params.sessionId = id;
        }

        params.type = TYPE_DEMAND_FOLLOW;

        api(params).then(() => {
          message.success('添加跟进记录成功');
          setVisible(false);
          onRefresh?.();
        }).finally(() => {
          setRequesting(false);
        });
      }).catch(() => {
        message.warning('请完善信息');
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
      <V2Form form={form} layout='horizontal' {...layout} >
        {provideFor === 'demand' && <V2FormSelect
          label='跟进阶段'
          name='requirementStageId'
          options={refactorSelection(selection.locxxRequirementStages)}
        />}
        <V2FormTextArea
          label='跟进记录'
          maxLength={1000}
          name='content'
          config={{ showCount: true, autoSize: { minRows: 9, maxRows: 10 } }}
          allowClear={true}
          required
        />
        <FormUserList
          label='提醒人'
          name='remindUsers'
          form={form}
          allowClear={true}
          placeholder='请选择提醒人'
          config={{ mode: 'multiple' }}
        />
        <V2FormDatePicker
          label='提醒日期'
          name='remindDate'
          config={{ disabledDate: disabledDate, style: { 'width': '100%' }, format: 'YYYY-MM-DD' }}
        />
      </V2Form>
    </Modal>
  );
});

export default AddFollowRecord;
