/* eslint-disable react-hooks/exhaustive-deps */
/* 用户管理 */
import { FC, useEffect, useState, useMemo } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import V2Container from '@/common/components/Data/V2Container';
import Empty from '@/common/components/Empty';
import Filter from './components/Filter';
import LeftTree from './components/LeftTree';
import UserTable from './components/UserTable';
import UserInfoOperate from './components/UserInfoOperate';
import { departmentList } from '@/common/api/department';
import { userList } from '@/common/api/brief';
import { DepartMentResult } from '@/views/organization/pages/department/ts-config';
import { UserProps, UserListResult, UserModalValuesProps } from './ts-config';
import styles from './entry.module.less';
import { useMethods } from '@lhb/hook';
import { refactorPermissions } from '@lhb/func';
import BatchUpdateModal from './components/BatchUpdateModal';
import V2Operate from '@/common/components/Others/V2Operate';
import { bigdataBtn } from '@/common/utils/bigdata';

const UserManage: FC<UserProps> = () => {
  const [params, setParams] = useState<any>({});
  const [data, setData] = useState<{ treeData: any[]; loading: boolean }>({ treeData: [], loading: true });
  const [operateUser, setOperateUser] = useState<UserModalValuesProps>({
    visible: false,
    department: [],
  });
  const [showImportModal, setShowImportModal] = useState<boolean>(false); // 是否显示导入弹窗
  // 操作按钮
  const [operateExtra, setOperateExtra] = useState<any>([]);
  const operateList: any = useMemo(() => {
    const list = refactorPermissions(operateExtra);
    return list.map((item) => {
      const res: any = {
        name: item.text,
        event: item.event,
        func: item.func,
        type: item.isBatch ? 'default' : 'primary',
      };
      if (item.event === 'create') {
        res.icon = <PlusOutlined />;
      }
      return res;
    });
  }, [operateExtra]);

  useEffect(() => {
    loadDepartMent();
  }, []);

  // 查询/重置
  const onSearch = (filter: any = {}) => {
    const { keyword } = filter;
    if (keyword) {
      setParams({ ...params, ...filter, departmentIds: null });
      return;
    }
    setParams({ ...params, ...filter });
  };

  const { ...methods } = useMethods({
    // 新建
    handleCreate(values: any) {
      bigdataBtn('a2071f30-4abe-4057-84e1-fb06bde9f2e9', '用户管理', '新建', '点击了新建用户');
      showOperateModal({ visible: true, departmentId: values?.departmentIds?.[0] });
    },

    // 批量更新
    handleBatchUpdate() {
      setShowImportModal(true);
    }
  });

  const showOperateModal = (values?: any) => {
    setOperateUser({ ...values, department: data.treeData });
  };

  // 获取部门列表
  const loadDepartMent = async () => {
    const { objectList = [] }: DepartMentResult = await departmentList();
    setData({ treeData: objectList, loading: false });
  };

  // 接口请求-获取当前部门下的用户
  const loadData = async (params: any) => {
    // 0229去掉部门限制
    // if (params.departmentIds !== 0 && !params.departmentIds) return { dataSource: [], count: 0 };
    const result: UserListResult = await userList(params);
    if (!operateList.length) {
      setOperateExtra(result?.meta?.permissions || []);
    }
    return {
      dataSource: result.objectList,
      count: result.totalNum,
    };
  };

  // 选中节点
  const onSelect = (selectedKeys: number | string[]) => {
    onSearch({ departmentIds: selectedKeys });
  };

  return (
    <Spin spinning={data.loading} wrapperClassName={styles.wrapLoading}>
      <V2Container
        // 上下padding各16px container内部padding上下padding各0px 标题height 48px
        style={{ height: 'calc(100vh - 32px - 48px)' }}
      >
        <div className={styles.container}>
          {data.treeData.length ? (
            <>
              <LeftTree treeData={data.treeData} onSelect={onSelect} />
              <div className={styles.content}>
                <Filter onSearch={onSearch} />
                <div className={styles.tableWrap}>

                  <div className={styles.btnList}>
                    <V2Operate operateList={operateList} onClick={(btn) => methods[btn.func](params)} />

                    {/* TODO: */}
                    {/* <Button type='primary' onClick={() => setShowImportModal(true)}>批量更新</Button> */}
                  </div>

                  <UserTable
                    onSearch={onSearch}
                    params={params}
                    loadData={loadData}
                    showOperateModal={showOperateModal}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className={styles.emptyContent}>
              <Empty description='请先新建部门' />
            </div>
          )}

          <UserInfoOperate setOperateUser={setOperateUser} operateUser={operateUser} onSearch={onSearch} />

          <BatchUpdateModal
            showImportModal={showImportModal}
            setShowImportModal={setShowImportModal}
            refresh={() => setParams({})}
          />
        </div>
      </V2Container>
    </Spin>
  );
};

export default UserManage;
