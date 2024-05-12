/**
 * @Description 已废弃，待删除
 */
import { FC } from 'react';
import { Modal, Form, message as msg } from 'antd';
import { taskAssigned } from '@/common/api/recommend';
import FormEmployees from '@/common/components/FormBusiness/FormEmployees';

const ModalAssigned: FC<any> = ({
  modalData,
  modalHandle
}) => {
  const [form] = Form.useForm();
  const { visible, detail } = modalData;

  const submitHandle = () => {
    form.validateFields().then(async (values: any) => {
      const { taskCityId, id } = detail;
      const { employeeId } = values;
      const params = {
        id,
        taskCityAssignList: [
          {
            taskCityId: taskCityId,
            accountIds: [employeeId]
          }
        ]
      };
      await taskAssigned(params);
      msg.success('指派成功');
      modalHandle();
    });
  };

  return (
    <Modal
      title='指派'
      open={visible}
      destroyOnClose={true}
      maskClosable={false}
      keyboard={false}
      onOk={submitHandle}
      onCancel={() => modalHandle(false)}>
      <Form
        form={form}
        preserve={false}
        colon={false}
        name='form'
        labelCol={{ span: 6 }}>
        <FormEmployees
          label='选择指派人'
          name='employeeId'
          form={form}
          allowClear={true}
          placeholder='请输入员工姓名/手机号关键词搜索'/>
      </Form>
    </Modal>
  );
};

export default ModalAssigned;
