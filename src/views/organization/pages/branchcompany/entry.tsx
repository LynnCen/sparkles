/**
 * @Description 分公司管理
 */
import Filter from './components/Filter';
import cs from 'classnames';
import styles from './entry.module.less';
import { useState } from 'react';
import V2Container from '@/common/components/Data/V2Container';
import V2Table from '@/common/components/Data/V2Table';
import { Button, message } from 'antd';
import ExpandTaskModal from './components/Modal/BranchCompanyModal';
import Operate from '@/common/components/Operate';
import { useMethods } from '@lhb/hook';
import { departmentList } from '@/common/api/department';
import { companyDelete, companyList } from '@/common/api/company';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import { recursionEach, refactorPermissions } from '@lhb/func';
import { areaList } from '@/common/api/common';
import PageTitle from '@/common/components/business/PageTitle';

const ExpendTaskMng = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [mainHeight, setMainHeight] = useState<number>(0);
  const [params, setParams] = useState<any>({});
  const [departments, setDepartments] = useState<any>([]);
  const [record, setRecord] = useState<any>({});
  const onSearch = (values?: any) => {
    setParams({ ...values });
  };

  const loadData = async (params) => {
    const departmentResult = await departmentList();
    setDepartments(departmentResult.objectList);
    const areaResult = await areaList({ type: 2 });
    const result: any = await companyList(params);
    if (Array.isArray(result.data)) {
      result.data.forEach((item) => {
        item.departmentNames = queryDepartment(item.departments, departmentResult.objectList);
        item.areaNames = queryAreas(item.areas, areaResult);
      });
    }
    return { dataSource: result.data, count: result?.meta?.total };
  };

  const queryDepartment = (departmentIds, departments) => {
    const names: any = [];
    if (Array.isArray(departmentIds)) {
      recursionEach(departments, 'children', (department) => {
        if (departmentIds.includes(department.id)) {
          names.push(department.name);
        }
      });
    }
    return names.length > 0 ? names.join(',') : '-';
  };

  const queryAreas = (areaIds, areas) => {
    const names: any = [];
    if (Array.isArray(areaIds)) {
      const provinces = areaIds.filter((area) => area.length === 1);
      const cities = areaIds.filter((area) => area.length === 2);

      areas.forEach((province) => {
        const existProvince = provinces.filter((p) => p[0] === province.id);
        if (existProvince.length > 0) {
          names.push(province.name);
        }
        if (Array.isArray(province.children)) {
          province.children.forEach((city) => {
            const existCity = cities.filter((c) => c[1] === city.id);
            if (existCity.length > 0) {
              names.push(city.name);
            }
          });
        }
      });
    }
    return names.length > 0 ? names.join(',') : '-';
  };

  const onDelete = (modal, id) => {
    companyDelete({ id }).then(() => {
      message.success('删除成功');
      modal.destroy();
      onSearch();
    });
  };

  const methods = useMethods({
    handleCreate() {
      setVisible(true);
      setRecord({});
    },
    handleEdit(record) {
      setVisible(true);
      setRecord(record);
    },
    handleDelete(record) {
      V2Confirm({ onSure: (modal) => onDelete(modal, record.id), content: '确定删除该品牌信息' });
    },
  });

  const defaultColumns = [
    {
      title: 'ID',
      key: 'id',
      width: 100,
    },
    {
      title: '公司名称',
      key: 'name',
      width: 200,
    },
    {
      title: '对应部门',
      key: 'departmentNames',
      importWidth: true,
    },
    {
      title: '管辖范围',
      key: 'areaNames',
      importWidth: true,
    },
    {
      title: '操作',
      key: 'operation',
      render: (_, record) => (
        <Operate
          operateList={refactorPermissions([
            {
              name: '编辑',
              event: 'edit',
            },
            {
              name: '删除',
              event: 'delete',
            },
          ])}
          onClick={(btns) => methods[btns.func](record)}
        />
      ),
    },
  ];

  return (
    <V2Container
      className={cs(styles.container, 'bg-fff')}
      style={{ height: 'calc(100vh - 84px)' }}
      emitMainHeight={(h) => setMainHeight(h)}
      extraContent={{
        top: (
          <>
            <PageTitle content='公司管理' extra={
              <Button type='primary' onClick={methods.handleCreate} >
               新建
              </Button>
            }/>
            <Filter onSearch={onSearch} />
          </>
        ),
      }}
    >
      <V2Table
        onFetch={loadData}
        filters={params}
        defaultColumns={defaultColumns}
        hideColumnPlaceholder
        rowKey='id'
        // scroll={{ x: 'max-content', y: 250 }}
        // 64是分页模块的总大小， 42是table头部
        scroll={{ y: mainHeight - 64 - 42 - 16 }}
      />
      <ExpandTaskModal
        visible={visible}
        setVisible={setVisible}
        departments={departments}
        onSearch={onSearch}
        record={record}
      />
    </V2Container>
  );
};

export default ExpendTaskMng;
