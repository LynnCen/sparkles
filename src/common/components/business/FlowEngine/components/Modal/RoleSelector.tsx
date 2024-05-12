/* 选择角色 */
import { Button, Card, Col, Input, Row } from 'antd';
import { FC, useContext, useEffect, useState } from 'react';
import Modal from './Modal';
import styles from './index.module.less';
// import IconFont from '../IconFont';
import WFC from '../OperatorContext';
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined';
import { isArray } from '@lhb/func';

const { Search } = Input;

export interface CheckRoles {
  id: number;
  name: string;
  [key: string]: any;
}

export interface PermissionSelectorProps {
  roles?: CheckRoles[];
  visible: boolean;
  title: string;
  type?: 'ONE' | 'MORE'; // 单选/多选
  requestUrl?: ''; // 请求链接
  onClose: () => void; // 关闭弹窗
  onOk: (val: any) => void; // 确定
}

const ChooseRoles: FC<PermissionSelectorProps> = ({
  roles,
  onClose,
  onOk,
  title,
  type = 'MORE',
  visible,
}) => {
  const { multipleSearch }: any = useContext(WFC);
  const [list, setList] = useState<any[]>([]);
  const [checkRoles, setCheckRoles] = useState<any[]>([]);

  // 获取角色列表 todo 此次需要重新确定
  const initFetchRoleMent = async (keyword = '') => {
    const { objectList }: any = await multipleSearch({ keyword }, 'role');
    // const arr = result || [];
    // setList(arr);
    setList(isArray(objectList) ? objectList : []);
  };

  useEffect(() => {
    if (visible) {
      initFetchRoleMent();
      setCheckRoles(roles || []);
    } else {
      // 关闭弹窗的时候重置状态
      setList([]);
    }
  }, [visible, roles]);

  // 确定
  const onSubmit = () => {
    onOk(checkRoles);
  };

  // 关闭
  const onCancel = () => {
    onClose();
  };

  // 搜索
  const onSearch = async (value: any) => {
    // 如果搜索内容不存在，则重新请求部门接口
    // if (!value) {
    //   initFetchRoleMent();
    //   return;
    // }
    // const result: any = await initFetchRoleMent(value);
    // const arr = result.objectList || [];
    // setList(arr);
    initFetchRoleMent(value);
  };

  const onSelect = (info: any) => {
    // 选择多个
    if (type === 'MORE') {
      const arr: any[] = checkRoles.slice();
      const targetIndex = arr.findIndex((item) => item.id === info.id);
      if (targetIndex === -1) {
        arr.push(info);
        setCheckRoles(arr);
      }
    } else if (type === 'ONE') {
      // 选择单个
      setCheckRoles([info]);
    }
  };

  // 清空列表
  const cleanList = () => {
    setCheckRoles([]);
  };

  // 删除单个
  const deleteOne = (id: any) => {
    const arr: any[] = checkRoles.slice();
    const targetIndex = arr.findIndex((item) => item.id === id);
    arr.splice(targetIndex, 1);
    setCheckRoles(arr);
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
                      key={index}
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
            {!!checkRoles.length &&
              checkRoles.map((item) => (
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

export default ChooseRoles;
