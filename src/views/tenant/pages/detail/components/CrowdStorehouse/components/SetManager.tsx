import { FC, useEffect, useState } from 'react';
import { Modal, Form, Tag, message as msg } from 'antd';
import { Manager } from '../../../ts-config';
import { useMethods } from '@lhb/hook';
import { UserListItem } from '@/common/components/Select/UserList';
import { deepCopy } from '@lhb/func';
import {
  batchSetManager,
  setManager,
  batchAddManager
} from '@/common/api/flow';
import FormUserList from '@/common/components/FormBusiness/FormUserList';

interface SetManagerProps {
  storeIds: number[] | number;
  modalData: Record<string, any>;
  modalHandle: (visible: boolean) => void;
  loadData: () => void;
  tenantId: number;
}

const SetManager: FC<SetManagerProps> = ({
  storeIds,
  modalData,
  modalHandle,
  loadData,
  tenantId
}) => {
  const [form] = Form.useForm();
  const { visible, managers: options, isBatch } = modalData;
  const [managers, setManagers] = useState<UserListItem[]>([]);
  const [employees, setEmployees] = useState<UserListItem[]>([]);

  useEffect(() => {
    setManagers(options);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  const { submitHandle, removeTagHandle, employeeChange, managersNode } = useMethods({
    removeTagHandle: (manage: Manager) => {
      const nowManages = managers.filter((manageItem: Manager) => manage.id !== manageItem.id);
      setManagers(nowManages);
    },
    employeeChange: (id: number) => {
      if (managers.find((employeeItem: UserListItem) => employeeItem.id === id)) return;
      const employee = employees.find((employeeItem: UserListItem) => employeeItem.id === id);
      if (employee) {
        const curManagers = deepCopy(managers);
        curManagers.push(employee);
        setManagers(curManagers);
      }
    },
    submitHandle: async () => {
      let requestHandle: any = batchSetManager;
      const params: any = {
        managerIds: managers.map((managerItem: UserListItem) => managerItem.id)
      };
      if (!managers.length) {
        return msg.warning(`管理员不能为空`);
      }
      if (Array.isArray(storeIds) && storeIds.length) { // 批量设置管理员
        params.ids = storeIds;
        if (isBatch) { // 批量添加管理员
          requestHandle = batchAddManager;
        }
      } else { // 设置单个门店的管理员
        params.id = storeIds as number;
        requestHandle = setManager;
      }

      await requestHandle(params);
      loadData();
      modalHandle(false);
    },
    managersNode: () => {
      if (Array.isArray(managers) && managers.length) {
        return (
          <Form.Item label='管理员列表'>
            {
              managers.map((manager: Manager) => (
                <Tag
                  key={manager.id}
                  closable
                  onClose={() => removeTagHandle(manager)}>
                  {manager.name || manager.mobile}
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
        title='设置管理员'
        open={visible}
        destroyOnClose={true}
        maskClosable={false}
        keyboard={false}
        width={400}
        onOk={submitHandle}
        onCancel={() => modalHandle(false)}
        className='setManagerModal'>
        <Form
          form={form}
          preserve={false}
          colon={false}
          name='form'
          labelCol={{ span: 6 }}>
          <FormUserList
            label='选择员工'
            name='employeeId'
            form={form}
            extraParams={{
              tenantId
            }}
            allowClear={true}
            placeholder='请输入员工姓名/手机号关键词搜索'
            changeHandle={employeeChange}
            finallyData={(employees) => setEmployees(employees)}/>
          { managersNode() }
        </Form>
      </Modal>
    </>
  );
};

export default SetManager;
