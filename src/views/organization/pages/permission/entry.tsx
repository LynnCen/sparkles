/* eslint-disable react-hooks/exhaustive-deps */
/* 权限管理 */
import React, { FC, useEffect, useState, useMemo, memo, Key } from 'react';
import { Typography, message, Steps, Spin } from 'antd';
import IconFont from '@/common/components/IconFont';
import { roleList } from '@/common/api/role';
import PermissionTree from './components/PermissionTree';
import OperatePermission from './components/OperatePermission';
import { post } from '@/common/request';
import { getKeys } from '@/common/utils/ways';
import { gatherMethods } from '@lhb/func';
import cs from 'classnames';
import { moduleFindByAppId, moduleFindByModuleIds } from '@/common/api/permission';
import { PermissionProps, CheckKeysProps, AppMenuResult, AppBtnPermissionResult } from './ts-config';
import styles from './entry.module.less';
import PermissionData from './components/PermissionData';

const { Title } = Typography;
const { Step } = Steps;

const DefaultSteps = ['菜单权限', '按钮权限', '数据权限', '选择角色'];

// 树添加icon以及唯一的key
export function dealWithTree(dataSource: any[], childName = 'children') {
  for (let i = 0; i < dataSource.length; i++) {
    const item = dataSource[i];
    const isPermissions = item.permissions && Array.isArray(item.permissions);
    // 给不属于权限列表的元素拼接唯一的key，权限按钮直接用id
    dataSource[i].key = !item.children ? item.id : `${item.encode}-${item.id}`;
    // 给节点添加icon
    if (item.icon) {
      item.icon = <IconFont iconHref={item.icon} />;
    }
    if (isPermissions && item.permissions.length) {
      dataSource[i].children = item.permissions;
    }
    // 没有子节点且没有权限按钮的添加禁选状态
    if (Array.isArray(item.children) && !dataSource[i].children.length && isPermissions) {
      dataSource[i].disabled = true;
    }
    if (item[childName] && item[childName].length) {
      dealWithTree(item[childName], childName);
    }
  }
  return dataSource;
}

