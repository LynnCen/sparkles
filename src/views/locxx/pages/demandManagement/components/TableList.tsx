import { FC, useState, useMemo, useRef, useEffect } from 'react';
import styles from '../entry.module.less';
import cs from 'classnames';
import { Badge, message, Tooltip, Typography } from 'antd';
import V2Table from '@/common/components/Data/V2Table';
import { ConfirmModal } from '@/common/components/Modal/ConfirmModal';
import { useMethods } from '@lhb/hook';
import { postRequirementDeleteBatch, postRequirementList, postRequirementUpdateStatus, postRequirementAssignFollowers, postRequirementExport, postRequirementAssignFollowersBatch } from '@/common/api/demand-management';
import { deepCopy, replaceEmpty, getKeysFromObjectArray, parseObjectArrayToString, refactorPermissions, noop } from '@lhb/func';
import V2Tag from '@/common/components/Data/V2Tag';
import V2Operate from '@/common/components/Others/V2Operate';
import { tagsColorMap, StatusColor, DemandStatus } from '../ts-config';
const { Text } = Typography;
import UpdateWeight from './UpdateWeight';
import FollowerModal from '@/common/components/Modal/FollowerModal';
import { EditOutlined } from '@ant-design/icons';
import AddFollowRecord from './AddFollowRecord';
import FollowRecordDetail from './FollowRecordDetail';
import EditRequirementStage from './EditRequirementStage';
import IconFont from '@/common/components/IconFont';
import EditLabel, { LabelType } from './EditLabel';
import Refuse from './Refuse';
import dayjs from 'dayjs';
import { renderPictures } from 'src/views/feedback/pages/index/components/BusinessComplain/components/TableList';
import { downloadBlob } from '@/common/utils/ways';
import { postLocxxOpManager } from '@/common/api/user';
import DetailDrawer from './DetailDrawer';

