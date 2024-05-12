/* 部门管理 */
import { FC, useState, useMemo } from 'react';
import Operate from '@/common/components/Operate';
// import { PlusOutlined } from '@ant-design/icons';
import Filter from './components/Filters';
import DepartmentTable from './components/DepartmentTable';
import DepartmentInfo from './components/Modal/DepartmentInfo';
import { departmentList } from '@/common/api/department';
import { DepartmentModalValuesProps, DepartmentProps, DepartMentResult, FilterParams } from './ts-config';
import styles from './entry.module.less';
import V2Container from '@/common/components/Data/V2Container';
import { refactorPermissions } from '@lhb/func';
import { bigdataBtn } from '@/common/utils/bigdata';
import PageTitle from '@/common/components/business/PageTitle';

const Department: FC<DepartmentProps> = () => {
  const [mainHeight, setMainHeight] = useState<number>(0);
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
        // res.icon = <PlusOutlined />;//ui西亚要求拿掉
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
    bigdataBtn('ef0f9f75-8175-46db-9db2-971f631b8522', '部门管理', '新建', '点击了新建部门');
    setOperateDepartment({ visible: true });
  };

  // 递归遍历，把children为空数组[]的数据置为null
  const updateChildrenToNull = (data) => {
    data.forEach((item) => {
      if (item.children.length === 0) {
        item.children = null;
      } else {
        updateChildrenToNull(item.children);
      }
    });
  };

  // 请求部门列表
  const loadData = async (params: any) => {
    const { objectList, meta }: DepartMentResult = await departmentList(params);
    if (!operateList.length) {
      setOperateExtra(meta.permissions);
    }
    updateChildrenToNull(objectList);
    return { dataSource: objectList || [] };
  };

  return (
    <div className={styles.container}>
      <V2Container
        style={{ height: 'calc(100vh - 140px) ' }}
        emitMainHeight={(h) => setMainHeight(h)}
        extraContent={{
          top: (
            <>
              <PageTitle content='部门管理' extra={<Operate operateList={operateList} />}/>
              <Filter onSearch={onSearch} />
            </>
          ),
        }}
      >
        <div className={styles.content}>
          {/* <Operate operateList={operateList} /> */}
          <DepartmentTable
            params={params}
            onSearch={onSearch}
            loadData={loadData}
            setOperateDepartment={setOperateDepartment}
            mainHeight={mainHeight}
          />
        </div>
      </V2Container>

      <DepartmentInfo
        operateDepartMent={operateDepartMent}
        setOperateDepartment={setOperateDepartment}
        onSearch={onSearch}
      />
    </div>
  );
};

export default Department;
