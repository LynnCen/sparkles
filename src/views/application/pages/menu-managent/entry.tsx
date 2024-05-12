import { ConfirmModal } from '@/common/components/Modal/ConfirmModal';
import IconFont from '@/common/components/IconFont';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Col, Row, Button, Form, Tooltip, message, Spin } from 'antd';
import { FC, Key, useEffect, useState, useMemo } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { menus } from './api';
import { MenuTree, ButtonTable } from './compoments';
import FormInModal from '@/common/components/formInModal';
import { useVisible } from './hooks';
import { menuStore } from './store';
import { MenuData } from './store/menu';
import { useLocation } from 'react-router-dom';
import { } from 'react-router';
import { urlParams } from '@lhb/func';
import V2Form from '@/common/components/Form/V2Form';
import V2FormTextArea from '@/common/components/Form/V2FormTextArea/V2FormTextArea';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormTreeSelect from '@/common/components/Form/V2FormTreeSelect/V2FormTreeSelect';
import V2FormInputNumber from '@/common/components/Form/V2FormInputNumber/V2FormInputNumber';

// menu相关接口
const { getMenusByAppId, deleteMenuNByAppId, reorderMenuByDragIdAndDropId } = menuStore;

const { useForm } = Form;

interface MenuManagentProps {

};

// 后端获取树列表相关
interface TreeNodeData extends MenuData {
  children?: TreeNodeData[];
};

function traverseTree<T>(treeData: T, selected: boolean): any {
  if (!Array.isArray(treeData)) {
    return null;
  };

  return treeData.map(treeNodeData => {
    const { name, id, children, icon, parent, ...restTreeNodeData } = treeNodeData;
    return {
      ...restTreeNodeData,
      title: name,
      key: id,
      // 冗余id方便树形选择器处理
      value: id,
      parentId: parent ? parent.id : null,
      icon: <IconFont iconHref={icon} />,
      iconHref: icon,
      children: traverseTree(children, selected),
    };
  });
}

const MenuManagent: FC<MenuManagentProps> = () => {
  const [treeData, setTreeData] = useState<TreeNodeData[]>([]);
  const { visible, onHidden, onShow, } = useVisible(false);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isAdd, setIsAdd] = useState<boolean>(true);
  const [form] = useForm();
  const { search } = useLocation();
  const { appId } = urlParams(search) as any as { appId: number };

  const getTreeData = async (appId: number) => {
    setLoading(true);
    const result = await getMenusByAppId<{ moduleList: TreeNodeData[] }>(appId);
    unstable_batchedUpdates(() => {
      setTreeData(traverseTree(result, true));
      setLoading(false);
    });
  };

  // 新增菜单
  const handleSAddMenuClick = (data) => {
    const { key } = data;
    setIsAdd(true);
    if (key) {
      form.setFieldsValue({ parentId: key });
    }

    onShow();
  };

  // 编辑菜单
  const handleEditMenuClick = (data) => {
    setIsAdd(false);
    const { title, iconHref, parentId } = data;
    form.setFieldsValue({ ...data, name: title, icon: iconHref, parentId: parentId || 0 });
    onShow();
    // todo（编辑接口）
  };

  // 删除菜单
  const handleDeleteMenuClick = (data) => {
    const { key } = data;
    ConfirmModal({
      onSure: async () => {
        const success = await deleteMenuNByAppId(key);
        if (success) {
          message.success('删除成功');
          getTreeData(appId);
        } else {
          message.error('删除失败');
        }
      }
    });
  };

  // 监听点击树节点触发对应的事件
  const onAction = (type: Key, data: any) => {
    const typeMap = new Map<Key, Function>([
      ['add', handleSAddMenuClick],
      ['edit', handleEditMenuClick],
      ['delete', handleDeleteMenuClick],
    ]);

    const fn = typeMap.get(type);
    fn?.(data);
  };

  // 调用新增或者编辑接口
  const onSubmit = (success: boolean) => {
    if (!success) return;
    message.success(menuId ? '修改成功' : '新增成功');
    getTreeData(appId);
    onHidden();
  };

  // 监听点击节点(获取列表数据)
  const onClick = async (key: Key) => {
    setMenuId(key as string);
  };

  // 影响table组件应当只有数据源
  const MemoTaButtonTable = useMemo(() => {
    return (<ButtonTable
      menuId={menuId}
      treeData={treeData} />);
  }, [menuId, treeData]);

  useEffect(() => {
    getTreeData(appId);
  }, []);

  // 新增一级菜单
  const handleAddRootChildMenuClick = () => {
    onShow();
    setIsAdd(true);
  };

  // 监听拖拽排序
  const onSortByChildrenAndParentId = async (children: any[], parentId: number) => {
    await reorderMenuByDragIdAndDropId(children, parentId);
    getTreeData(appId);
  };

  return (
    <>
      <Row gutter={16} justify='space-around'>
        <Col span={8}>
          <Spin tip='数据加载中...' spinning={loading}>
            <div style={{ display: 'flex' }}>
              <Row>
                <Col flex={1}>
                  <MenuTree
                    data={treeData as any}
                    onClick={onClick}
                    onSortByChildrenAndParentId={onSortByChildrenAndParentId}
                    onAction={onAction} />
                </Col>
                <Col span={6}>
                  <Button type='primary' onClick={handleAddRootChildMenuClick}>新增一级菜单</Button>
                </Col>
              </Row>
            </div>
          </Spin>
        </Col>
        <Col span={16}>
          {!!menuId && MemoTaButtonTable}
        </Col>
      </Row>
      {/** 新增菜单弹窗 */}
      <FormInModal
        visible={visible}
        title={isAdd ? '新增菜单' : '编辑菜单'}
        width={640}
        onSubmit={onSubmit}
        onCancelSubmit={onHidden}
        extraData={{ id: menuId, appId }}
        form={form}
        proxyApi='/mirage'
        url={menus.get(isAdd ? 'add' : 'update')}
      >
        <V2Form>
          <Row gutter={16}>
            <Col span={12}>
              <V2FormInput
                label='菜单名称'
                name='name'
                required />
              <V2FormInput
                label='菜单编码'
                name='encode'
                disabled={!isAdd}
                required />
              <V2FormTreeSelect
                label={(<> <Tooltip title='空代表添加到根结点'>
                  <QuestionCircleOutlined />
                </Tooltip>上级菜单</>)}
                treeData={[{ title: '根菜单', key: 0, value: 0, children: treeData }]}
                name='parentId'
                placeholder='请选择上级菜单' />
              <V2FormTextArea
                label='说明'
                name='desc'
                maxLength={200}
                config={{ showCount: true }}
              />
            </Col>
            <Col span={12}>
              <V2FormInput
                label='ICON图标'
                name='icon' />
              <V2FormInput
                label='URL'
                name='uri'
                required />
              <V2FormInputNumber
                label={(<> <Tooltip title='数字越小越靠前'>
                  <QuestionCircleOutlined />
                </Tooltip>排序</>)}
                name='sortNum'
                precision={0}
                min={0}
                placeholder='请输入'
              />
            </Col>
          </Row>
        </V2Form>
      </FormInModal>
    </>
  );
};

export default MenuManagent;



