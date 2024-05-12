import React, { useState } from 'react';
import { Form, Modal, Radio, Space, message } from 'antd';
import V2Form from '@/common/components/Form/V2Form';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import { userOptions } from '../ts-config';
import styles from './index.module.less';

const ChooseUserModal: React.FC<any> = ({ visible, setVisible }) => {
  const [form] = Form.useForm();
  const [selectedUser, setSelectedUser] = useState<any>();
  const [users, setUsers] = useState<any>(userOptions);
  const onCancel = () => {
    setVisible(false);
  };

  const onChange = (record) => {
    setSelectedUser(record.target.value);
  };

  const onSearch = (event) => {
    if (event.target.value) {
      setUsers(userOptions.filter((item) => item.includes(event.target.value)));
    } else {
      setUsers(userOptions);
    }
  };

  const onSubmit = () => {
    if (selectedUser) {
      message.success('操作成功');
      setVisible(false);
    } else {
      message.warn('请选择企业员工');
    }
  };

  return (
    <Modal title='选择企业员工' open={visible} width={360} onOk={onSubmit} onCancel={onCancel} destroyOnClose>
      <V2Form form={form}>
        <V2FormInput label='' name='name' placeholder='搜索姓名' maxLength={8} onChange={onSearch} />
        <div style={{ height: 220, overflow: 'scroll' }}>
          <Form.Item className={styles.user}>
            <Radio.Group onChange={onChange}>
              <Space direction='vertical'>
                {users.map((item, idx) => (
                  <Radio value={idx + 1} key={idx} className='mt-4'>
                    {item}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </Form.Item>
        </div>
      </V2Form>
    </Modal>
  );
};

export default ChooseUserModal;
