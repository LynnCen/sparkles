import { FC, useEffect, useRef, useState } from 'react';
import { Button, Tooltip, message } from 'antd';
import { useMethods } from '@lhb/hook';
import FilterTable from '@/common/components/FilterTable';
import TeamModal from '@/views/passengerFlow/components/TeamModal';
import { StoreDetail, PermissionEvent } from '../ts-config';
import styles from '../entry.module.less';
import Operate from '@/common/components/Operate';
import { ConfirmModal } from '@/common/components/Modal/ConfirmModal';
import { postStoreTenants, postDetachTenants } from '@/common/api/passenger-flow';
import { refactorPermissions } from '@lhb/func';
import SetCanShowUserModal from './SetCanShowUserModal';
interface RangeProps {
  detail: StoreDetail | Record<string, any>;
  open?: boolean;
}

const Tenants: FC<RangeProps> = ({
  detail,
  open,
}) => {
  const tableRef: any = useRef();
  const permissionAdd = !!(detail && detail.permissionEvents) && detail.permissionEvents.includes(PermissionEvent.TENANTS_ATTACH);
  const permissionDelete = !!(detail && detail.permissionEvents) && detail.permissionEvents.includes(PermissionEvent.TENANTS_DELETE);

  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [teamModalData, setTeamModalData] = useState<any>({
    visible: false,
    type: 1, // 添加/移除
    ids: [detail.id]
  });
  const [canShowUserModal, setCanShowUserModal] = useState<any>({
    visible: false,
    storeId: detail.id,
    tenantId: 0,
    ids: []
  });

  useEffect(() => {
    if (detail.id && open) {
      tableRef.current.onload();
    }
  }, [detail.id, open]);

  const methods = useMethods({
    async fetchData(_params) {
      const { objectList = [], totalNum = 0 } = await postStoreTenants({
        ..._params,
        storeId: detail.id,
      });
      setSelectedRowKeys([]);
      setSelectedRows([]);
      return {
        dataSource: objectList,
        count: totalNum,
      };
    },
    handleRemoveTeam() {
      ConfirmModal({
        content: '确认移除该团队？',
        onSure: () => {
          postDetachTenants({
            tenantIds: selectedRowKeys,
            storeIds: [detail.id]
          }).then(() => {
            tableRef.current.onload(true);
            message.success('移除成功');
            setSelectedRowKeys([]);
            setSelectedRows([]);
          });
        }
      });
    },
    handleAddTeam() {
      setTeamModalData({
        ...teamModalData,
        visible: true,
        ids: [detail.id]
      });
    },
    handleSetAccounts(record) {
      setCanShowUserModal({
        ...canShowUserModal,
        tenantId: record.id,
        visible: true,
        ids: record.accounts?.length ? record.accounts.map((item) => item.id) : [],
      });
    },
    toTanantDetail(id: number) {
      window.open(`/tenant/detail?id=${id}`);
    },
    onRefresh() {
      tableRef.current.onload();
    }
  });

  // 批量操作按钮
  const batchButton = () => refactorPermissions([
    {
      name: '删除',
      event: 'removeTeam',
      type: 'default',
      disabled: !selectedRows?.length,
    }
  ]);

  // 列表项
  const columns = [
    { title: '租户编号', key: 'number', width: 220 },
    { title: '团队名称/租户名称', key: 'name', width: 220, render: (_, item) => {
      return <span className={styles.pointer} onClick={() => methods.toTanantDetail(item.id)}>{item.name}</span>;
    } },
    { title: '可见人员', key: 'accounts', width: 220, render: (value) => {
      const text = value?.length ? value.map(item => item.name).join('、') : '-';
      return (
        <Tooltip title={text}>
          <div style={{ width: 220 }} className='ellipsis'>{ text }</div>
        </Tooltip>
      );
    } },
    {
      title: '操作',
      key: 'permissions',
      fixed: 'right',
      width: 100,
      whiteTooltip: true,
      render: (value: any, record) => (
        <Operate
          showBtnCount={3}
          operateList={refactorPermissions(value || [])}
          onClick={(btn: any) => methods[btn.func](record)}
        />
      ),
    },
  ];

  return (
    <div className={styles.rangeWrapper}>
      <div className={styles.infoRow}>
        <Button className={styles.higlightButton} style={!permissionAdd ? { visibility: 'hidden' } : {}} onClick={methods.handleAddTeam}>添加新团队/租户</Button>
        {
          !!selectedRows.length && <div className={styles.teamSelectText}>已选择团队/租户 {selectedRows.length}个</div>
        }
      </div>
      <FilterTable
        ref={tableRef}
        columns={columns}
        onFetch={methods.fetchData}
        className='mt-8'
        paginationConfig={{
          showSizeChanger: false
        }}
        rowSelection={{
          type: 'checkbox',
          preserveSelectedRowKeys: true,
          selectedRowKeys,
          onChange: (keys, rows: any[]) => {
            setSelectedRowKeys(keys);
            setSelectedRows(rows);
          },
        }}
        rowKey='id'
        pageSize={10}
        paginationSlot={ permissionDelete && <Operate
          showBtnCount={4}
          operateList={batchButton()}
          onClick={(btn) => methods[btn.func]()}/>
        }
      />
      <TeamModal data={teamModalData} setData={setTeamModalData} onSuccess={() => tableRef.current.onload(true)} />
      <SetCanShowUserModal modal={canShowUserModal} setModal={setCanShowUserModal} onRefresh={methods.onRefresh} />
    </div>
  );
};

export default Tenants;
