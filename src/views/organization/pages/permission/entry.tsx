/* eslint-disable react-hooks/exhaustive-deps */
/* 权限管理 */
import React, { FC, useEffect, useState, useMemo, memo, Key, useRef } from 'react';
import { Typography, message, Steps, Spin, Alert } from 'antd';
import { roleList, modifyPermission } from '@/common/api/role';
import { getKeys } from '@/common/utils/ways';
import {
  moduleFindByAppId,
  moduleFindByModuleIds,
  dataPermission,
  getAuthorizedInfoByRoleInfo
} from '@/common/api/permission';
import { PermissionProps, CheckKeysProps, ModuleList, PermissionList } from './ts-config';
import cs from 'classnames';
import styles from './entry.module.less';
import IconFont from '@/common/components/IconFont';
import PermissionTree from './components/PermissionTree';
import OperatePermission from './components/OperatePermission';
import PermissionData from './components/PermissionData';

const { Title, Text } = Typography;

const DefaultSteps = [{ title: '菜单权限' }, { title: '按钮权限' }, { title: '数据权限' }, { title: '选择角色' }];

// 树添加icon以及唯一的key
export function dealWithTree(dataSource: any[], childName = 'children', isCover: boolean = true) {
  for (let i = 0; i < dataSource.length; i++) {
    const item = dataSource[i];
    // 是否是按钮权限类型，只有按钮权限列表时才会有permissions字段
    const isPermissions = item.permissions && Array.isArray(item.permissions);
    // 给不属于权限列表的元素拼接唯一的key，权限按钮直接用id
    dataSource[i].key = !item.children ? item.id : `${item.encode}-${item.id}`;
    // 给节点添加icon
    if (item.icon) {
      item.icon = <IconFont iconHref={item.icon} />;
    }
    // 给标题添加说明展示
    if (item.desc) {
      item.name = <Text style={{ maxWidth: 600 }} ellipsis={{ tooltip: `${item.name} （${item.desc}）` }}> {`${item.name} （${item.desc}）`
      }</Text >;
    }
    if (isPermissions) {
      if (item.permissions.length) {
        // 有数据时
        if (isCover) {
          dataSource[i].children = item.permissions;
        } else {
          dataSource[i].children = dataSource[i].children.concat(item.permissions);
        }
      } else {
        // 没有按钮权限时，禁用该复选框
        dataSource[i].disabled = true;
      }
    }
    if (item[childName] && item[childName].length) {
      dealWithTree(item[childName], childName, isCover);
    }
  }
  return dataSource;
}

