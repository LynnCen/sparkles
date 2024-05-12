/* eslint-disable react-hooks/exhaustive-deps */
/* 修改跟进人 */
import React, { useEffect, useRef, useState } from 'react';
import { Modal, Form, message } from 'antd';
import { ConfirmModal } from '@/common/components/Modal/ConfirmModal';
import FormUserList from '@/common/components/FormBusiness/FormUserList';
import { ChangeFollowerProps } from './ts-config';
import styles from './index.module.less';
import { userCurrentUser } from '@/common/api/user';
import { updateFollowerRequest } from '@/common/api/common';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const FollowerModal: React.FC<ChangeFollowerProps> = ({
  editFollower,
  onClose,
  onOk,
  updateRequest = updateFollowerRequest,
  getUserListFunc,
  title = '指派/认领',
  placeholder = '输入用户关键词搜索用户，并选择',
  immediateOnce = true
}) => {
  const [form] = Form.useForm();
  const [id, setId] = useState<string>();
  const formRef:any = useRef();

  // 获取context传入的当前用户信息
  // const currentUser: any = useContext(CurrentUserInfo);

  useEffect(() => {
    if (editFollower.visible) {
      const getInfo = async () => {
        const { id } = await userCurrentUser();
        setId(id);
      };

      getInfo();
    }

  }, [editFollower.visible]);
  useEffect(() => {
    if (editFollower.visible) {
      form.setFieldsValue({ followId: editFollower?.follower?.id });
      if (editFollower?.follower?.id && editFollower?.follower?.name) {
        formRef?.current?.setOptions([{ id: editFollower?.follower?.id, name: editFollower?.follower?.name }]);
      } else {
        formRef?.current?.reload();
      }
    }
  }, [editFollower.visible]);

  const onCancel = () => {
    onClose({ ...editFollower, visible: false });
  };

  const updateFollower = async (values, modal?: any) => {
    const params = { tenantId: editFollower.id, ...values };
    await updateRequest(params);
    message.success('跟进人修改成功');
    onOk();
    onCancel();
    modal && modal.destroy();
  };

  const onSubmit = () => {
    form.validateFields().then((values: any) => {
      updateFollower(values);
    });
  };

  // 确认自己认领
  const onSelfFollower = (modal: any) => {
    updateFollower({ followId: id }, modal);
  };

  // 自己认领
  const checkSelf = async () => {
    ConfirmModal({
      onSure: (modal) => onSelfFollower(modal),
      content: `确认自己认领`,
    });
  };

  return (
    <Modal title={title} open={editFollower.visible} onCancel={onCancel} onOk={onSubmit} getContainer={false}>
      <Form form={form} {...layout}>
        <FormUserList
          formRef={formRef}
          label='跟进人'
          name='followId'
          form={form}
          rules={[{ required: true, message: '请选择跟进人' }]}
          allowClear={true}
          placeholder={placeholder}
          getUserListFunc={getUserListFunc}
          config={{ mode: editFollower.mode || '' }}
          immediateOnce={immediateOnce}
        />
        <Form.Item label=' ' colon={false}>
          {editFollower.mode === 'multiple' ? <div className='color-warning'>需求将平均分配给所选跟进人</div> : ''}
          <span className={styles.checkSelf} onClick={checkSelf}>
            自己认领
          </span>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FollowerModal;
