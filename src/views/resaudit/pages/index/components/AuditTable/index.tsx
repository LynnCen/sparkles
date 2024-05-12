import Table from '@/common/components/FilterTable';
// import { dispatchNavigate } from '@/common/document-event/dispatch';
import { useMethods } from '@lhb/hook';
import { FC, useEffect, useState } from 'react';
import Operate from '@/common/components/Operate';
import { OperateButtonProps, FormattingPermission } from '@/common/components/Operate/ts-config';
import { ResourceType, ResourceApprovalType } from '../.././ts-config';
import { resTemplateList } from '@/common/api/template';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import { refactorPermissions } from '@lhb/func';

interface AuditTableProps {
  loadData: Function,
  resourceType: number,
  status: number,
  params: Object,
}

const AuditTable: FC<AuditTableProps> = ({ loadData, resourceType, params, status }) => {
  const [columns, setColumns]: any[] = useState([]);
  /* hooks */
  useEffect(() => {
    const colunms: any = resourceType === ResourceType.PLACE
      ? [{ key: 'name', title: '场地名称', width: 300 }]
      : [
        { key: 'name', title: '点位名称', width: 300 },
        { key: 'placeName', title: '所属场地' },
      ];
    setColumns([
      // @ts-ignore
      ...colunms,
      { key: 'address', title: '地址' },
      { key: 'categoryName', title: '类目' },
      { key: 'typeName', title: '审核类型', width: 80 },
      { key: 'channelName', title: '来源渠道', width: 80 },
      { key: 'followUpBy', title: '场地跟进人', width: 100 },
      { key: 'gmtCreate', title: '审核时间' },
      status !== ResourceApprovalType.WAIT && { key: 'examineTime', title: ResourceApprovalType.PASS === status ? '通过时间' : '拒绝时间' },
      {
        key: 'permissions',
        fixed: 'right',
        title: '操作',
        render: (value: OperateButtonProps, record) => (
          <Operate
            operateList={refactorPermissions(value)}
            onClick={(btn: FormattingPermission) => methods[btn.func](record)}
          />
        )
      }
    ]);
  }, [status, resourceType]);

  const { editAudit, addAudit, ...methods } = useMethods({
    handleAudit(record: any) {
      const type = parseInt(record.type);
      switch (type) {
        case 1:
          return editAudit(record);
        default: addAudit(record);
      }
    },

    /** todo 等待后端增加点位名称字段 */
    handleDetail(record: any) {
      /** 暂时满足产品需求 */
      // dispatchNavigate(`/resaudit/approvalDetail?examineOrderId=${record.id}&resourceType=${record.resourceType}&categoryId=${record.categoryId}&resourceId=${resourceType === ResourceType.PLACE ? record.placeId : record.spotId}`);
      if (resourceType === ResourceType.PLACE) {
        dispatchNavigate(`/resaudit/approvalDetail?examineOrderId=${record.id}&resourceType=${record.resourceType}&categoryId=${record.categoryId}&resourceId=${resourceType === ResourceType.PLACE ? record.placeId : record.spotId}&name=${record.name}&type=${record.type}&status=${record.status}`);
      } else {
        dispatchNavigate(`/resaudit/approvalDetail?examineOrderId=${record.id}&resourceType=${record.resourceType}&categoryId=${record.categoryId}&resourceId=${resourceType === ResourceType.PLACE ? record.placeId : record.spotId}&name=${record.name}&type=${record.type}&status=${record.status}&placeName=${record.placeName}`);
      }

    },

    // 审核编辑
    async editAudit(record: any) {
      const tmplResult = await resTemplateList({ resourcesType: resourceType, useType: 0 });
      const categoryTemplateId = tmplResult.objectList.length ? tmplResult.objectList[0].id : null;

      if (categoryTemplateId) {
        const resourceId = resourceType === ResourceType.PLACE ? record.placeId : record.spotId;
        // dispatchNavigate(`/resaudit/compare?examineOrderId=${record.id}&categoryId=${record.categoryId}&categoryTemplateId=${categoryTemplateId}&resourceType=${resourceType}&resourceId=${resourceId}`);
        dispatchNavigate(`/resaudit/compare?examineOrderId=${record.id}&categoryId=${record.categoryId}&categoryTemplateId=${categoryTemplateId}&resourceType=${resourceType}&resourceId=${resourceId}&type=${record.type}&name=${record.name}&placeName=${record.placeName}`);
      }
    },

    // 审核新增
    addAudit(record: any) {
      // dispatchNavigate(`/resaudit/detail?examineOrderId=${record.id}&resourceType=${record.resourceType}&categoryId=${record.categoryId}&type=${record.type}`);
      dispatchNavigate(`/resaudit/detail?examineOrderId=${record.id}&resourceType=${record.resourceType}&categoryId=${record.categoryId}&type=${record.type}&name=${record.name}&placeName=${record.placeName}`);
    },

    // 审核未通过
    noPassAudit(record: any) {
      dispatchNavigate(`/resaudit/detail?examineOrderId=${record.id}&resourceType=${record.resourceType}&categoryId=${record.categoryId}&type=${record.type}`);
    }
  });


  return (
    <>
      <Table
        rowKey='id'
        wrapStyle ={{ maxHeight: 'auto' }}
        filters={params}
        onFetch={loadData}
        pagination={true}
        columns={columns} />
    </>
  );
};

export default AuditTable;
