
import V2Container from '@/common/components/Data/V2Container';
import styles from './index.module.less';
import { Button, Space, Tree, TreeDataNode, Typography, Table, Modal, Input } from 'antd';
import React, { ReactNode, useEffect, useMemo, useRef } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { ColumnData, TreeNodeData, checkAllSpaces } from './ts-config';
import { TreeProps } from 'antd/lib/tree';
import useSetState from '@/common/hook/useSetState';
import { generateMockColumnData, isDropToFirst, isSameLevel, isSameParent } from './ts-config';
import V2Table from '@/common/components/Data/V2Table';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { isNotEmptyAny } from '@lhb/func';
import V2Empty from '@/common/components/Data/V2Empty';

interface StoreColumnConfigProps{
[k:string]:any
}
interface InitalStateType{
  loading:boolean,
  edidvisible:boolean,
  editValue:string,
  editNode:TreeNodeData | null,
  gData:TreeNodeData[],
  checkedKeys:React.Key[]
}
type Columns = Parameters<typeof Table>[0]['columns']
const { Text } = Typography;
const initalstate = {
  loading: false,
  edidvisible: false,
  editValue: '',
  gData: [],
  editNode: null,
  checkedKeys: []
};
const StoreColumnConfig:React.FC<StoreColumnConfigProps> = () => {
  const [state, setState] = useSetState<InitalStateType>(initalstate);
  const { loading, edidvisible, gData, checkedKeys, editValue, editNode } = state;
  const keyRef = useRef<number>(0);

  const UpdateTable = useMemo<ReactNode>(() => {
    const column:Columns = gData.map((item) => {
      if (checkedKeys.includes(item.code)) {
        return ({
          key: item.code,
          title: item.title
        });
      }
      return undefined;
    }).filter(Boolean) as Columns || [];

    // 因为defaultColumns仅作为初始值传入，defaultColumns改变之后 并不会触发tablere-rendercolumn
    // 故需 销毁和重建V2Table 在进行diff对比时，前后的key不一致，会被打上销毁的flag，然后重建V2Table
    keyRef.current++;
    return isNotEmptyAny(column) ? <V2Table
      key={keyRef.current}
      rowKey='code'
      defaultColumns={column}
      hideColumnPlaceholder
      onFetch={() => {
        return { datasource: [] };
      }}
      emptyRender={true}
      pagination={false}
    /> : <div style={{ width: '100%', height: '100%' }}>
      <V2Empty centerInBlock customTip={'请选择'}/>
    </div>;
  }, [gData, checkedKeys]);

  useEffect(() => {
    fetcheColumnData();
  }, []);

  // 请求配置列表表头数据
  const fetcheColumnData = async() => {
    const data = generateMockColumnData(10);
    const sortData = data.sort((a, b) => a.sort - b.sort);
    const selectKeys:string[] = [];
    const treeData = sortData.map(item => {
      if (item.checked)selectKeys.push(item.code);
      return ({
        key: item.code,
        title: item.name,
        ...item
      });
    });
    setState({
      gData: treeData,
      checkedKeys: selectKeys
    });

  };
  // 拖拽元素 只支持同层级拖拽
  const onDrop: TreeProps['onDrop'] = (info) => {
    // node         代表当前被拖拽到指定位置的上一个元素node
    // dragNode     代表当前被拖拽元素
    // dropPosition 代表drop后的节点位置；不准确
    // dropToGap    代表移动到非最顶级组第一个位置
    const dropKey = info.node.key;
    // 被拖拽元素的key
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    // dropPosition: ( -1 | 0 | 1 ) dropPosition计算前的值
    // -1 代表移动到最顶级组的第一个位置 inside 0, top -1, bottom 1
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
    // 判断是否处于同层拖拽
    const canDrop = (isDropToFirst(info.dragNode, info.node) ||
      (isSameParent(info.dragNode, info.node) && isSameLevel(info.dragNode, info.node)) && info.dropToGap);
    if (!canDrop) return;
    const loop = (
      data: TreeDataNode[],
      key: React.Key,
      callback: (node: TreeDataNode, i: number, data: TreeDataNode[]) => void,
    ) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children!, key, callback);
        }
      }
    };
    const data = [...gData];
    // 递归找到被拖拽的node、并从数组中剔除
    let dragObj: TreeDataNode;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });
    // 插入到指定index位置
    if (!info.dropToGap) {
      // 插入到该层级的第一个位置
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // 插入位置
        item.children.unshift(dragObj);
      });
    } else {
      let ar: TreeDataNode[] = [];
      let i: number;
      loop(data, dropKey, (_item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        // Drop on the top of the drop node
        ar.splice(i!, 0, dragObj!);
      } else {
        // Drop on the bottom of the drop node
        ar.splice(i! + 1, 0, dragObj!);
      }
    }
    setState({
      gData: data
    });
  };

  const onCheck = (checkedKeysValue: React.Key[]): void => {
    setState({ checkedKeys: checkedKeysValue });
  };
  // 重置
  const onReset = () => {

  };

  // 保存
  const handleSave = () => {
    setState({
      loading: true
    });
    try {
      const values:ColumnData = gData.map((item, index) => ({
        code: item.code,
        name: item.name,
        sort: index,
        checked: +checkedKeys.includes(item.code)
      }));
      console.log('values', values);
      setState({
        loading: false
      });
    } catch (error) {
      console.log('handleSave', error);
    }
  };

  const handleChangeInput = (e): void => {
    const value = e.target.value as string;
    setState({ editValue: value });
  };

  // 编辑名称
  const onEditOk = () => {
    const isEmpty = checkAllSpaces(editValue);
    if (editValue.length > 10) {
      V2Message.error('名称的字符数不应超过10个');
      return;
    }
    if (isEmpty || !editNode) {
      V2Message.error('不能为空');
      return;
    }
    const editGData = gData.map((item) => {
      if (item.code === editNode.code) {
        return {
          ...item,
          title: editValue,
          name: editValue
        };
      }
      return item;
    });
    setState({
      gData: editGData,
      edidvisible: false
    });
  };
  return <div>
    <V2Container
      style={{ height: 'calc(100vh - 80px)' }}
      extraContent={{
        bottom: <div style={{
          background: '#fff',
          height: 56,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row-reverse',
          paddingRight: 16
        }}>
          <Space>
            <Button className='mr-12' onClick={onReset}>取消</Button>
            <Button loading={loading} type='primary' onClick={handleSave}>
          保存
            </Button>
          </Space>
        </div>
      }}>
      <div className={styles.storeConfigWrapper}>
        <div className={styles.leftMenuWrapper}>
          <h1 className={styles.mainTitle}>列表表头配置</h1>
          <Tree
            checkable
            draggable
            blockNode
            className={styles.tree}
            checkedKeys={checkedKeys}
            onDrop={onDrop}
            onCheck={onCheck as TreeProps['onCheck']}
            treeData={gData}
            titleRender={(nodeData) => {
              return <>
                <Text ellipsis={{ tooltip: nodeData.title }} style={{ maxWidth: 100 }} className={ styles.treeTitle}>{nodeData.title}</Text>
                <EditOutlined className={styles.edit} onClick={() => {
                  setState({
                    edidvisible: true,
                    editNode: nodeData
                  });
                }} />
              </>;
            }}
          />
        </div>
        <div className={styles.contentWrapper}>
          {UpdateTable}
        </div>

      </div>

    </V2Container>
    {
      edidvisible && <Modal
        visible={edidvisible}
        title='编辑名称'
        width={400}
        mask={false}
        destroyOnClose
        onCancel={() => setState({ edidvisible: false })}
        footer={
          <Space>
            <Button className='mr-12' onClick={() => setState({ edidvisible: false })}>取消</Button>
            <Button type='primary' onClick={onEditOk}>
                保存
            </Button>
          </Space>
        }
      >
        <Input value={editValue} onChange={handleChangeInput} />
      </Modal>
    }
  </div>;
};


export default StoreColumnConfig;


