import { FC, useState } from 'react';
import { Button, message } from 'antd';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import styles from './index.module.less';

import BlockTree from './BlockTree';

import { useMethods } from '@lhb/hook';
import { deepCopy, recursionEach, filterTree } from '@lhb/func';

const TreeTransfer: FC<any> = ({
  treeDataLeft,
  setTreeDataLeft,
  treeDataRight,
  setTreeDataRight
}) => {
  const [checkedLeftKeys, setCheckedLeftKeys] = useState<any>([]);
  const [checkedRightKeys, setCheckedRightKeys] = useState<any>([]);
  const { onAdd, onDelete, ...methods } = useMethods({
    onAdd() {
      if (checkedLeftKeys.length) { // 仅有选中内容时，才继续流程
        // 假设选中后插入到通道描述下，仅是个demo
        const targetKey = '0-0-0'; // 写死通道描述的key
        const checkedFloors: Array<string> = [];
        recursionEach(treeDataLeft, 'children', (item: any) => {
          if (checkedLeftKeys.includes(item.key)) {
            checkedFloors.push(deepCopy(item));
            item.disabled = true;
          }
        }, true);
        // 如果直接执行 treeDataRight 会导致数据变更但无法触发渲染的情况
        // react无法检测到对象内部参数的变更，没有像vue那样做数据监听优化处理
        const _treeDataRight = deepCopy(treeDataRight);
        recursionEach(_treeDataRight, 'children', (item: any) => {
          if (item.key === targetKey) {
            if (!item.children) {
              item.children = [];
            }
            item.children = item.children.concat(checkedFloors);
            return;
          }
        });
        methods.clearKeys();
        setTreeDataRight(_treeDataRight);
      } else {
        message.warning('请选择左侧某一项后再进行此操作');
      }
    },
    onDelete() {
      if (checkedRightKeys.length) { // 仅有选中内容时，才继续流程
        // 如果直接执行 treeDataLeft， 会导致数据变更但无法触发渲染的情况
        // react无法检测到对象内部参数的变更，没有像vue那样做数据监听优化处理
        const _treeDataLeft = deepCopy(treeDataLeft);
        let _treeDataRight = deepCopy(treeDataRight);
        const rightFloorSelectKeys: Array<string> = [];
        // 遍历左表，从中移除disabled
        recursionEach(_treeDataLeft, 'children', (item: any) => {
          // 左侧禁用且右侧被勾选中
          if (item.disabled && checkedRightKeys.includes(item.key)) {
            item.disabled = false;
          }
        }, true);

        recursionEach(_treeDataRight, 'children', (item: any) => {
          // 左侧禁用且右侧被勾选中
          if (checkedRightKeys.includes(item.key)) {
            rightFloorSelectKeys.push(item.key);
          }
        }, true);
        _treeDataRight = filterTree(treeDataRight, rightFloorSelectKeys);
        methods.clearKeys([]);
        // 过滤左边禁选状态、删除右侧节点
        setTreeDataLeft(_treeDataLeft);
        setTreeDataRight(_treeDataRight);
      } else {
        message.warning('请选择右侧某一项后再进行此操作');
      }
    },
    clearKeys() {
      setCheckedRightKeys([]);
      setCheckedLeftKeys([]);
    }
  });
  return (
    <div className={styles.container}>
      <BlockTree
        className={styles.containerTree}
        checkedKeys={checkedLeftKeys}
        setCheckedKeys={setCheckedLeftKeys}
        treeData={treeDataLeft}/>
      <div className={styles.containerTransfer}>
        <div className={styles.containerTransferInner}>
          <Button className={styles.transferBtn} type='primary' size='large' onClick={onAdd}>
            添加至模板<RightOutlined style={{
              fontSize: '12px'
            }}/>
          </Button>
          <Button className={styles.transferBtn} size='large' onClick={onDelete}>
            <LeftOutlined style={{
              fontSize: '12px'
            }}/>从模板取消
          </Button>
        </div>
      </div>
      <BlockTree
        className={styles.containerTree}
        checkedKeys={checkedRightKeys}
        setCheckedKeys={setCheckedRightKeys}
        treeData={treeDataRight}/>
    </div>
  );
};

export default TreeTransfer;
