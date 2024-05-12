import { FC, useState } from 'react';
import styles from './entry.module.less';
import V2Container from '@/common/components/Data/V2Container';
import V2Table from '@/common/components/Data/V2Table';
import Filters from './components/Filters';
import V2Operate from '@/common/components/Others/V2Operate';
import { useMethods } from '@lhb/hook';
import { Badge } from 'antd';
import BusinessModal from './components/BusinessModal';
import { getBusinessType, getTenantList } from '@/common/api/pms';
import ImportModal from './components/ImportModal';

const CompanyManage:FC<any> = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [params, setParams] = useState<[]>([]);
  const [tenantId, setTenantId] = useState<number>();
  const [businessInfo, setBusinessInfo] = useState<any>([]);
  const [mainHeight, setMainHeight] = useState<any>();
  // const [businessType, setBusinessType] = useState<any>([]);
  const columns = [
    { title: '租户ID', key: 'id', fixed: 'left', width: 200 },
    { title: '租户名称/团队名称', key: 'name' },
    { title: '编号', key: 'number' },
    { title: '创建渠道', key: 'channelName', width: 200 },
    { title: '企业认证状态', key: 'certificateStatus.name',
      render: (_, record) => {
        return (
          <div>{record?.certificateStatus.name}</div>
        );
      }
    },
    { title: '状态', key: 'status.value', width: 100,
      render: (value, record) => {
        return (
          <>
            <Badge
              status={methods.getColor(record.status.value)}
              text={record.status.name} />
          </>
        );
      }
    },
    { title: '创建人', key: 'creator', width: 120 },
    // { title: '跟进人', key: 'follower', width: 120 },
    {
      title: '操作',
      key: 'permissions',
      width: 250,
      render: (_:any, record: any) => {
        return (
          <V2Operate
            operateList={[{ name: '业务类型配置', event: 'config' }]}
            onClick={() => { methods.handleConfig(record.id); }}
            showBtnCount={4}
          />
        );
      }
    },
  ];
  const methods = useMethods({
    handleConfig(id) {
      // console.log(id);
      setTenantId(id);
      getBusinessType({ id: id }).then((res) => {
        setBusinessInfo(res);
        setShowModal(true);
      });
    },
    handleImport() {
      setShowImportModal(true);
    },
    onSearch(value) {
      setParams({ ...value });
    },
    getColor(val) {
      if (val === 1) {
        return 'success';
      } else if (val === 2) {
        return 'error';
      } else {
        return 'default';
      }
    }
  });
  const loadData = async (params?: any) => {
    const { objectList, totalNum } = await getTenantList({ ...params });
    return {
      dataSource: objectList || [],
      count: totalNum
    };
  };
  return (
    <div className={styles.container}>
      <V2Container
        className={styles.content}
        style={{ height: 'calc(100vh - 88px)' }}
        emitMainHeight={(h) => setMainHeight(h)}
        extraContent={{
          top: <Filters onSearch={methods.onSearch} onImport={methods.handleImport} />
        }}
      >
        <V2Table
          rowKey='id'
          filters={params}
          defaultColumns={columns}
          onFetch={loadData}
          scroll={{ x: 'max-content', y: mainHeight - 80 - 42 }}
        />
      </V2Container>
      <BusinessModal showModal={showModal} setShowModal={setShowModal} id={tenantId} businessInfo={businessInfo}/>
      <ImportModal showModal={showImportModal} setShowModal={setShowImportModal} onOkImport={methods.onSearch} />
    </div>
  );
};

export default CompanyManage;
