/* eslint-disable react-hooks/exhaustive-deps */
/* 新增/编辑应用 */
import React, { useState, useEffect } from 'react';
import { Modal, Form, Popover, Input } from 'antd';
import FormInput from '@/common/components/Form/FormInput';
import { OperateAppProps, ModalStatus } from '../../ts-config';
import Color from '@/common/components/Color';
import CheckIcon from '@/common/components/CheckIcon';
import IconFont from '@/common/components/IconFont';
import styles from './index.module.less';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

// 编辑填充
const initIconFilter = { iconLink: 'icon-ic_location1', color: '#1890ff' };

const OperateAppModal: React.FC<OperateAppProps> = ({ operateApp, onClose, onOk }) => {
  const [form] = Form.useForm();
  const [filters, setFilters] = useState(initIconFilter);
  const [iconModal, setIconModal] = useState({
    visible: false,
    ...filters,
  });

  useEffect(() => {
    if (operateApp.visible) {
      if (operateApp.record && operateApp.type === ModalStatus.EDIT) {
        // 编辑填充数据
        form.setFieldsValue({ ...operateApp.record });
        setFilters(initIconFilter);
      } else {
        // 新增清空数据
        form.resetFields();
        setFilters({
          iconLink: '',
          color: '#1890ff',
        });
      }
    }
  }, [operateApp.visible]);

  const onSubmit = () => {
    form
      .validateFields()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .then((_values: any) => {
        onOk();
        onCancel();
      });
  };

  // 选择icon
  const onChangeIcon = (iconLink: string) => {
    form.setFieldsValue({ icon_name: iconLink });
    setFilters({
      ...filters,
      iconLink,
    });
  };

  // 改变颜色
  const changeColor = (color) => {
    form.setFieldsValue({ color });
    setFilters({
      ...filters,
      color,
    });
  };

  // 显示选择Icon弹窗
  const showIconModal = () => {
    setIconModal({
      ...filters,
      visible: true,
    });
  };

  const onCancel = () => {
    onClose({ ...operateApp, visible: false });
  };

  return (
    <>
      <Modal
        title={operateApp.type === ModalStatus.ADD ? '新增应用' : '编辑应用'}
        open={operateApp.visible}
        onOk={onSubmit}
        width={600}
        onCancel={onCancel}
      >
        <Form className={styles.operateApp} {...layout} form={form}>
          <FormInput
            label='应用名称'
            name='应用名'
            rules={[{ required: true, message: '请输入应用名称' }]}
            maxLength={20}
          />
          <FormInput
            label='应用编码'
            name='编码'
            rules={[{ required: true, message: '请输入应用编码' }]}
            maxLength={20}
          />
          <Form.Item label='应用图标'>
            <div className={styles.appIconWrap}>
              <Form.Item noStyle name='icon_name'>
                <Input
                  readOnly
                  suffix={
                    <div className={styles.iconContent}>
                      <IconFont style={{ color: filters.color }} className={styles.icon} iconHref={filters.iconLink} />
                      <span className={styles.checkIconBtn} onClick={showIconModal}>
                        选择
                      </span>
                    </div>
                  }
                />
              </Form.Item>
              <Form.Item noStyle name='color'>
                <Popover content={<Color color={filters.color} onChange={changeColor} />}>
                  <span className={styles.iconWrap}>
                    <span className={styles.iconColor} style={{ backgroundColor: filters.color }}></span>
                  </span>
                </Popover>
              </Form.Item>
            </div>
          </Form.Item>
          <FormInput label='应用说明' name='appinstruction' placeholder='功能说明' maxLength={20} />
        </Form>
        <CheckIcon iconModal={iconModal} closeModal={setIconModal} onChange={onChangeIcon} />
      </Modal>
    </>
  );
};

export default OperateAppModal;
