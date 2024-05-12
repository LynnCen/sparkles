/* 角色管理 */
import { FC, useState, useMemo } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import Operate from '@/common/components/Operate';
import Filter from './components/Filter';
import RoleTable from './components/RoleTable';
import RoleOperate from './components/Modal/RoleOperate';
import { roleList } from '@/common/api/role';
import { RoleModalValuesProps, RoleProps } from './ts-config';
import styles from './entry.module.less';
import { KeepAlive } from 'react-activation';
import { refactorPermissions } from '@lhb/func';

const RoleManage: FC<RoleProps> = () => {
  const [params, setParams] = useState<any>({});
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
        res.icon = <PlusOutlined />;
        res.onClick = () => addNewRole();
      }
      return res;
    });
  }, [operateExtra]);

  // 查询/重置/搜索
  const onSearch = (filter?: any) => {
    setParams({ ...params, ...filter });
  };

  const addNewRole = () => {
    setOperateRole({ visible: true });
  };

  // 接口请求
  const loadData = async (params: any) => {
    const result = await roleList(params);
    if (!operateList.length) {
      setOperateExtra(result?.meta?.permissions || []);
    }
    return {
      dataSource: result.objectList || [],
      count: result.totalNum,
    };
  };

  return (
    <KeepAlive saveScrollPosition>
      <div className={styles.container}>
        <Filter onSearch={onSearch} />
        <div className={styles.contentWrap}>
          <Operate operateList={operateList} />
          <RoleTable onSearch={onSearch} params={params} loadData={loadData} setOperateRole={setOperateRole} />
        </div>
        <RoleOperate setOperateRole={setOperateRole} operateRole={operateRole} onSearch={onSearch} />
      </div>
    </KeepAlive>
  );
};

export default RoleManage;
