/**
 * @Description 模拟回复的选择项目操作
 */
import React from 'react';
import { Modal, List } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import cs from 'classnames';
import styles from './index.module.less';

const ChangePlace: React.FC<{
  open: boolean,
  setOpen: Function,
  placeList: any[],
  onChange: Function
}> = ({ open, setOpen, placeList, onChange }) => {

  // 选择租户
  const changePlace = (item: any) => {
    onChange(item);
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      title='选择项目进入IM'
      footer={false}
      onCancel={() => setOpen(false)}
      width={600}
      maskClosable={false}
    >
      <List
        dataSource={placeList}
        className={styles.listWrap}
        renderItem={(item: any) => (
          <div onClick={() => changePlace(item)}>
            <List.Item>
              <List.Item.Meta
                description={
                  <div className={styles.item}>
                    <div className={cs(styles.flexItem)}>
                      <div>{item.placeName}</div>
                      <RightOutlined className='color-primary-operate pointer' onClick={() => changePlace(item)} />
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

export default ChangePlace;
