import { FC, useEffect, useMemo, useState } from 'react';
import V2Table from '@/common/components/Data/V2Table';
import { useMethods } from '@lhb/hook';
import { deepCopy, replaceEmpty, refactorPermissions } from '@lhb/func';
import { StatusColor } from 'src/views/locxx/pages/auditManagement/ts-config';
import { Badge, Tooltip, Typography } from 'antd';
import { post } from '@/common/request';
import styles from 'src/views/locxx/pages/auditManagement/entry.module.less';
import V2Operate from '@/common/components/Others/V2Operate';
import Edit, { EditType } from './Edit';
import IconFont from '@/common/components/IconFont';
import { renderPictures } from 'src/views/feedback/pages/index/components/BusinessComplain/components/TableList';

// 交易平台-审核管理-列表
const AuditManagementTableList: FC<{
  params: any,
  tableRef: any,
  mainHeight?: any,
  topStatus: Number
}> = ({
  params,
  tableRef,
  mainHeight,
  topStatus = 1,
}) => {
  const AUDIT_STATUS_WAIT_AUDIT = 1;// 待审核
  const AUDIT_STATUS_AUDITED = 2;// 已审核
  const AUDIT_STATUS_REFUSE = 3;// 拒绝
  const [tableKey, setTableKey] = useState(1);
  const [editData, setEditData] = useState({ id: null, visible: false });

  const defaultColumns = useMemo(() => {
    const tempArr = [
      { title: '品牌', key: 'brandName', visible: true, dragChecked: true, width: '160px' },
      { title: '联系人', key: 'employeeName', visible: true, dragChecked: true, width: '220px', render: (_, record) => methods.renderEmployeeName(record), staticTooltipTitle: (_, record) => methods.renderEmployeeName(record) },
      { title: '认证资料', key: 'brandPictures', visible: true, dragChecked: true, width: '220px', noTooltip: true, render: (value) => renderPictures(value) },
      { title: '提交时间', key: 'gmtCreate', visible: topStatus === AUDIT_STATUS_WAIT_AUDIT, dragChecked: true, width: '220px' },
      { title: '审核状态', key: 'statusName', visible: topStatus === AUDIT_STATUS_AUDITED, dragChecked: true, width: '120px', render: (value, record) => methods.renderStatus(value, record) },
      { title: '审核时间', key: 'reviewTime', visible: topStatus === AUDIT_STATUS_AUDITED, width: '220px', dragChecked: true, render: (value, record) => methods.renderReviewTime(value, record) },
      { key: 'operator', title: '操作', visible: true, dragChecked: true, dragDisabled: true, fixed: 'right', width: '120px', render: (value, record) => {
        return <V2Operate operateList={refactorPermissions(record?.permissions)} onClick={(btn: any) => methods[btn.func](record)}/>;
      } }
    ];

    return tempArr.filter(item => item.visible);
  }, [topStatus]);

  useEffect(() => {
    setTableKey(tableKey + 1);
  }, [topStatus]);

  /* methods */
  const methods = useMethods({
    async fetchData(_params) {
      const params = deepCopy(_params);
      const { objectList = [], totalNum = 0 } = await methods.getList(params);
      return {
        dataSource: objectList,
        count: totalNum
      };
    },
    // 获取审核列表
    getList(params) {
      return new Promise((resolve, reject) => {
        // https://yapi.lanhanba.com/project/560/interface/api/61298
        // 确保点击重置时传递二级tab的值
        params.topStatus = params.topStatus || AUDIT_STATUS_WAIT_AUDIT;
        if (params.topStatus === AUDIT_STATUS_WAIT_AUDIT) {
          delete params.status;
        }
        post('/admin/brand/page', params, { proxyApi: '/zhizu-api' }).then((res) => {
          resolve(res);
        }).catch(err => {
          console.log(err);
          reject({});
        });
      });
    },
    // 通过
    handleBrand_examine_approve(record) {
      setEditData(state => ({ ...state, visible: true, type: EditType.PASS, ...record }));
    },
    // 拒绝
    handleBrand_examine_deny(record) {
      setEditData(state => ({ ...state, visible: true, type: EditType.REFUSE, ...record }));
    },
    // 编辑
    handleBrand_examine_edit(record) {
      setEditData(state => ({ ...state, visible: true, type: EditType.EDIT, ...record }));
    },
    // 刷新当前页面列表
    onRefresh(isCurPage = true) {
      tableRef.current.onload(isCurPage);
    },
    // 渲染状态
    renderStatus(value, record) {
      const color = StatusColor[record.status] || StatusColor['default'];
      return <div style={{ width: '80px', display: 'flex' }}>
        <Badge color={color} text={value} />
        {record.status === AUDIT_STATUS_REFUSE ? <Tooltip title={<pre className={styles.pretext}>{replaceEmpty(record.reason)}</pre>}>
          <div style={{ width: '10px', height: '10px' }}>
            <IconFont iconHref='icon-ic_warning1' style={{ color: '#999999' }}></IconFont>
          </div>
        </Tooltip> : ''}
      </div>;
    },
    // 渲染审核时间
    renderReviewTime(value, record) {
      return <Typography.Text
        ellipsis={{ tooltip: <span>{replaceEmpty(record?.reviewerName)} {replaceEmpty(value)}</span> }}
        style={{ maxWidth: '100%' }}
      >
        <span>{replaceEmpty(record?.reviewerName)} {replaceEmpty(value)}</span>
      </Typography.Text>;
    },
    /** 渲染联系人 */
    renderEmployeeName(record:any) {
      const textArr:string[] = [];
      if (record.tenantName) textArr.push(record.tenantName);
      if (record.employeeName) textArr.push(record.employeeName);
      if (record.mobile) textArr.push(record.mobile);

      return <span>{textArr.join('-')}</span>;
    }
  });

  return (
    <>
      <V2Table
        key={tableKey}
        ref={tableRef}
        defaultColumns={defaultColumns}
        onFetch={methods.fetchData}
        filters={params}
        rowKey='id'
        // 勿删! 64：分页模块总大小、48分页模块减去paddingBottom的值、42是table头部
        scroll={{ y: mainHeight - 64 - 42 }}
      />

      {/* 拒绝弹窗 */}
      <Edit editData={editData} setEditData={setEditData} onRefresh={methods.onRefresh}></Edit>
    </>
  );
};

export default AuditManagementTableList;
