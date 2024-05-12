/* 部门管理 */
import { FC, useState, useMemo } from 'react';
import Operate from '@/common/components/Operate';
import { PlusOutlined } from '@ant-design/icons';
import Filter from './components/Filters';
import DepartmentTable from './components/DepartmentTable';
import DepartmentInfo from './components/Modal/DepartmentInfo';
import { departmentList } from '@/common/api/department';
import { DepartmentModalValuesProps, DepartmentProps, DepartMentResult, FilterParams } from './ts-config';
import styles from './entry.module.less';
import { KeepAlive } from 'react-activation';
import { refactorPermissions } from '@lhb/func';

const Department: FC<DepartmentProps> = () => {
  const [operateDepartMent, setOperateDepartment] = useState<DepartmentModalValuesProps>({
    visible: false,
  });
  const [params, setParams] = useState<FilterParams>({});
  // 操作按钮
  const [operateExtra, setOperateExtra] = useState<any[]>([]);
  const operateList: any = useMemo(() => {
    const list = refactorPermissions(operateExtra);
    return list.map((item) => {
      const res: any = {
        name: item.text,
        type: item.isBatch ? 'default' : 'primary',
      };
      if (item.event === 'create') {
        res.icon = <PlusOutlined />;
        res.onClick = () => addNewDepartment();
      }
      return res;
    });
  }, [operateExtra]);

  const onSearch = (filter?: any) => {
    setParams({ ...params, ...filter });
  };

  // 新建
  const addNewDepartment = () => {
    setOperateDepartment({ visible: true });
  };

  // 请求部门列表
  const loadData = async (params: any) => {
    const { objectList, meta }: DepartMentResult = await departmentList(params);
    if (!operateList.length) {
      setOperateExtra(meta.permissions);
    }
    return { dataSource: objectList || [] };
  };

  return (
    <KeepAlive saveScrollPosition>
      <div className={styles.container}>
        <Filter onSearch={onSearch} />
        <div className={styles.content}>
          <Operate operateList={operateList} />
          <DepartmentTable
            params={params}
            onSearch={onSearch}
            loadData={loadData}
            setOperateDepartment={setOperateDepartment}
          />
        </div>
        <DepartmentInfo
          operateDepartMent={operateDepartMent}
          setOperateDepartment={setOperateDepartment}
          onSearch={onSearch}
        />
      </div>
    </KeepAlive>
  );
};

export default Department;
