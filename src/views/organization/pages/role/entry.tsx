/* 角色管理 */
import { FC, useState, useMemo, useEffect } from 'react';
import Operate from '@/common/components/Operate';
import Filter from './components/Filter';
import RoleTable from './components/RoleTable';
import RoleOperate from './components/Modal/RoleOperate';
import { roleList } from '@/common/api/role';
import { departmentList } from '@/common/api/department';
import { positionList } from '@/common/api/position';
import { RoleModalValuesProps, RoleProps } from './ts-config';
import styles from './entry.module.less';
import V2Container from '@/common/components/Data/V2Container';
import { isArray, refactorPermissions } from '@lhb/func';
import { bigdataBtn } from '@/common/utils/bigdata';
import PageTitle from '@/common/components/business/PageTitle';

const RoleManage: FC<RoleProps> = () => {
  const [mainHeight, setMainHeight] = useState<number>(0);
  const [params, setParams] = useState<any>({
    size: 150,
  });
  const [roleListData, setRoleListData] = useState<any[]>([]); // 角色列表数据
  const [operateRole, setOperateRole] = useState<RoleModalValuesProps>({
    visible: false,
  });

  // 操作按钮
  const [operateExtra, setOperateExtra] = useState<any>([]);
  const operateList: any = useMemo(() => {
    const list = refactorPermissions(operateExtra);
    return list.map((item) => {
      const res: any = {
        name: item.text,
        type: item.isBatch ? 'default' : 'primary',
      };
      if (item.event === 'create') {
        // res.icon = <PlusOutlined />;//ui西亚要求去掉
        res.onClick = () => addNewRole();
      }
      return res;
    });
  }, [operateExtra]);
  const [departmentListData, setDepartmentListData] = useState<any[]>([]); // 部门列表
  const [postListData, setPostListData] = useState<any[]>([]); // 岗位列表

  useEffect(() => {
    if (!roleListData?.length) return; // 角色列表数据未请求完成
    if (departmentListData?.length && postListData?.length) return; // 已经获取过数据
    loadSelectionData();
  }, [roleListData]);

  // 查询/重置/搜索
  const onSearch = (filter?: any) => {
    setParams({ ...params, ...filter });
  };

  const addNewRole = () => {
    bigdataBtn('f102728e-ca2a-44d7-bde7-8533967dd1f5', '角色管理', '新建', '点击了新建角色');
    setOperateRole({ visible: true });
  };

  // 接口请求
  const loadData = async (params: any) => {
    const result = await roleList(params);
    setRoleListData(isArray(result?.objectList) ? result?.objectList : []);
    if (!operateList.length) {
      setOperateExtra(result?.meta?.permissions || []);
    }
    return {
      dataSource: result.objectList || [],
    };
  };
  // 获取部门列表数据和岗位列表数据
  const loadSelectionData = () => {
    // 部门列表
    departmentList().then(({ objectList }: any) => {
      setDepartmentListData(isArray(objectList) ? objectList : []);
    });
    // 岗位列表
    positionList().then(({ objectList }: any) => {
      setPostListData(isArray(objectList) ? objectList : []);
    });
  };

  return (
    <div className={styles.container}>
      <V2Container
        style={{ height: 'calc(100vh - 120px) ' }}
        emitMainHeight={(h) => setMainHeight(h)}
        extraContent={{
          top: (
            <>
              <PageTitle content='角色管理' extra={<Operate operateList={operateList} />}/>
              <Filter onSearch={onSearch} />
            </>
          ),
        }}
      >
        <div className={styles.contentWrap}>
          {/* <Operate operateList={operateList} /> */}
          <RoleTable
            onSearch={onSearch}
            params={params}
            departmentListData={departmentListData}
            postListData={postListData}
            loadData={loadData}
            setOperateRole={setOperateRole}
            mainHeight={mainHeight}
          />
        </div>
      </V2Container>

      <RoleOperate setOperateRole={setOperateRole} operateRole={operateRole} onSearch={onSearch} />
    </div>
  );
};

export default RoleManage;