const PermissionManage: FC<PermissionProps> = memo(({ roleId, onClose }) => {
  // 当前步骤
  const [current, setCurrent] = useState<number>(0);
  const [steps, setSteps] = useState<any[]>(DefaultSteps);
  // 展开节点
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  // 菜单权限中的已选中的父节点的id
  const [data, setData] = useState<{ treeData: any[]; loading: boolean }>({
    treeData: [], // 树数据
    loading: true, // 加载
  });
  // 各步骤中选中的节点
  const [checkedKeys, setCheckedKeys] = useState<CheckKeysProps>({
    moduleIds: null, // 菜单权限
    permissionIds: [], // 按钮权限
    roleIds: [], // 选择角色,
    halfCheckedKeys: [],
    scope: 0,
  });
  // 各步骤下的数据源
  const [dataOrigin, setDataOrigin] = useState<any>({
    menuData: [], // 菜单权限 列表数据
    btnsData: [], // 按钮权限 列表数据
    dataSelf: [], // 数据权限 列表数据
    roleData: [], // 角色列表  列表数据
  });

  const treeMap = useRef(new Map());

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
    const keys = getKeys(data.treeData, [], treeFilenames.key, treeFilenames.children, true);
    return keys;
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
        loadPermissionDataTree();
        break;
      case 3:
        loadRoleList();
        break;
      // default:
      //   loadRoleList();
      //   break;
    }
  }, [current]);

  // 步骤改变
  const changeStep = (type: string) => {
    setData({ loading: true, treeData: [] });
    setCurrent(type === 'next' ? current + 1 : current - 1);
  };

  // 筛选出树的所有父节点
  const filterParentById = (tree) => {
    for (let i = 0; i < tree.length; i++) {
      const { id, children } = tree[i];
      if (!treeMap.current.has(id)) {
        if (children.length) {
          treeMap.current.set(id, id);
        }
      }
      if (children.length) {
        filterParentById(children);
      }
    }
  };

  // 请求菜单权限树
  const loadPermissionTree = async () => {
    moduleFindByAppId({ roleId }).then((moduleList: ModuleList[]) => {
      setData({ loading: false, treeData: dealWithTree(moduleList, 'children') });
      setDataOrigin((state) => ({ ...state, menuData: moduleList }));
      getInfo(moduleList);
    });
  };

  // 获取角色授权信息
  const getInfo = async (moduleList: any) => {

    // 权限管理不需要数据回显
    if (!roleId) {
      return;
    }
    const { moduleIds, permissionIds, scope } = await getAuthorizedInfoByRoleInfo({ roleId });
    filterParentById(moduleList);
    const newModuleIds: any = [];
    const halfCheckedKeys: any = [];
    for (let i = 0; i < moduleIds.length; i++) {
      if (!treeMap.current.has(moduleIds[i])) {
        newModuleIds.push(moduleIds[i] as any);
      } else {
        halfCheckedKeys.push(moduleIds[i] as any);
      }
    }

    // 数据第一次加载
    if (!checkedKeys.moduleIds) {
      setCheckedKeys({ ...checkedKeys, scope, moduleIds: newModuleIds, permissionIds: permissionIds, halfCheckedKeys });
      return;
    }

  };

  // 请求按钮权限树
  const loadPermissionButtonTree = () => {
    if (!((checkedKeys.moduleIds || []).concat(checkedKeys.halfCheckedKeys as any)).length) {
      setData({ loading: false, treeData: [] });
      return;
    }
    moduleFindByModuleIds({
      roleId,
      // appId,
      // 半选需要传父级节点
      moduleIds: (checkedKeys.moduleIds || []).concat(checkedKeys.halfCheckedKeys as any),
    }).then((moduleList: PermissionList[]) => {
      const addTreeKeyList = dealWithTree(moduleList || [], 'children', false);
      setData({ loading: false, treeData: addTreeKeyList });
      setDataOrigin({ ...dataOrigin, permissonData: addTreeKeyList });
      // @ts-ignore
    });
  };

  // 请求数据权限接口
  const loadPermissionDataTree = async () => {
    const scopeList = await dataPermission({ roleId });
    // setCheckedKeys({ ...checkedKeys });
    setData({ loading: false, treeData: scopeList });
    setDataOrigin((state) => ({ ...state, dataSelf: scopeList }));
  };

  // 请求角色列表
  const loadRoleList = async () => {
    const result = await roleList();
    setData({ loading: false, treeData: result.objectList || [] });
    setDataOrigin((state) => ({ ...state, roleData: result.objectList }));
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
  const changeCheckKeys = (type: string, keys?: number[], halfCheckedKeys?: number[]) => {
    const checkKeys = typeCheckKeys(type, keys);
    switch (current) {
      case 0:
        setCheckedKeys({ ...checkedKeys, moduleIds: checkKeys, halfCheckedKeys });
        break;
      case 1:
        setCheckedKeys({ ...checkedKeys, permissionIds: checkKeys });
        break;
      case 2:
        setCheckedKeys({ ...checkedKeys, scope: checkKeys[0] });
        break;
      case 3:
        setCheckedKeys({ ...checkedKeys, roleIds: checkKeys });
        break;
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

  function showTips() {
    // 有数据时
    if (Array.isArray(data.treeData) && data.treeData.length) {
      return null;
    } else if (current !== 1) {
      return null;
    }
    return <Alert message='未选择菜单权限会导致按钮权限下暂无数据' type='warning' />;
  }

  // 组装每一步列表的appId及ids
  function findAppIds(data: any[]) {
    const config: any = {};
    data.forEach((item) => {
      const appId = item.appId;
      const currentId = item.id;
      const childIds = [currentId].concat(getKeys(item.children, [], 'id', 'children', true));
      if (appId in config) {
        // 如果当前appId已存在
        config[appId] = config[appId].concat(childIds);
      } else {
        config[appId] = childIds;
      }
    });
    return config;
  }

  // 确定
  const onOk = () => {
    const params: { roleIds: Key[]; permissions: any[]; scope: Key | undefined } = {
      roleIds: roleId ? [roleId] : checkedKeys.roleIds,
      permissions: [],
      scope: checkedKeys.scope,
    };
    if (!params.scope) {
      message.warning('请选择数据权限');
      return;
    }
    if (!params.roleIds.length) {
      message.warning('请选择角色');
      return;
    }
    // 选中的菜单权限ID
    const moduleIds = (checkedKeys.moduleIds as any).concat(checkedKeys.halfCheckedKeys as any);
    // 选中的权限ID
    const permissionIds = checkedKeys.permissionIds.filter((item) => typeof item === 'number');
    // 菜单权限列表根据appId区分开来的对象 key为appId value为该appId下的菜单id数组
    const moduleAppId: any = findAppIds(dataOrigin.menuData);
    // 按钮权限列表根据appId区分开来的对象 key为appId value为该appId下的按钮id数组
    // const permissionAppIds: any = findAppIds(dataOrigin.btnsData);

    // 按钮权限的节点appId一定属于菜单权限Id，所以此处只需遍历菜单权限，组成按照appId区分开来的新的数组
    const permissions: any[] = [];
    for (const key in moduleAppId) {
      if (Object.prototype.hasOwnProperty.call(moduleAppId, key)) {
        const appModulesId = moduleAppId[key];
        // 当前appId下的id数组与已选中的id的交集，则为当前appId下的选中id数组
        const sameModulesKeys = appModulesId.filter(id => moduleIds.includes(id));
        // console.log(appModulesId, '6666677');
        // const sameBtnsKeys = gatherMethods(permissionAppIds[key] || [], permissionIds, 1);
        permissions.push({
          appId: Number(key),
          moduleIds: sameModulesKeys,
          permissionIds,
        });
      }
    }
    params.permissions = permissions;

    // https://yapi.lanhanba.com/project/289/interface/api/33203
    // post('/role/updateModulesAndPermissions', params, true).then(() => {
    modifyPermission(params).then(() => {
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
          nextDisabled={current === 2 && !checkedKeys.scope}
          dropdownDisabled={current === 2}
        />
      </div>
      <Steps type='navigation' current={current} items={steps} />
      <Spin spinning={data.loading}>
        <div className={styles.treeWrap}>
          {current === 2 ? (
            <PermissionData
              treeData={data.treeData}
              checkedKeys={[checkedKeys.scope]}
              changeCheckKeys={changeCheckKeys}
            />
          ) : (
            <>
              {showTips()}
              <PermissionTree
                treeData={data.treeData}
                expandedKeys={expandedKeys}
                changeExpandedKeys={setExpandedKeys}
                checkedKeys={checkCurrent as any}
                changeCheckedKeys={changeCheckKeys}
                fieldNames={treeFilenames}
              />
            </>
          )}
        </div>
      </Spin>
    </div>
  );
});

export default PermissionManage;
