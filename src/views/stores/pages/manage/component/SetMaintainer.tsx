import { FC, useEffect, useState } from 'react';
import { Modal, Form, Tag } from 'antd';
import V2Form from '@/common/components/Form/V2Form';
import FormEmployees from '@/common/components/FormBusiness/FormEmployees';
import { useMethods } from '@lhb/hook';
import { deepCopy } from '@lhb/func';
import { postStoreManagers } from '@/common/api/store';

const SetManager: FC<any> = ({
  modalData,
  modalHandle,
  loadData,
}) => {
  const [form] = Form.useForm();
  const { visible, managers: options, id: appId } = modalData;
  const [managers, setManagers] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    setManagers(options);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  const { submitHandle, removeTagHandle, employeeChange, managersNode } = useMethods({
    removeTagHandle: (manage: any) => {
      const nowManages = managers.filter((manageItem: any) => manage.id !== manageItem.id);
      setManagers(nowManages);
    },
    employeeChange: (id: number) => {
      console.log(`id`, id);
      console.log(`managers`, managers);
      if (managers.find((employeeItem: any) => employeeItem.id === id)) return;
      const employee = employees.find((employeeItem: any) => employeeItem.id === id);
      if (employee) {
        const curManagers = deepCopy(managers);
        curManagers.push(employee);
        setManagers(curManagers);
      }
    },
    submitHandle: async () => {
      const params = {
        id: appId,
        managerIds: managers.map((managerItem: any) => managerItem.id),
        type: 2
      };
      await postStoreManagers(params);
      loadData();
      modalHandle();
    },
    managersNode: () => {
      if (Array.isArray(managers) && managers.length) {
        return (
          <Form.Item label='管理员列表'>
            {
              managers.map((manager: any) => (
                <Tag
                  key={manager.id}
                  closable
                  onClose={() => removeTagHandle(manager)}
                  className='tagItem'>
                  {manager.name}
                </Tag>
              ))
            }
          </Form.Item>
        );
      }
      return null;
    }
  });

  return (
    <>
      <Modal
        title='设置售后运维人员'
        open={visible}
        destroyOnClose={true}
        maskClosable={false}
        keyboard={false}
        width={400}
        onOk={submitHandle}
        onCancel={() => modalHandle()}
        wrapClassName='setFlowManagerModal'>
        <V2Form form={form} name='form'>
          <FormEmployees
            label='选择员工'
            name='employeeId'
            form={form}
            allowClear={true}
            placeholder='请输入员工姓名/手机号关键词搜索'
            changeHandle={employeeChange}
            finallyData={(employees) => setEmployees(employees)}/>
          { managersNode() }
        </V2Form>
      </Modal>
    </>
  );
};

export default SetManager;
