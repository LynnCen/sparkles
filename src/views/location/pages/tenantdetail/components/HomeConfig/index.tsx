import React, { useEffect, useState } from 'react';
import styles from './entry.module.less';
import { Tree, TreeDataNode, Modal, TreeProps, message, Space, Button, Input, Typography } from 'antd';
import {
  EditOutlined
} from '@ant-design/icons';
import { HomeDetail, MapKey, TenantHomeConfig, TreeNodeData, checkAllSpaces, getKeysAdjacentStyles, isDropToFirst, isSameLevel, isSameParent, transformToConfig, transformToTreeData } from './ts.config';
import DataBrief from './components/DataBrief';
import ConversionFunnels from './components/ConversionFunnels';
import DataReports from './components/DataReports';

import StoreStatus from './components/StoreStatus';
import { getHomeConfigDetail, updateHomeConfigDetail } from '@/common/api/location';
import V2Container from '@/common/components/Data/V2Container';


import StoreMap from './components/StoreMap';
interface HomeConfigProps {
  tenantId: number;
  mainHeight?: number
}
const { Text } = Typography;

const HomeConfig: React.FC<HomeConfigProps> = (props) => {
  const { tenantId, mainHeight } = props;
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [gData, setGData] = useState<TreeNodeData[]>([]);
  const [edidvisible, setEdidvisible] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>('');
  const [editNode, setEditNode] = useState<TreeNodeData>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchDetail();
  }, [tenantId]);
  // 获取首页配置、
  const fetchDetail = async () => {
    const detail: HomeDetail = await getHomeConfigDetail({
      tenantId
    });
    // 并将接口数据TenantHomeConfig[]处理为treenode形式的TreeNodeData[]
    const treeD = transformToTreeData(detail.tenantHomeConfig);
    // 设置默认选中的元素 根据接口数据的isShow来判断
    const defaultSelectKey: Array<React.Key> = [];
    treeD.forEach((item) => {
      if (item.key === MapKey.DataBrief || item.key === MapKey.ConversionFunnels || item.key === MapKey.DataReports) {
        item.children.forEach((chilrenItem) => {
          if (chilrenItem.isShow) defaultSelectKey.push(chilrenItem.key);
        });
      } else {
        if (item.isShow) defaultSelectKey.push(item.key);
      }
    });
    setCheckedKeys(defaultSelectKey);
    setGData(treeD);
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
    setGData(data);
  };

  const onCheck = (checkedKeysValue: React.Key[]): void => {
    const dataBriefKey: React.Key[] = [];
    const conversionFunnelsKey: React.Key[] = [];
    checkedKeysValue.forEach((item) => {
      // 拿到父级KEY
      const Mapkey = (item as string).split('-')[0];
      if (Mapkey === MapKey.DataBrief) dataBriefKey.push(item);
      if (Mapkey === MapKey.ConversionFunnels) conversionFunnelsKey.push(item);
    });
    // 指标个数限制
    const dataBriefKeyCount = dataBriefKey.length;
    if (dataBriefKeyCount > 8) {
      message.error(`当前模块仅支持配置8个指标`);
      return;
    }
    const conversionFunnelsKeyCount = conversionFunnelsKey.length;
    if (conversionFunnelsKeyCount > 5) {
      message.error(`当前模块仅支持配置5个指标`);
      return;
    }
    setCheckedKeys(checkedKeysValue);
  };
  // 编辑名称（本地修改）
  const onEditOk = (): void => {
    const isEmpty = checkAllSpaces(editValue);
    if (editValue.length > 10) {
      message.error('名称的字符数不应超过10个');
      return;
    }
    if (isEmpty || !editNode) {
      message.error('不能为空');
      return;
    }
    // 根据key递归找到该元素 并修改该数据的title 注意不是name（接口数据） 此处的渲染使用的是title
    const loopNode = (node, key) => {
      return node.map((item) => {
        const newItem = { ...item };
        if (item.key === key) {
          newItem.title = editValue;
          return newItem;
        }
        if (item.children && item.children.length > 0) newItem.children = loopNode(newItem.children, key);
        return newItem;
      });
    };
    const editData = loopNode(gData, editNode.key);
    setGData(editData);
    setEdidvisible(false);
  };
  // 保存修改
  const onSubmit = async () => {
    try {
      setLoading(true);
      // 将treeNode数据处理为接口数据 TreeNodeData[]->TenantHomeConfig[]
      const value = transformToConfig(gData, checkedKeys);
      const res = await updateHomeConfigDetail({
        tenantId,
        tenantHomeConfig: value as unknown as TenantHomeConfig[]
      });
      if (res) message.success('保存成功');
      setLoading(false);
    } catch (error) {
      message.error('保存失败');
      setLoading(false);
    }
  };
  const handleChangeInput = (e): void => {
    const value = e.target.value as string;
    setEditValue(value);
  };
  return <V2Container
    style={{ height: mainHeight }}
    extraContent={{
      bottom: <section style={{
        background: '#fff',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row-reverse'
      }}>
        <Space>
          <Button className='mr-12' onClick={fetchDetail}>取消</Button>
          <Button loading={loading} type='primary' onClick={onSubmit}>
            保存
          </Button>
        </Space>
      </section>
    }}>
    <main className={styles.homeConfig}>
      <aside className={styles.leftMenu}>
        <h1 className={styles.mainTitle}>新增首页配置</h1>
        <Tree
          checkable
          draggable
          blockNode
          defaultExpandedKeys={[MapKey.DataBrief, MapKey.ConversionFunnels, MapKey.DataReports]}
          className={styles.tree}
          checkedKeys={checkedKeys}
          onDrop={onDrop}
          onCheck={onCheck as TreeProps['onCheck']}
          treeData={gData}
          titleRender={(nodeData: any) => {
            const preKey = nodeData.key.split('-');
            const isPre = preKey.length === 1;
            return <>
              {/* {
                isPre && <div className={styles.separator}/>
              } */}
              <Text ellipsis={{ tooltip: nodeData.title }} style={{ maxWidth: 100 }} className={isPre ? styles.treeTitle : styles.childrenTitle}>{nodeData.title}</Text>
              <EditOutlined className={styles.edit} onClick={() => {
                setEditValue(nodeData.title);
                setEdidvisible(true);
                setEditNode(nodeData);
              }} />
            </>;
          }}
        >
        </Tree>
      </aside>
      <div className={styles.contentWrapper}>
        <section className={styles.content}>  {
          gData.map((item, index) => {
            if (item.key === MapKey.DataBrief) {
              const data = item.children.filter((item) => checkedKeys.includes(item.key));
              if (data.length === 0) return null;
              return <DataBrief data={data} />;
            }
            if (item.key === MapKey.ConversionFunnels) {
              const data = item.children.filter((item) => checkedKeys.includes(item.key));
              // 判断门店状态是否显示
              const isShowStoreStatus = checkedKeys.includes(MapKey.StoreStatus);
              if (data.length === 0) return null;
              const styles = getKeysAdjacentStyles(gData, index, MapKey.StoreStatus, isShowStoreStatus);
              return <ConversionFunnels data={data} style={styles} title={item.title as string} />;
            }
            if (item.key === MapKey.DataReports) {
              const data = item.children.filter((item) => checkedKeys.includes(item.key));
              if (data.length === 0) return null;
              return <DataReports data={data} title={item.title as string} />;
            }
            if (item.key === MapKey.StoreMap) {
              const show = checkedKeys.includes(item.key);
              if (!show) return;
              return <StoreMap title={item.title as string} />;
            }
            if (item.key === MapKey.StoreStatus) {
              const show = checkedKeys.includes(MapKey.StoreStatus);
              // 判断漏斗是否显示
              const conversionFunnelsData = gData.find((item) => item.key === MapKey.ConversionFunnels);
              const isShowConversionFunnels = Number(conversionFunnelsData?.children.filter((item) => checkedKeys.includes(item.key)).length);
              if (!show) return;
              const styles = getKeysAdjacentStyles(gData, index, MapKey.ConversionFunnels, isShowConversionFunnels);
              return <StoreStatus data={item} style={styles} />;
            }
            return null;
          })
        }</section>
      </div>
      {
        edidvisible && <Modal
          visible={edidvisible}
          centered
          title='编辑名称'
          width={400}
          mask={false}
          destroyOnClose
          onCancel={() => setEdidvisible(false)}
          footer={
            <Space>
              <Button className='mr-12' onClick={() => setEdidvisible(false)}>取消</Button>
              <Button type='primary' onClick={onEditOk}>
                保存
              </Button>
            </Space>
          }
        >
          <Input value={editValue} onChange={handleChangeInput} />
        </Modal>
      }
    </main>
  </V2Container>;

};

export default HomeConfig;
