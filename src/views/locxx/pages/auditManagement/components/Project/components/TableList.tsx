import { FC, useEffect, useMemo, useState } from 'react';
import V2Table from '@/common/components/Data/V2Table';
import { useMethods } from '@lhb/hook';
import { deepCopy, replaceEmpty, refactorPermissions, camelize, parseArrayToString, getKeysFromObjectArray } from '@lhb/func';
import { Badge, Tooltip, Typography } from 'antd';
import { post } from '@/common/request';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import V2DetailGroup from '@/common/components/Feedback/V2DetailItem/Group';
import styles from 'src/views/locxx/pages/auditManagement/entry.module.less';
import V2Operate from '@/common/components/Others/V2Operate';
import Edit, { EditType } from './Edit';
import IconFont from '@/common/components/IconFont';
import { UrlSuffix } from '@/common/enums/qiniu';
import V2Tag from '@/common/components/Data/V2Tag';
import { dispatchNavigate } from '@/common/document-event/dispatch';

// 交易平台-审核管理-列表
const AuditManagementTableList: FC<{
  params: any,
  tableRef: any,
  mainHeight?: any,
  status: Number,
  openStatusOptions: Array<any>
}> = ({
  params,
  tableRef,
  mainHeight,
  status = 1,
  openStatusOptions,
}) => {
  const AUDIT_STATUS_WAIT_AUDIT = 1;// 待审核
  const AUDIT_STATUS_AUDITED = 4;// 已审核
  const AUDIT_STATUS_REFUSE = 3;// 拒绝
  const [tableKey, setTableKey] = useState(1);
  const [editData, setEditData] = useState({ id: null, visible: false });

  const defaultColumns = useMemo(() => {
    const tempArr = [
      { title: '项目', key: 'project_id', visible: true, dragChecked: true, width: '320px', render: (value, record) => methods.renderPlace(value, record), staticTooltipTitle: (value, record) => `${record.publicPlaceId || ''}-${record.placeName || ''}`, },
      { title: '类型', key: 'categoryName', visible: true, dragChecked: true, width: '110px', render: (value) => value || '-' },
      { title: '项目图片', key: 'placePictures', visible: true, dragChecked: true, width: '180px', whiteTooltip: true, render: (value) => methods.renderPictures(value, 1) },
      { title: '联系人', key: 'contactName', visible: true, dragChecked: true, width: '220px', render: (value, record) => methods.renderName(value, record), forceTooltipRender: (value, record) => methods.renderName(value, record) },
      { title: '岗位', key: 'position', visible: true, dragChecked: true, width: '100px', render: (value) => replaceEmpty(value) },
      { title: '招商业态', key: 'commercials', visible: true, dragChecked: true, render: (value) => replaceEmpty(parseArrayToString(getKeysFromObjectArray(value, 'name'), '、')), staticTooltipTitle: (value) => replaceEmpty(parseArrayToString(getKeysFromObjectArray(value, 'name'), '、')) },
      { title: '项目状态', key: 'openStatusName', visible: true, dragChecked: true, width: '110px', render: (value) => value || '-' },
      { title: '认证资料', key: 'fileUrl', visible: true, dragChecked: true, width: '350px', whiteTooltip: true, render: (value) => methods.renderPictures(value) },
      { title: '提交时间', key: 'commitTime', visible: status === AUDIT_STATUS_WAIT_AUDIT, dragChecked: true, width: '220px' },
      { title: '审核状态', key: 'statusName', visible: status === AUDIT_STATUS_AUDITED, dragChecked: true, width: '120px', render: (value, record) => methods.renderStatus(value, record) },
      { title: '审核时间', key: 'reviewTime', visible: status === AUDIT_STATUS_AUDITED, width: '280px', dragChecked: true, render: (value, record) => `${record.reviewerName || ''} ${value || '-'}`, forceTooltipRender: (value, record) => `${record.reviewerName || ''} ${value || '-'}`, },
      // { title: '拒绝原因', key: 'reason', visible: status === AUDIT_STATUS_AUDITED, width: '220px', dragChecked: true, render: (value, record) => methods.renderSeason(value, record) },
      { key: 'operator', title: '操作', visible: true, whiteTooltip: true, dragChecked: true, dragDisabled: true, fixed: 'right', width: '160px', render: (value, record) => {
        return <V2Operate operateList={refactorPermissions(record?.permissions)} onClick={(btn: any) => methods[btn.func](record)}/>;
      } }
    ];

    return tempArr.filter(item => item.visible);
  }, [status]);

  useEffect(() => {
    setTableKey(tableKey + 1);
  }, [status]);

  /* methods */
  const methods = useMethods({
    async fetchData(_params) {
      const params = deepCopy(_params);
      const commercialIdList = params?.commercialIdList?.length ? params?.commercialIdList.map(item => item[1]) : [];

      if (!params.statuses)params.statuses = [1, 4];
      params.commercialIdList = commercialIdList;
      const { objectList = [], totalNum = 0 } = await methods.getList(params);
      objectList.forEach(item => {
        item.permissions.forEach(iitem => {
          iitem.event = camelize(iitem.event);
        });
      });
      return {
        dataSource: objectList,
        count: totalNum
      };
    },
    renderPlace(value, record) {
      if (record?.publicPlaceExamineStatus === 1) {
        return <>
          {record.labelList
            ? <V2Tag color='red' style={{ marginLeft: '5px' }} className='inline-block'>{record.labelList[0]?.labelName}</V2Tag>
            : ''
          }
          <a onClick={() => methods.handleResDetail(record)}>{record.publicPlaceId || ''}-{record.placeName || ''}</a>
        </>;
      } else {
        return <a onClick={() => methods.handleResDetail(record)}>{record.publicPlaceId || ''}-{record.placeName || ''}</a>;
      }
      ;
    },
    // 获取审核列表
    getList(params) {
      return new Promise((resolve, reject) => {
        // https://yapi.lanhanba.com/project/560/interface/api/61410
        post('/admin/place/page', params, { proxyApi: '/zhizu-api', isMock: false, mockId: 307 }).then((res) => {
          console.log(res);
          resolve(res);
        }).catch(err => {
          console.log(err);
          reject({});
        });
      });
    },
    // 审核项目
    handlePlaceExamineDivebomb(record) {
      console.log(record);
      const { examineOrderId = '', categoryId = '', placeName = '' } = record || {};
      dispatchNavigate(`/resaudit/detail?examineOrderId=${examineOrderId}&categoryId=${categoryId}&placeName=${placeName}&resourceType=0&backUrl=/locxx/auditManagement`);

    },
    // 通过
    handlePlaceExamineApprove(record) {
      setEditData(state => ({ ...state, visible: true, ...record, type: EditType.PASS }));
    },
    // 拒绝
    handlePlaceExamineDeny(record) {
      setEditData(state => ({ ...state, visible: true, id: record.id, type: EditType.REFUSE }));
    },
    // 编辑
    handlePlaceExamineEdit(record) {
      setEditData(state => ({ ...state, visible: true, ...record, type: EditType.EDIT }));
    },
    // 刷新当前页面列表
    onRefresh(isCurPage = true) {
      tableRef.current.onload(isCurPage);
    },
    renderName(value, record) {
      if (tableKey === 1) {
        return record.contactMobile || '-';
      } else if (record.tenantName === record.contactMobile || record.contactName === record.contactMobile) {
        return record.contactMobile || '-';
      }
      return `${record.tenantName || ''}-${record.contactName}-${record.contactMobile}`;
    },
    renderSeason(value) {
      return <Typography.Text
        ellipsis={{ tooltip: <pre className={styles.pretext}>{replaceEmpty(value)}</pre> }}
        style={{ maxWidth: '100%' }}
      >
        <span>{replaceEmpty(value)}</span>
      </Typography.Text>;
    },
    // 渲染状态
    renderStatus(value, record) {
      const StatusColor = {
        1: '#959BAB',
        2: 'green',
        3: 'orange'
      };

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
    /**
     * 渲染截图
     * @param value
     * @param {number} maxLength  显示图片的最大数量，如果传 0 则表示有多少显示多少
     * @returns
     */
    renderPictures(value:any, maxLength:number = 0) {
      if (!Array.isArray(value) || !value.length) {
        return '';
      }
      const pics = value.map(item => ({ name: item.name, url: (item.url || item) + UrlSuffix.PmsOri }));

      const _pics = maxLength ? pics.slice(0, maxLength) : pics;

      return <Typography.Paragraph ellipsis={{ tooltip: '' }} style={{ marginBottom: '4px', width: '300px' }} >
        <div className={styles.pictures}>
          <V2DetailGroup moduleType='easy' >
            <V2DetailItem type='images' assets={_pics}></V2DetailItem>
          </V2DetailGroup>
        </div>
      </Typography.Paragraph>;
    },
    handleResDetail(record:any) {
      window.open(`${window.location.origin}/resmng/real-detail?id=${record.publicPlaceId}&resourceType=${0}&categoryId=${record.categoryId}&isKA=false`);
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
      <Edit openStatusOptions={openStatusOptions} editData={editData} setEditData={setEditData} onRefresh={methods.onRefresh}></Edit>
    </>
  );
};

export default AuditManagementTableList;