const PermissionManage: FC<PermissionProps> = memo(({ roleId, appId = 3, onClose }) => {
  // 当前步骤
  const [current, setCurrent] = useState<number>(0);
  const [steps, setSteps] = useState<string[]>(DefaultSteps);
  // 展开节点
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  // 已选中的父节点的id
  const [parentsKeys, setParentKeys] = useState<React.Key[]>([]);
  const [data, setData] = useState<{ treeData: any[]; loading: boolean }>({
    treeData: [], // 树数据
    loading: true, // 加载
  });
  // 选中的节点
  const [checkedKeys, setCheckedKeys] = useState<CheckKeysProps>({
    moduleIds: [], // 菜单权限
    permissionIds: [], // 按钮权限
    roleIds: [], // 选择角色,
  });

  const [roleScope, setRoleScope] = useState<any>();

  // 当前所在步数选中的keys
  const checkCurrent = useMemo(() => {
    if (current === 0) return checkedKeys.moduleIds;
    if (current === 1) return checkedKeys.permissionIds;
    return checkedKeys.roleIds;
  }, [current, checkedKeys]);

  // 当前所在步tree需要的filenames
  const treeFilenames = useMemo(() => {
    if (current === 1) return { title: 'name', key: 'key', children: 'children' };
    return { title: 'name', key: 'id', children: 'children' };
  }, [current]);

  // 所有的key，可用于全部勾选/选中所有操作
  const allKeys = useMemo(() => {
    if (!data.treeData.length) return [];
    return getKeys(data.treeData, [], treeFilenames.key, treeFilenames.children, true);
  }, [treeFilenames.key, data.treeData]);

  // allKeys变更的时候重新set
  useEffect(() => {
    setExpandedKeys(allKeys);
  }, [allKeys]);

  useEffect(() => {
    roleId && setSteps(DefaultSteps.slice(0, 3));
  }, [roleId]);

  // 步骤变化请求对应的接口
  useEffect(() => {
    switch (current) {
      case 0:
        loadPermissionTree();
        break;
      case 1:
        loadPermissionButtonTree();
        break;
      case 2:
        loadDataList();
        break;
      default:
        loadRoleList();
        break;
    }
  }, [current]);

  // 步骤改变
  const changeStep = (type: string) => {
    setData({ loading: true, treeData: [] });
    setCurrent(type === 'next' ? current + 1 : current - 1);
  };

  // 请求菜单权限树
  const loadPermissionTree = async () => {
    moduleFindByAppId({ appId, roleId }).then(({ moduleList = [], roleInfo = {} }: AppMenuResult) => {
      const allParentKeys = getKeys(moduleList, [], 'id', 'children');
      const moduleIdList = roleInfo?.moduleIdList || [];
      // 获取已选中的父节点
      const parentKeys = gatherMethods(moduleIdList, allParentKeys, 1);
      // 过滤已选中的节点中的父节点id
      const childrenKeys = gatherMethods(moduleIdList, parentKeys, 2);
      if (!checkedKeys.moduleIds.length) {
        setCheckedKeys({ ...checkedKeys, moduleIds: childrenKeys || [] });
        setParentKeys(parentKeys);
      }
      setData({ loading: false, treeData: dealWithTree(moduleList, 'children') });
    });
  };

  // 请求按钮权限树
  const loadPermissionButtonTree = async () => {
    setCheckedKeys({ ...checkedKeys, permissionIds: [] }); // 先清空选中按钮，否则tree会warn
    moduleFindByModuleIds({
      roleId,
      appId,
      // 半选需要传父级节点
      moduleIds: checkedKeys.moduleIds.length ? gatherMethods(checkedKeys.moduleIds, parentsKeys) : [],
    }).then(({ moduleList = [], roleInfo = {} }: AppBtnPermissionResult) => {
      const addTreeKeyList = dealWithTree(moduleList || [], 'children');
      const allKeys = getKeys(addTreeKeyList, [], 'key', 'children', true);
      setData({ loading: false, treeData: addTreeKeyList });
      // permissionIds取已选中和当前列表的交集
      const sameKeys = gatherMethods(roleInfo?.permissionIdList || [], allKeys, 1);
      setCheckedKeys({ ...checkedKeys, permissionIds: sameKeys });
    });
  };

  // 请求数据权限列表
  const loadDataList = async () => {
    const result = await roleList();
    setData({ loading: false, treeData: result.objectList || [] });
  };

  // 请求角色列表
  const loadRoleList = async () => {
    const result = await roleList({ size: 100 });
    setData({ loading: false, treeData: result.objectList || [] });
  };

  const typeCheckKeys = (type: string, keys?: number[]) => {
    switch (type) {
      case 'checkAll':
        return allKeys;
      case 'cancelCheck':
        return [];
      default:
        return keys || [];
    }
  };

  // 更改选中的id
  const changeCheckKeys = (type: string, keys?: number[]) => {
    const checkKeys = typeCheckKeys(type, keys);
    switch (current) {
      case 0:
        setCheckedKeys({ ...checkedKeys, moduleIds: checkKeys });
        break;
      case 1:
        setCheckedKeys({ ...checkedKeys, permissionIds: checkKeys });
        break;
      default:
        setCheckedKeys({ ...checkedKeys, roleIds: checkKeys });
        break;
    }
  };

  // 半选父节点id-只在菜单权限需要
  const changeHalfParentIds = (keys: Key[]) => {
    if (current === 0) {
      setParentKeys(keys);
    }
  };
  // 展开所有/收起所有
  const expendKeys = (type: string) => {
    switch (type) {
      case 'expendAll':
        setExpandedKeys(allKeys);
        break;
      case 'foldAll':
        setExpandedKeys([]);
        break;
      default:
        break;
    }
  };

  // 确定
  const onOk = () => {
    const params: any = {
      appId: 3,
      roleId,
      roleIds: roleId ? [roleId] : checkedKeys.roleIds,
      moduleIds: checkedKeys.moduleIds.length ? gatherMethods(checkedKeys.moduleIds, parentsKeys) : [],
      permissionIds: checkedKeys.permissionIds.filter((item) => typeof item === 'number'), // 这里过滤的原因是分不清是按钮还是子菜单（子菜单是encode-id为key， 按钮是id）
    };
    roleScope && (params.scope = roleScope);

    if (!params.roleIds.length) {
      message.warning('请选择角色');
      return;
    }
    // http://yapi.lanhanba.com/project/289/interface/api/33203
    post('/role/updateModulesAndPermissions', params, true).then(() => {
      if (roleId) {
        message.success('角色权限修改成功');
        onClose && onClose();
      } else {
        message.success('权限设置成功');
        setCheckedKeys({ moduleIds: [], permissionIds: [], roleIds: [] });
        setCurrent(0);
      }
    });
  };

  return (
    <div className={styles.container}>
      <div className={cs(styles.title, roleId && styles.rolePermission)}>
        {roleId ? null : <Title level={4}>权限批量设置</Title>}
        <OperatePermission
          treeData={data.treeData}
          changeCheckKeys={changeCheckKeys}
          expendKeys={expendKeys}
          steps={steps.length}
          current={current}
          changeStep={changeStep}
          onOk={onOk}
        />
      </div>
      <Steps type='navigation' current={current}>
        {steps.map((item) => (
          <Step key={item} title={item} />
        ))}
      </Steps>
      <Spin spinning={data.loading}>
        <div className={styles.treeWrap}>
          {current === 2 ? (
            <PermissionData roleId={roleId} setRoleScope={setRoleScope} />
          ) : (
            <PermissionTree
              treeData={data.treeData}
              expandedKeys={expandedKeys}
              changeExpandedKeys={setExpandedKeys}
              checkedKeys={checkCurrent}
              changeCheckedKeys={changeCheckKeys}
              fieldNames={treeFilenames}
              changeHalfParentIds={changeHalfParentIds}
            />
          )}
        </div>
      </Spin>
    </div>
  );
});

export default PermissionManage;
