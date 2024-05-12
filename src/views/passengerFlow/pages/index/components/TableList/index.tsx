import { FC, useState } from 'react';
import styles from '../../entry.module.less';
import cs from 'classnames';
import { message } from 'antd';
import V2Table from '@/common/components/Data/V2Table';
import TeamModal from '@/views/passengerFlow/components/TeamModal';
import Status from './components/Status';
import ErrorStatus from './components/ErrorStatus';
import { ConfirmModal } from '@/common/components/Modal/ConfirmModal';
import { useMethods } from '@lhb/hook';
import { postBatchDelete, postStoreQuery } from '@/common/api/passenger-flow';
import { deepCopy, refactorPermissions } from '@lhb/func';
import PassengerFlowDetailDrawer from '../DetailDrawer';
import CanShowUserModal from './components/CanShowUserModal';
const PassengerFlowTable: FC<any> = ({ params, permissions, setPermissions, tableRef, mainHeight, selectedRowKeys, setSelectedRowKeys, setErrorCount }) => {
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [teamModalData, setTeamModalData] = useState<any>({
    visible: false,
    type: 1,
    ids: []
  });
  const [openDetail, setOpenDetail] = useState(false);
  const [detailId, setDetailId] = useState(0);
  const [canShowUserModal, setCanShowUserModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<any>([]);

  /* methods */
  const methods = useMethods({
    async fetchData(_params) {
      const newParams = deepCopy(_params);
      if (newParams.isError === 99) {
        delete newParams.isError;
      }
      const { objectList = [], totalNum = 0, meta = {} } = await postStoreQuery(newParams);
      setPermissions(refactorPermissions(meta.permissions || []));
      setErrorCount(meta.errorCount);
      return {
        dataSource: objectList,
        count: totalNum
      };
    },
    handleAttachTenants() { // 添加可见团队
      setTeamModalData({
        type: 1,
        visible: true,
        ids: selectedRows.map(item => item.id)
      });
    },
    handleDeleteTenants() { // 移除可见团队
      setTeamModalData({
        type: 2,
        visible: true,
        ids: selectedRows.map(item => item.id)
      });
    },
    handleDeleteStore() { // 删除
      ConfirmModal({
        onSure: (modal) => {
          postBatchDelete({
            ids: selectedRows.map(item => item.id)
          }).then(() => {
            setSelectedRowKeys([]);
            setSelectedRows([]);
            tableRef.current.onload(true);
            message.success('删除成功');
            modal.destroy();
          });
        },
        content: `确认删除选中的${selectedRows.length}项吗？`,
      });
    },
    handleAttachAccounts() { // 添加可见人员
      setCanShowUserModal(true);
      setSelectedIds([...(selectedRows || []).map(item => item.id)]);
    },
    onRefresh() {
      setSelectedRowKeys([]);
      setSelectedRows([]);
      tableRef.current.onload(true);
    },
    // toSpot(spotId) {
    //   postSpotBrief({
    //     id: spotId
    //   }).then((res) => {
    //     dispatchNavigate(`/resmng/real-detail?id=${res.placeId}&resourceType=1&categoryId=${res.spotCategoryId}&isKA=false&activeKey=${res.spotId}`);
    //   });
    // },
    toDetail(id) {
      setDetailId(id);
      setOpenDetail(true);
    },
    teamModalSuccess() {
      setSelectedRowKeys([]);
      setSelectedRows([]);
      tableRef.current.onload(true);
    },
  });
  // 批量操作按钮
  const batchButton = () => {
    // 新增门店在search组件里
    return permissions?.filter(item => {
      if (item.event !== 'createUpdateStore') {
        item.onClick = methods[item.func];
      }
      return item.event !== 'createUpdateStore';
    }) || [];
  };

  // 接口获取columns
  const defaultColumns = [
    { title: 'ID', key: 'id', width: 110, dragChecked: true, dragDisabled: true, fixed: 'left' },
    { title: '设备状态', key: 'deviceStatusName', width: 110, render: (_, item) => <ErrorStatus item={item} />, dragChecked: true, dragDisabled: true },
    { title: '门店名称', key: 'name', render: (_, item) => <span className={styles.pointer} onClick={() => methods.toDetail(item.id)}>{item.name}</span>, dragChecked: true, dragDisabled: true },
    { title: '所在点位', key: 'spotName', dragChecked: true, dragDisabled: true },
    // { title: '所在点位', key: 'spotName', render: (_, item) => <span className={styles.pointer} onClick={() => methods.toSpot(item.spotId)}>{item.spotName}</span>, dragChecked: true, dragDisabled: true },
    { title: '经营时间', key: 'operatingTime', sorter: (a, b) => {
      return +new Date(a.startDate) - (+new Date(b.startDate));
    }, render: (_, item) => item.operatingTime, dragChecked: true },
    { title: '解决方案', key: 'sourceName', dragChecked: true },
    { title: '状态', key: 'statusName', width: 110, render: (_, item) => <Status item={item} />, dragChecked: true },
    { title: '运维人员', key: 'lhMaintainerNames', dragChecked: true },
    { title: '可见范围', key: 'tenantNames', dragChecked: true },
  ];
  return (
    <>
      <V2Table
        ref={tableRef}
        defaultColumns={defaultColumns}
        tableSortModule='passengerFlow10000'
        onFetch={methods.fetchData}
        filters={params}
        className={cs(styles.tableList)}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys,
          onChange: (selectedRowKeys, selectedRows: any[]) => {
            setSelectedRowKeys(selectedRowKeys);
            setSelectedRows(selectedRows);
          },
        }}
        rowSelectionOperate={batchButton()}
        rowKey='id'
        // 勿删! 64：分页模块总大小、48分页模块减去paddingBottom的值、42是table头部
        scroll={{ y: mainHeight - 64 - 42 }}
        useResizable
      />
      <TeamModal onSuccess={methods.teamModalSuccess} data={teamModalData} setData={setTeamModalData}></TeamModal>
      <PassengerFlowDetailDrawer open={openDetail} setOpen={setOpenDetail} id={detailId} />
      <CanShowUserModal storeIds={selectedIds} visible={canShowUserModal} setVisible={setCanShowUserModal} onRefresh={methods.onRefresh} />
    </>
  );
};

export default PassengerFlowTable;
