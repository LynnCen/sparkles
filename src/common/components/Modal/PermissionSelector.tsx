/* eslint-disable react-hooks/exhaustive-deps */
/* 选择用户 */
import React, { FC, useEffect, useState } from 'react';
import { Modal, Row, Col, Input, Tree, Card } from 'antd';
import IconFont from '@/common/components/IconFont';
import { departmentTreeList } from '@/common/api/department';
import { userSearch } from '@/common/api/user';
import { randomString } from '@lhb/func';
import { PermissionSelectorProps } from './ts-config';
import styles from './index.module.less';

const { Search } = Input;

// 添加/去除默认展开节点
function addTreeLeaf(treeData, isLeaf) {
  const loopLeaf = (data) => {
    data.forEach((item) => {
      item.isLeaf = isLeaf;
      item.key = `${randomString()}`; // 给用户添加唯一的key，因为用户可能在多个部门中存在
      if (item.children) {
        loopLeaf(item.children);
      }
    });
  };
  loopLeaf(treeData);
}

function addUserTree(treeData, curKey, child) {
  const loop = (data) => {
    data.forEach((item) => {
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

const ChooseUser: FC<PermissionSelectorProps> = ({ values, onClose, onOk, title, type = 'ONE' }) => {
  const [treeData, setTreeData] = useState<any[]>([]);
  const [checkUser, setCheckUser] = useState<any[]>([]);
  // 配合onload使用
  const [loadedKeys, setLoadedKeys] = useState<any[]>([]);

  useEffect(() => {
    if (values.visible) {
      initFetchDepartMent();
      setCheckUser(values.users || []);
    } else {
      // 关闭弹窗的时候重置状态
      setTreeData([]);
      setLoadedKeys([]);
    }
  }, [values.visible]);

  // 获取部门列表 todo 此次需要重新确定
  const initFetchDepartMent = async () => {
    const result = await departmentTreeList();
    // const arr = result.objectList || [];
    // 给部门树添加展开箭头
    addTreeLeaf(result, false);
    setTreeData(result);
  };

  // 获取当前部门下的用户
  const getUsers = async (params: any) => {
    const result = await userSearch({ ...params });
    //  const arr = result.objectList;
    const defaultArr = treeData.slice();
    addUserTree(defaultArr, params.departmentId, result);
    setTreeData(defaultArr);
  };

  // 确定
  const onSubmit = () => {
    onOk({ users: checkUser, visible: false });
  };

  // 关闭
  const onCancel = () => {
    onClose({ ...values, visible: false });
  };

  // 搜索
  const onSearch = async (value) => {
    // 如果搜索内容不存在，则重新请求部门接口
    if (!value) {
      initFetchDepartMent();
      return;
    }
    const result = await userSearch({ keyword: value });
    // const arr = result.objectList;
    addTreeLeaf(result, true);
    setTreeData(result);
    setLoadedKeys([]); // 搜索的时候重置已加载节点的状态
  };

  // 请求加载某个节点
  const onLoadData = (treeNode) =>
    new Promise<void>((resolve) => {
      if (!treeNode.isLeaf) {
        getUsers({ departmentId: treeNode.id });
      }
      resolve();
    });

  const onSelect = (_selectedKeysValue: React.Key[], info: any) => {
    // 为用户节点的时候可以选中
    if (info.node.isLeaf) {
      const item = { name: info.node.name, id: info.node.id };
      // 选择多个
      if (type === 'MORE') {
        const arr: any[] = checkUser.slice();
        const targetIndex = arr.findIndex((item) => item.id === info.node.id);
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
  const deleteOne = (id) => {
    const arr: any[] = checkUser.slice();
    const targetIndex = arr.findIndex((item) => item.id === id);
    arr.splice(targetIndex, 1);
    setCheckUser(arr);
  };

  // 已经加载的节点
  const onLoad = (loadedKeys) => {
    setLoadedKeys(loadedKeys);
  };

  return (
    <Modal
      className={styles.permissionSelector}
      title={title}
      onCancel={onCancel}
      onOk={onSubmit}
      open={values.visible}
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
          <Card className={styles.content}>
            {!!checkUser.length &&
              checkUser.map((item) => (
                <p key={item.id} className={styles.userInfo}>
                  <span>{item.name}</span>
                  <IconFont iconHref='icon-ic_delete_normal' onClick={() => deleteOne(item.id)} />
                </p>
              ))}
          </Card>
        </Col>
      </Row>
    </Modal>
  );
};

export default ChooseUser;
