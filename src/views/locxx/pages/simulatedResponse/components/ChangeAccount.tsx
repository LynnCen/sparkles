/**
 * @Description 模拟回复的选择租户操作
 */
import React from 'react';
import { Modal, List } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import cs from 'classnames';
import styles from './index.module.less';

const ChangeAccount: React.FC<{
  open: boolean,
  setOpen: Function,
  tenantList: any[],
  onChange: Function
}> = ({ open, setOpen, tenantList, onChange }) => {

  // 选择租户
  const changeTenant = (item: any) => {
    onChange(item);
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      title='选择租户进入IM'
      footer={false}
      onCancel={() => setOpen(false)}
      width={600}
      maskClosable={false}
    >
      <List
        dataSource={tenantList}
        className={styles.listWrap}
        renderItem={(item: any) => (
          <div onClick={() => changeTenant(item)}>
            <List.Item>
              <List.Item.Meta
                description={
                  <div className={styles.item}>
                    <div className={cs(styles.flexItem)}>
                      <div>{item.tenantName} {item.name} {item.enterprise}</div>
                      <RightOutlined className='color-primary-operate pointer' onClick={() => changeTenant(item)} />
                    </div>
                  </div>
                }
              />
            </List.Item>
          </div>
        )}
      />
    </Modal>
  );
};

export default ChangeAccount;
