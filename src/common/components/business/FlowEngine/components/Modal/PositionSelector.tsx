/* 选择岗位 */
import { Button, Card, Col, Input, Row } from 'antd';
import { FC, useContext, useEffect, useState } from 'react';
import Modal from './Modal';
import styles from './index.module.less';
// import IconFont from '../IconFont';
import WFC from '../OperatorContext';
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined';
import { isArray } from '@lhb/func';

const { Search } = Input;

export interface CheckPositions {
  id: number;
  name: string;
  [key: string]: any;
}

export interface PermissionSelectorProps {
  positions?: CheckPositions[];
  visible: boolean;
  title: string;
  type?: 'ONE' | 'MORE'; // 单选/多选
  requestUrl?: ''; // 请求链接
  onClose: () => void; // 关闭弹窗
  onOk: (val: any) => void; // 确定
}

const ChoosePosition: FC<PermissionSelectorProps> = ({
  positions,
  onClose,
  onOk,
  title,
  type = 'MORE',
  visible,
}) => {
  const { multipleSearch }: any = useContext(WFC);
  const [list, setList] = useState<any[]>([]);
  const [checkPosition, setCheckPosition] = useState<any[]>([]);

  // 获取岗位列表 todo 此次需要重新确定
  const initFetchPositionMent = async (keyword = '') => {
    const { objectList }: any = await multipleSearch({ keyword }, 'position');
    // const arr = result || [];
    // setList(arr);
    setList(isArray(objectList) ? objectList : []);
  };

  useEffect(() => {
    if (visible) {
      initFetchPositionMent();
      setCheckPosition(positions || []);
    } else {
      // 关闭弹窗的时候重置状态
      setList([]);
    }
  }, [visible, positions]);

  // 确定
  const onSubmit = () => {
    onOk(checkPosition);
  };

  // 关闭
  const onCancel = () => {
    onClose();
  };

  // 搜索
  const onSearch = async (value: any) => {
    // 如果搜索内容不存在，则重新请求部门接口
    if (!value) {
      initFetchPositionMent();
      return;
    }
    const { objectList }: any = await multipleSearch({ keyword: value }, 'position');
    setList(isArray(objectList) ? objectList : []);
  };

  const onSelect = (info: any) => {
    // 选择多个
    if (type === 'MORE') {
      const arr: any[] = checkPosition.slice();
      const targetIndex = arr.findIndex((item) => item.id === info.id);
      if (targetIndex === -1) {
        arr.push(info);
        setCheckPosition(arr);
      }
    } else if (type === 'ONE') {
      // 选择单个
      setCheckPosition([info]);
    }
  };

  // 清空列表
  const cleanList = () => {
    setCheckPosition([]);
  };

  // 删除单个
  const deleteOne = (id: any) => {
    const arr: any[] = checkPosition.slice();
    const targetIndex = arr.findIndex((item) => item.id === id);
    arr.splice(targetIndex, 1);
    setCheckPosition(arr);
  };

  return (
    <Modal
      className={styles.permissionSelector}
      title={title}
      onCancel={onCancel}
      onOk={onSubmit}
      open={visible}
      width={800}
      zIndex={1000}
      destroyOnClose
    >
      <Row gutter={[8, 8]}>
        <Col span={12}>
          <Search placeholder='输入关键词进行搜索' onSearch={onSearch} />
          <Card className={styles.content}>
            {!!list.length &&
              list.map((item, index) => {
                return (
                  <div key={index}>
                    <Button
                      type='text'
                      onClick={() => {
                        onSelect(item);
                      }}
                    >
                      {item.name}
                    </Button>
                  </div>
                );
              })}
          </Card>
        </Col>
        <Col span={12}>
          <p className={styles.leftTop}>
            已选
            <span className='pointer' onClick={cleanList}>
              清空列表
            </span>
          </p>
          <Card style={{ marginTop: 0 }} className={styles.content}>
            {!!checkPosition.length &&
              checkPosition.map((item) => (
                <span key={item.id} className={styles.userInfo}>
                  <span>{item.name}</span>
                  {/* <IconFont iconHref='res-servise-ic_delete_normal' onClick={() => deleteOne(item.id)} /> */}
                  <DeleteOutlined onClick={() => deleteOne(item.id)} />
                </span>
              ))}
          </Card>
        </Col>
      </Row>
    </Modal>
  );
};

export default ChoosePosition;