// 需求管理列表
const DemandManagementTable: FC<{
  params: any,
  permissions: any[],
  setPermissions: any,
  tableRef: any,
  mainHeight?: any,
  selectedRowKeys: any,
  setSelectedRowKeys: any,
  edit?: (val?: number, type?: string, record?:any) => void, // 新增/编辑需求
  type: string, // 需求类型 '1' 全部，'2' 待审核，'3' 已审核
  twoLevelTab: number,
  updateDemandTwoLevelNum?: () => void, // 更新二级tab数量
}> = ({
  params,
  permissions = [],
  setPermissions,
  tableRef,
  mainHeight,
  selectedRowKeys,
  setSelectedRowKeys,
  edit,
  type = '1',
  twoLevelTab = 1,
  updateDemandTwoLevelNum
}) => {
  const demandManagementShowRows = [DemandStatus.ALL, DemandStatus.WAIT_OUT_CALL, DemandStatus.WAIT_FOLLOW_UP, DemandStatus.HAS_DEMAND, DemandStatus.NOT_DEMAND];

  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const updateWeightRef = useRef<any>(null);
  const addFollowRecordRef = useRef<any>(null);
  const followRecordDetailRef = useRef<any>(null);
  const editRequirementStageRef = useRef<any>(null);
  const editLabelRef = useRef<any>(null);
  const detailRef = useRef<any>(null);
  // 修改跟进人
  const [editFollower, setEditFollower] = useState<any>({ visible: false, follower: {}, type: '' });
  const [demandIds, setDemandIds] = useState<any>([]);
  const [tableKey, setTableKey] = useState(1);
  const [refuseData, setRefuseData] = useState({ id: null, visible: false });
  const BRAND_STATUS_WAIT_AUDIT = 1;// 品牌状态 待审核
  const BRAND_SOURCE_DEMAND = 1;// 品牌来源 需求
  const AUDIT_STATUS_REFUSE = 3;// 拒绝
  const isDemandManagement = type !== DemandStatus.WAIT && type !== DemandStatus.PASS;

  /* methods */
  const methods = useMethods({
    async fetchData(_params) {
      let params = deepCopy(_params);
      const cityIds = params?.cityIds?.length ? params?.cityIds.map(item => item[1]) : [];
      const commercialFormIds = params?.commercialFormIds?.length ? params?.commercialFormIds.map(item => item[1]) : [];
      const { publishDates, followDates, gmtCreateDates } = params;
      const hasPublishDate = Array.isArray(publishDates) && publishDates.length;
      const hasFollowDate = Array.isArray(followDates) && followDates.length;
      const hasGmtCreateDates = Array.isArray(gmtCreateDates) && gmtCreateDates.length;

      params = Object.assign({
        ...params,
        cityIds,
        commercialFormIds,
        brandIds: params?.brandId ? [params.brandId] : [],
        contactIds: params?.contactId ? [params.contactId] : [],
        publishTimeStart: hasPublishDate ? dayjs(params.publishDates[0]).format('YYYY-MM-DD') : null,
        publishTimeEnd: hasPublishDate ? dayjs(params.publishDates[params.publishDates.length - 1]).format('YYYY-MM-DD') : null,
        followerTimeStart: hasFollowDate ? dayjs(params.followDates[0]).format('YYYY-MM-DD') : null,
        followerTimeEnd: hasFollowDate ? dayjs(params.followDates[params.followDates.length - 1]).format('YYYY-MM-DD') : null,
        oneLevelTab: (type || '1'),
        twoLevelTab: type === DemandStatus.WAIT_FOLLOW_UP ? twoLevelTab : 1,
        gmtCreateStart: hasGmtCreateDates ? dayjs(params.gmtCreateDates[0]).format('YYYY-MM-DD') : null,
        gmtCreateEnd: hasGmtCreateDates ? dayjs(params.gmtCreateDates[params.gmtCreateDates.length - 1]).format('YYYY-MM-DD') : null,
      });
      const { objectList = [], totalNum = 0, meta = {} } = await postRequirementList(params);
      setPermissions(refactorPermissions(meta.permissions));
      return {
        dataSource: objectList,
        count: totalNum
      };
    },
    // 批量删除
    handleDeleteBatch() {
      ConfirmModal({
        onSure: (modal) => {
          postRequirementDeleteBatch({
            ids: getKeysFromObjectArray(selectedRows, 'id')
          }).then(() => {
            methods.onRefresh();
            message.success('删除成功');
            modal.destroy();
          });
        },
        content: `确认删除选中的${selectedRows.length}项？`,
      });
    },
    // 编辑
    handleUpdate(val) {
      val?.id && edit?.(val?.id);
    },
    // 标签展示
    renderLabelLists(record) {
      const labels = deepCopy(record?.labelList) || [];
      const labelsTag = labels?.length ? labels.map((item, index) =>
        <V2Tag className='inline-block' key={index} color={tagsColorMap[index % tagsColorMap.length]}>{replaceEmpty(item.name)}</V2Tag>) : '';
      return (
        <div>
          <Text
            ellipsis={{
              tooltip: { title: labelsTag, color: '#fff', overlayInnerStyle: { paddingBottom: '5px' } }
            }}
          >{labelsTag}</Text>
        </div>
      );
    },
    // 内部标签展示
    renderInternalLabel(record) {
      const labels = deepCopy(record?.internalLabelList) || [];
      const labelsTag = labels?.length ? labels.map((item, index) =>
        <V2Tag className='inline-block' key={index} color={tagsColorMap[index % tagsColorMap.length]}>{replaceEmpty(item.name)}</V2Tag>) : '';
      return (
        <div className={styles.internalLabelContent}>
          <Text
            ellipsis={{
              tooltip: { title: labelsTag, color: '#fff', overlayInnerStyle: { paddingBottom: '5px' } }
            }}
          >{labelsTag || '-'}</Text>
          <EditOutlined onClick={() => methods.editInternalLabel({ id: record.id || null, internalLabelIds: getKeysFromObjectArray(record.internalLabelList, 'id') })} className={styles.internalLabelIcon}/>
        </div>
      );
    },
    // 关闭需求
    close(ids: number[]) {
      ConfirmModal({
        onSure: (modal) => {
          postRequirementUpdateStatus({
            locxxRequirementIds: ids,
            status: '1'
          }).then(() => {
            message.success('修改成功');
            methods.onRefresh();
            modal.destroy();
          });
        },
        content: ids.length > 1 ? `确认批量关闭选中的${ids.length}个需求` : `确认关闭当前需求？`,
      });
    },
    // 关闭
    handleClose(record) {
      methods.close([record.id]);
    },
    // 批量关闭
    handleCloseBatch() {
      methods.close(getKeysFromObjectArray(selectedRows, 'id'));
    },
    // 开放需求
    open(ids: number[]) {
      ConfirmModal({
        onSure: (modal) => {
          postRequirementUpdateStatus({
            locxxRequirementIds: ids,
            status: '2'
          }).then(() => {
            message.success('修改成功');
            methods.onRefresh();
            modal.destroy();
          });
        },
        content: ids.length > 1 ? `确认批量开放选中的${ids.length}个需求` : `确认开放当前需求？`,
      });
    },
    // 开放
    handleOpen(record) {
      methods.open([record.id]);
    },
    // 批量开放
    handleOpenBatch() {
      methods.open(getKeysFromObjectArray(selectedRows, 'id'));
    },
    // 调权
    handleUpdateWeight(record) {
      updateWeightRef.current?.init(record);
    },
    // 刷新当前页面列表
    onRefresh(isCurPage = true) {
      setSelectedRowKeys([]);
      setSelectedRows([]);
      type === DemandStatus.WAIT_FOLLOW_UP && updateDemandTwoLevelNum?.();
      tableRef.current.onload(isCurPage);
    },
    // 新增跟进人
    renderFollower(value, record) {
      // 跟进人渲染
      return (<span>
        {replaceEmpty(value)}
        {getKeysFromObjectArray(record.permissions, 'event').includes('demandManagement:assignFollower') && <EditOutlined onClick={() => methods.openChangeFollower(record) } className={styles.pointer}/>}
      </span>);
    },
    // 打开选择跟进人弹窗
    openChangeFollower(record) {
      setEditFollower({ visible: true, follower: { id: record?.followerId || null, name: record?.follower || null }, type: 'assignFollower' });
      setDemandIds([record.id]);
    },
    // 新增跟进人成功
    changeFollower() {
      setEditFollower({ visible: false, follower: {}, type: '' });
      methods.onRefresh();
    },
    // 跟进阶段
    renderRequirementStage(value, record) {
      return <div className={styles.followRecord} >
        <Text ellipsis={{ tooltip: value }} style={{ maxWidth: '100%' }} >
          <span className={styles.followRecordContent}>{replaceEmpty(value)}</span>
        </Text>
        <div className={styles.followRecordIcon}>
          <EditOutlined onClick={() => methods.editRequirementStage({ id: record.id, requirementStageId: record.requirementStageId })} className={styles.pointer}/>
        </div>
      </div>;
    },
    // 打开添加跟进记录的弹窗
    addFollowRecord(data) {
      data.id && addFollowRecordRef.current?.init(data);
    },
    // 更新需求阶段
    editRequirementStage(data) {
      data.id && editRequirementStageRef.current?.init(data);
    },
    // 打开跟进记录详情的弹窗
    openFollowRecordDetail(id, B, C) {
      console.log('id, B, C', id, B, C);
      id && followRecordDetailRef.current?.init(id);
    },
    // 批量指派跟进人
    handleAssignFollowerBatch() {
      setEditFollower({ visible: true, follower: {}, mode: 'multiple', type: 'assignAllFollowers' });
      setDemandIds(getKeysFromObjectArray(selectedRows, 'id'));
    },
    // 渲染需求名称
    renderName(value, record) {
      const tempNode = <span>{record.levelName && <V2Tag className='inline-block'>{replaceEmpty(record.levelName)}</V2Tag>}{replaceEmpty(value)}</span>;
      return (
        <Text ellipsis={{ tooltip: { title: tempNode } }} >
          <span
            onClick={() => isDemandManagement ? methods.openDetail(record.id) : noop()}
            className={isDemandManagement ? 'color-primary pointer' : ''}>
            {tempNode}
          </span>
        </Text>
      );
    },
    toLcnDemandDetail(url) {
      url && window.open(url);
    },
    // 指派跟进人
    updateFollower(val) {
      return new Promise((resolve, reject) => {
        if (!editFollower?.type) {
          console.log('指派方式不明');
          reject();
        }

        const api = editFollower?.type === 'assignFollower' ? postRequirementAssignFollowers : postRequirementAssignFollowersBatch;
        const params = editFollower?.type === 'assignFollower' ? {
          followerId: val?.followId || null,
          locxxRequirementIds: demandIds || []
        } : {
          followerIds: Array.isArray(val?.followId) && val?.followId.length ? val?.followId : [val?.followId],
          locxxRequirementIds: demandIds || []
        };
        api(params).then(() => {
          resolve(true);
        }).catch((err) => {
          console.log('指派跟进人失败', err);
          reject(err);
        });
      });
    },
    // 编辑内部标签
    editInternalLabel(props: { id: number | string, internalLabelIds: Array<any> }) {
      props?.id && editLabelRef.current.init({ type: LabelType.INTERNAL_LABEL, ids: [props?.id], internalLabelIds: props?.internalLabelIds || [] });
    },
    // 批量编辑需求标签
    handleUpdateLabelBatch() {
      editLabelRef.current.init({ type: LabelType.LABEL, ids: getKeysFromObjectArray(selectedRows, 'id') });
    },
    // 批量编辑内部标签
    handleUpdateInternalLabelBatch() {
      editLabelRef.current.init({ type: LabelType.INTERNAL_LABEL, ids: getKeysFromObjectArray(selectedRows, 'id') });
    },
    // 拒绝
    handleReject(record) {
      setRefuseData(state => ({ ...state, visible: true, id: record.id }));
    },
    // 通过
    // handlePass(record) {
    //   record?.id && edit?.(record?.id, 'pass');
    // },
    // 审核
    handlePass(record) {
      record?.id && edit?.(record?.id, 'approve', record);
    },
    // 导出
    handleExport() {
      const ids = getKeysFromObjectArray(selectedRows, 'id');
      message.info('导出中，请稍后...');
      // https://yapi.lanhanba.com/project/307/interface/api/62831
      postRequirementExport({ ids }).then(({ filename, data }) => {
        downloadBlob(data, filename || `需求-${dayjs().format('YYYYMMDDhhmm')}.xlsx`);
        message.success('导出成功，请查看浏览器的下载文件');
      });
    },
    // 渲染需求内容
    renderRemark(value) {
      return <Text
        ellipsis={{ tooltip: <pre className={styles.pretext}>{replaceEmpty(value)}</pre> }}
        style={{ maxWidth: '100%' }}
      >
        <span>{replaceEmpty(value)}</span>
      </Text>;
    },
    // 渲染 联系人
    renderContact(value, record) {
      const { contactMobile, contactTenantName } = record;

      if (contactTenantName === contactMobile || value === contactMobile) {
        return replaceEmpty(contactMobile);
      } else {
        const text = [contactTenantName, value, contactMobile].filter(item => !!(item)).join('-');
        return <Text ellipsis={{ tooltip: text }} style={{ maxWidth: '98%' }}>
          {text}
        </Text>;
      }
    },
    // 渲染品牌
    renderBrand(value, record) {
      if (record?.brandSource === BRAND_SOURCE_DEMAND) {
        return <>{ replaceEmpty(value) }</>;
      } else {
        return <>{record?.spaceBrandStatus === BRAND_STATUS_WAIT_AUDIT
          ? <V2Tag className='inline-block'>{replaceEmpty(record?.spaceBrandStatusName)}</V2Tag> : ''}{replaceEmpty(record?.spaceBrandName)}</>;
      }
    },
    // 渲染状态
    renderStatus(value, record) {
      const color = StatusColor[record.status] || StatusColor['default'];
      return <div style={{ width: '80px', display: 'flex' }}>
        <Badge color={color} text={value} />
        {record.handleStatus === AUDIT_STATUS_REFUSE ? <Tooltip title={<pre className={styles.pretext}>{replaceEmpty(record.handleReason)}</pre>}>
          <div style={{ width: '10px', height: '10px' }}>
            <IconFont iconHref='icon-ic_warning1' style={{ color: '#999999' }}></IconFont>
          </div>
        </Tooltip> : ''}
      </div>;
    },
    openDetail(id: string | number) {
      if (type !== DemandStatus.WAIT && type !== DemandStatus.PASS) {
        detailRef.current.init(id);
      }
    }
  });

  useEffect(() => {
    setTableKey(tableKey + 1);
  }, [type]);

  // 批量操作按钮
  const batchButton = useMemo(() => {
    // 导入需求在 search 组件里
    const searchBtns = ['import', 'create', 'assignFollowerAll'];

    return permissions.filter(item => {
      if (!searchBtns.includes(item.event)) {
        item.onClick = methods[item.func];
      }
      return !searchBtns.includes(item.event);
    });
  }, [permissions]);

  // 接口获取columns
  const defaultColumns = useMemo(() => {
    // isDemandManagementRows 为 true在需求管理里显示
    const isDemandManagementRows = demandManagementShowRows.includes(type);
    const tempArr = [
      { title: '需求名称', key: 'name', fixed: 'left', visible: isDemandManagementRows || type === DemandStatus.PASS, dragChecked: true, width: '160px', render: (value, record) => methods.renderName(value, record) },
      { title: '需求ID', key: 'id', visible: true, dragChecked: true, width: '100px', render: (value) => <Text ellipsis={{ tooltip: replaceEmpty(value) }}>
        <span className={cs(isDemandManagement ? 'color-primary pointer' : '')} onClick={() => isDemandManagement ? methods.openDetail(value) : noop()}>{replaceEmpty(value)}</span>
      </Text> },
      { title: '二维码', key: 'waQrCode', visible: isDemandManagementRows, dragChecked: true, noTooltip: true, width: '100px', render: (value) => renderPictures([{ name: '二维码', url: value || null }]) },
      { title: '需求类型', key: 'purposeTypeName', visible: isDemandManagementRows, dragChecked: true, width: '100px' },
      { title: '所需城市', key: 'cityLists', visible: isDemandManagementRows, dragChecked: true,
        render: (value, record) => <Text ellipsis={{ tooltip: replaceEmpty(parseObjectArrayToString(record?.cityList, 'name', '、')) }}>
          { parseObjectArrayToString(record?.cityList, 'name', '、') }
        </Text>
      },
      { title: '面积', key: 'area', visible: isDemandManagementRows, width: '120px', dragChecked: true,
        render: (value, record) => <span>{replaceEmpty(record.minArea)}~{replaceEmpty(record.maxArea)}m²</span>
      },
      { title: '品牌行业', visible: isDemandManagementRows, key: 'brandIndustry', dragChecked: true },
      { title: '来源渠道', visible: isDemandManagementRows, key: 'sourceChannelName', width: '160px', dragChecked: true },
      { title: '其他说明', visible: isDemandManagementRows, key: 'remark', dragChecked: true, render: (text) => replaceEmpty(text) },
      { title: '内部标签', visible: isDemandManagementRows, key: 'internalLabelList', width: '160px', noTooltip: true, dragChecked: true, className: styles.internalLabel, render: (value, record) => methods.renderInternalLabel(record) },
      { title: '需求标签', visible: isDemandManagementRows, key: 'labelLists', width: '160px', dragChecked: true, render: (value, record) => methods.renderLabelLists(record) },
      { title: '跟进人', visible: isDemandManagementRows, key: 'follower', width: '140px', dragChecked: true, render: (value, records) => methods.renderFollower(value, records) },
      {
        title: '跟进记录',
        visible: isDemandManagementRows,
        key: 'followRecord',
        dragChecked: true,
        width: '220px',
        render: (value) => <span>{replaceEmpty(value)}</span>,
        rightOperateSlot: [
          { icon: 'icon-ic_history', onClick: (val, record) => methods.openFollowRecordDetail(record.id) },
          // { icon: 'pc-common-icon-ic_edit', onClick: (val, record) => methods.addFollowRecord({ id: record.id, requirementStageId: record.requirementStageId }) }
        ]
      },
      { title: '跟进阶段', visible: isDemandManagementRows, key: 'requirementStageName', dragChecked: true, width: '220px', render: (value, record) => methods.renderRequirementStage(value, record) },
      { title: '发布人', visible: isDemandManagementRows, key: 'publisher', dragChecked: true },
      { title: '发布时间', visible: isDemandManagementRows, key: 'publishTime', dragChecked: true },
      { title: '创建时间', visible: isDemandManagementRows, key: 'gmtCreate', dragChecked: true },
      { title: '创建人', visible: isDemandManagementRows, key: 'crtorName', dragChecked: true, render: (text) => replaceEmpty(text) },
      { title: '需求状态', visible: isDemandManagementRows, key: 'status', dragChecked: true, width: '100px', render: (value, record) => {
        const color = StatusColor[record.status] || StatusColor['default'];
        return (<span style={{ color }}>{record.statusName}</span>);
      } },
      { title: '品牌', visible: type !== DemandStatus.ALL, key: 'brandName', width: '160px', dragChecked: true, render: (value, record) => methods.renderBrand(value, record) },
      { title: '需求内容', visible: type === DemandStatus.WAIT, key: 'remark', width: '220px', dragChecked: true },
      { title: '联系人', visible: type !== DemandStatus.ALL, key: 'contactName', width: '220px', dragChecked: true, render: (value, record) => methods.renderContact(value, record) },
      { title: '提交时间', visible: type === DemandStatus.WAIT, key: 'gmtCreate', width: '220px', dragChecked: true },
      { title: '审核状态', visible: type === DemandStatus.PASS, key: 'handleStatusName', width: '160px', dragChecked: true, render: (value, record) => methods.renderStatus(value, record) },
      { title: '审核时间', visible: type === DemandStatus.PASS, key: 'gmtHandle', width: '220px', dragChecked: true },
      { key: 'operator', title: '操作', visible: !isDemandManagement, dragChecked: true, dragDisabled: true, fixed: 'right', width: '160px', render: (value, record) => {
        return <V2Operate operateList={refactorPermissions(record?.permissions.filter(item => item.event !== 'demandManagement:assignFollower'))} onClick={(btn: any) => methods[btn.func](record)}/>;
      } }
    ];
    return tempArr.filter(item => item.visible);
  }, [type]);

  return (
    <>
      <V2Table
        key={tableKey}
        ref={tableRef}
        defaultColumns={defaultColumns}
        tableSortModule='demandManagementList'
        onFetch={methods.fetchData}
        filters={params}
        useResizable
        className={cs(styles.tableList)}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys,
          fixed: true,
          onChange: (selectedRowKeys, selectedRows: any[]) => {
            setSelectedRowKeys(selectedRowKeys);
            setSelectedRows(selectedRows);
          },
        }}
        rowSelectionOperate={batchButton}
        rowKey='id'
        // 勿删! 64：分页模块总大小、48分页模块减去paddingBottom的值、42是table头部
        scroll={{ y: mainHeight - 64 - 42 }}
        paginationConfig={{
          pageSizeOptions: [20, 50, 100, 500],
        }}
      />

      {/* 调权弹窗 */}
      <UpdateWeight ref={updateWeightRef} onRefresh={methods.onRefresh}></UpdateWeight>
      {/* 选择跟进人弹窗 */}
      <FollowerModal
        title='指派跟进人'
        placeholder='请选择跟进人'
        updateRequest={methods.updateFollower}
        editFollower={editFollower}
        onClose={() => setEditFollower({ ...editFollower, visible: false, type: '' })}
        onOk={methods.changeFollower}
        getUserListFunc={postLocxxOpManager}
        immediateOnce={false}
      />
      {/* 添加跟进记录 */}
      <AddFollowRecord ref={addFollowRecordRef} onRefresh={methods.onRefresh}/>
      {/* 跟进记录详情 */}
      <FollowRecordDetail ref={followRecordDetailRef}/>
      <EditRequirementStage ref={editRequirementStageRef} onRefresh={methods.onRefresh}></EditRequirementStage>
      {/* 编辑标签 */}
      <EditLabel ref={editLabelRef} onRefresh={methods.onRefresh}/>
      {/* 拒绝弹窗 */}
      <Refuse refuseData={refuseData} setRefuseData={setRefuseData} onRefresh={methods.onRefresh}></Refuse>
      {/* 需求详情 */}
      <DetailDrawer ref={detailRef} onRefresh={methods.onRefresh}/>
    </>
  );
};

export default DemandManagementTable;
