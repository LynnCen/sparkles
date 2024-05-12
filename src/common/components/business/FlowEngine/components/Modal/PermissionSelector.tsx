/* 选择用户 */
import WFC from '../OperatorContext';
import { isArray, randomString } from '@lhb/func';
import { Card, Col, Input, Row, Tree } from 'antd';
import React, { FC, useContext, useEffect, useState } from 'react';
// import IconFont from '../IconFont';
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined';
import Modal from './Modal';
import styles from './index.module.less';

const { Search } = Input;

// 添加/去除默认展开节点
function addTreeLeaf(treeData: any, isLeaf: any) {
  const loopLeaf = (data: any) => {
    data.forEach((item: any) => {
      item.isLeaf = isLeaf;
      item.key = `${randomString()}`; // 给用户添加唯一的key，因为用户可能在多个部门中存在
      if (item.children) {
        loopLeaf(item.children);
      }
    });
  };
  loopLeaf(treeData);
}

function addUserTree(treeData: any, curKey: any, child: any) {
  const loop = (data: any) => {
    data.forEach((item: any) => {
      if (item.children && item.children.length) {
        loop(item.children);
      } else {
        delete item.children;
      }
      if (curKey === item.id) {
        child && child.length && addTreeLeaf(child, true); // 给用户树去除展开箭头/添加唯一key
        item.children = item.children || [];
        item.children = child.concat(item.children);
      }
    });
  };
  loop(treeData);
}

export interface CheckUsers {
  id: number;
  name: string;
  [key: string]: any;
}

export interface PermissionSelectorProps {
  users?: CheckUsers[];
  visible: boolean;
  title: string;
  type?: 'ONE' | 'MORE'; // 单选/多选
  requestUrl?: ''; // 请求链接
  onClose: () => void; // 关闭弹窗
  onOk: (val: any) => void; // 确定
}

const ChooseUser: FC<PermissionSelectorProps> = ({
  users,
  onClose,
  onOk,
  title,
  type = 'MORE',
  visible,
}) => {
  const { multipleSearch }: any = useContext(WFC);
  const [treeData, setTreeData] = useState<any[]>([]);
  const [checkUser, setCheckUser] = useState<any[]>([]);
  // 配合onload使用
  const [loadedKeys, setLoadedKeys] = useState<any[]>([]);

  // 获取部门列表 todo 此次需要重新确定
  const initFetchDepartMent = async () => {
    const result = await multipleSearch({}, 'department');
    // const arr = result.objectList || [];
    // 给部门树添加展开箭头
    addTreeLeaf(result, false);
    setTreeData(result);
  };

  useEffect(() => {
    if (visible) {
      initFetchDepartMent();
      setCheckUser(users || []);
    } else {
      // 关闭弹窗的时候重置状态
      setTreeData([]);
      setLoadedKeys([]);
    }
  }, [visible, users]);

  // 获取当前部门下的用户
  const getUsers = async (departmentId: number) => {
    const { objectList }: any = await multipleSearch(
      { keyword: '', departmentId },
      'employee',
    );
    //  const arr = result.objectList;
    const defaultArr = treeData.slice();
    addUserTree(defaultArr, departmentId, isArray(objectList) ? objectList : []);
    setTreeData(defaultArr);
  };

  // 确定
  const onSubmit = () => {
    onOk(checkUser);
  };

  // 关闭
  const onCancel = () => {
    onClose();
  };

  // 搜索
  const onSearch = async (value: any) => {
    // 如果搜索内容不存在，则重新请求部门接口
    if (!value) {
      initFetchDepartMent();
      return;
    }
    const { objectList } = await multipleSearch({ keyword: value }, 'employee');
    // const arr = result.objectList;
    addTreeLeaf(isArray(objectList) ? objectList : [], true);
    setTreeData(isArray(objectList) ? objectList : []);
    setLoadedKeys([]); // 搜索的时候重置已加载节点的状态
  };

  // 请求加载某个节点
  const onLoadData = (treeNode: any) =>
    new Promise<void>((resolve) => {
      if (!treeNode.isLeaf) {
        getUsers(treeNode.id);
      }
      resolve();
    });

  const onSelect = (_selectedKeysValue: React.Key[], info: any) => {
    // 为用户节点的时候可以选中
    const node = info.node;
    if (node.isLeaf) {
      // 抛出给父级使用
      const item = {
        name: node.name,
        id: node.id,
        mobile: node.mobile,
        city: node.city,
        cityId: node.cityId,
        provinceId: node.provinceId,
      };
      // 选择多个
      if (type === 'MORE') {
        const arr: any[] = checkUser.slice();
        const targetIndex = arr.findIndex((item) => item.id === node.id);
        if (targetIndex === -1) {
          arr.push(item);
          setCheckUser(arr);
        }
      } else if (type === 'ONE') {
        // 选择单个
        setCheckUser([item]);
      }
    }
  };

  // 清空列表
  const cleanList = () => {
    setCheckUser([]);
  };

  // 删除单个
  const deleteOne = (id: any) => {
    const arr: any[] = checkUser.slice();
    const targetIndex = arr.findIndex((item) => item.id === id);
    arr.splice(targetIndex, 1);
    setCheckUser(arr);
  };

  // 已经加载的节点
  const onLoad = (loadedKeys: any) => {
    setLoadedKeys(loadedKeys);
  };

  return (
    <Modal
      className={styles.permissionSelector}
      title={title}
      onCancel={onCancel}
      onOk={onSubmit}
      open={visible}
      width={800}
      destroyOnClose
    >
      <Row gutter={[8, 8]}>
        <Col span={12}>
          <Search placeholder='输入关键词进行搜索' onSearch={onSearch} />
          <Card className={styles.content}>
            <Tree
              fieldNames={{ title: 'name', key: 'key', children: 'children' }}
              loadData={onLoadData}
              treeData={treeData}
              loadedKeys={loadedKeys}
              onLoad={onLoad}
              onSelect={onSelect}
            />
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
            {!!checkUser.length &&
              checkUser.map((item) => (
                <span key={item.id} className={styles.userInfo}>
                  <span>{item.name}</span>
                  {/* <IconFont
                    iconHref='res-servise-ic_delete_normal'
                    onClick={() => deleteOne(item.id)}
                  /> */}
                  <DeleteOutlined onClick={() => deleteOne(item.id)} />
                </span>
              ))}
          </Card>
        </Col>
      </Row>
    </Modal>
  );
};

export default ChooseUser;
