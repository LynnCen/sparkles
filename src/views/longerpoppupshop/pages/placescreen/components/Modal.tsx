import { FC } from 'react';
import { Modal, Form } from 'antd';

import V2Form from '@/common/components/Form/V2Form';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import { Task, PlaceList } from '../ts-config';

interface IProps {
  isOpen: boolean;
  onCancel: () => void;
  onOk: (values: Record<string, any>) => void;
  tasks: Task[];
  /* 当前选中的机会点记录 */
  currentRecord: PlaceList;
}

const SelectModal: FC<IProps> = ({ isOpen, onCancel, onOk, tasks, currentRecord }) => {
  const [form] = Form.useForm();
  /* 根据拓店任务生成下拉 */
  const options = tasks.map((task) => ({
    label: task.name,
    value: task.id,
  }));
  const handleSubmit = () => {
    form
      .validateFields()
      .then((formValues) => {
        const params = { id: currentRecord?.id, taskId: formValues.taskId };
        onOk(params);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };
  return (
    <Modal title='请选择归属任务' open={isOpen} onOk={handleSubmit} onCancel={onCancel} width={600}>
      <V2Form form={form} name='form' layout='horizontal'>
        <V2FormSelect label='请选择' required name='taskId' options={options} />
      </V2Form>
    </Modal>
  );
};

export default SelectModal;
