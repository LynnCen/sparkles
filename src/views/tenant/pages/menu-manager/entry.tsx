import { FC, Key, useEffect, useState, useMemo } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { Col, Row, Form, message, Spin, Breadcrumb } from 'antd';
import { treeFind, urlParams } from '@lhb/func';
import { useMethods } from '@lhb/hook';

import { ConfirmModal } from '@/common/components/Modal/ConfirmModal';
import IconFont from '@/common/components/IconFont';
import { menuStore } from './store';
import { MenuData } from './store/menu';
import { Link, useLocation } from 'react-router-dom';
import { get } from '@/common/request';
import ButtonTable from './compoments/table';
import MenuTree from './compoments/tree';
import { reorderTntModule } from '@/common/api/tenant';
import styles from './entry.module.less';

// menu相关接口
const { deleteMenuNByAppId } = menuStore;

// 后端获取树列表相关
interface TreeNodeData extends MenuData {
  children?: TreeNodeData[];
};

function traverseTree<T>(treeData: T, selected: boolean): any {
  if (!Array.isArray(treeData)) {
    return null;
  };

  return treeData.map(treeNodeData => {
    const { id, name, moduleId, children, icon, moduleParentId, ...restTreeNodeData } = treeNodeData;
    return {
      ...restTreeNodeData,
      title: name,
      key: id,
      value: moduleId,
      parentId: moduleParentId || moduleId,
      icon: <IconFont iconHref={icon} />,
      iconHref: icon,
      children: traverseTree(children, selected),
    };
  });
}

const MenuManager: FC<any> = () => {
  const [treeData, setTreeData] = useState<TreeNodeData[]>([]);
  const [selectedKey, setSelectedkey] = useState<Key>(0); // tree选中的key
  const [loading, setLoading] = useState<boolean>(false);
  const [showEditForm, setEditForm] = useState<boolean>(false); // 显示编辑表单
  const [buttonTableForm] = Form.useForm(); // 编辑菜单表单
  const { search } = useLocation();
  const { appId, tntInstId } = urlParams(search) as any as { appId: number, tntInstId: number};


  // 监听点击树节点触发对应的事件
  // const onAction = (type: Key, data: any) => {
  //   const typeMap = new Map<Key, Function>([
  //     ['delete', methods.handleDeleteMenuClick],
  //   ]);

  //   const fn = typeMap.get(type);
  //   fn?.(data);
  // };



  const methods = useMethods({
    onClick(key: Key, data:any) { // 监听点击节点(获取列表数据)
      console.log('key', key);
      // 先清空表单数据
      buttonTableForm.resetFields();
      setEditForm(true);
      const { title, iconHref, parentId, value } = data;
      // 插入表单数据
      buttonTableForm.setFieldsValue({ ...data, id: key, name: title, icon: iconHref, moduleParentId: parentId === value ? 0 : parentId });
    },
    editCallback() { // 编辑成功回调
      methods.getTreeData(appId, tntInstId);
    },
    handleDeleteMenuClick(data) { // 删除菜单
      const { key } = data;
      ConfirmModal({
        onSure: async () => {
          const success = await deleteMenuNByAppId(key);
          if (success) {
            message.success('删除成功');
            methods.getTreeData(appId, tntInstId);
          } else {
            message.error('删除失败');
          }
        }
      });
    },
    getTreeData(appId: number, tntInstId:number, dragKey:Key) { // 获取菜单
      setLoading(true);
      // https://yapi.lanhanba.com/project/378/interface/api/51974
      get('/tntModule/tree', { appId, tntInstId }, { proxyApi: '/mirage', needHint: true }).then((result) => {
        unstable_batchedUpdates(() => {
          setTreeData(traverseTree(result, true));
          setLoading(false);
          if (dragKey) { // 如果是拖拽，手动选中到拖拽的节点，刷新表单值
            setSelectedkey(dragKey);
            const nodeData = treeFind(traverseTree(result, true), (item:any) => {
              return item.key === dragKey;
            });

            methods.onClick(dragKey, nodeData);
          }
        });
      });
    },
    async onSortByChildrenAndParentId(children: any[], parentId: number, dragKey:Key) { // 拖拽排序
      await reorderTntModule({ items: children, parentId: parentId });
      methods.getTreeData(appId, tntInstId, dragKey);
    }
  });

  // 影响table组件应当只有数据源
  const MemoTaButtonTable = useMemo(() => {
    return (<ButtonTable
      form={buttonTableForm}
      treeData={treeData}
      successCallback={methods.editCallback}
      cancelCallback={() => setEditForm(false)}
    />);
  }, [treeData]);


  useEffect(() => {
    methods.getTreeData(appId, tntInstId);
  }, []);


  return (
    <>
      <Row gutter={16} >
        <Col span={6}>
          <div className={styles.breadcrumb}>
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to={`/tenant/detail?id=${tntInstId}`}>租户管理详情</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>租户详情</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <Spin tip='数据加载中...' spinning={loading}>
            <Row>
              <Col flex={1}>
                <MenuTree
                  data={treeData as any}
                  selectedKey={selectedKey}
                  setSelectedkey={setSelectedkey}
                  onClick={methods.onClick}
                  onSortByChildrenAndParentId={methods.onSortByChildrenAndParentId}
                  // onAction={onAction}
                />
              </Col>
            </Row>
          </Spin>
        </Col>
        <Col span={18}>
          {showEditForm && MemoTaButtonTable}
        </Col>
      </Row>
    </>
  );
};

export default MenuManager;



