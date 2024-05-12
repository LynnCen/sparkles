import Table from '@/common/components/FilterTable';
import { useMethods } from '@lhb/hook';
import { FC, useState } from 'react';
import { getResourceCompare, postExaminePassUpdate } from '@/common/api/audit';
import { Button, message, Space } from 'antd';
// import { post } from '@/common/request';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import styles from './entry.module.less';
import { urlParams } from '@lhb/func';
import { ConfirmModal } from '@/common/components/Modal/ConfirmModal';
import Info from '@/views/resaudit/pages/approvalDetail/components/Info';
import RejectButton from '../add/RejectButton';
import useGetInfoByeExamineOrderId from '../index/hooks/useGetInfoByeExamineOrderId';

const Compare: FC<any> = () => {
  const {
    examineOrderId,
    categoryId,
    categoryTemplateId: categoryTplId,
    resourceType,
    resourceId,
    placeName: urlPlaceName,
    backUrl
  } = urlParams(location.search);

  const [selectRows, setSelectRows] = useState<any>([]);
  const { placeName, spotName, placeId, spotId } = useGetInfoByeExamineOrderId(examineOrderId, resourceId);
  const realPlaceName = placeName || decodeURIComponent(urlPlaceName);
  const realPlaceId = placeId || resourceId;
  const realName = resourceType === '0' ? placeName : spotName;

  const columns = [
    { key: 'name', title: '字段名称', width: 100 },
    {
      key: 'resourceInfo',
      title: '原内容',
      width: 150,
      render: (value, record) => <Info info={record.resourceInfo} controlType={record.controlType}/>
    },
    {
      key: 'examineCommitInfo',
      title: '新内容',
      width: 150,
      render: (value, record) => <Info info={record.examineCommitInfo} controlType={record.controlType}/>
    },
    {
      key: 'examineUpdateInfo',
      title: '编辑内容',
      width: 150,
      render: (value, record) => <Info info={record.examineUpdateInfo} controlType={record.controlType}/>
    },
  ];

  const { loadData, onEdit, onOk, confirmSubmit } = useMethods({
    loadData: async () => {
      const params = {
        examineOrderId,
        categoryId,
        categoryTplId,
        resourceType,
        resourceId
      };
      const result = await getResourceCompare(params);
      // 展示与相似场地有差异、或者编辑过的字段
      const propertyList = result.propertyCompareResponses ? result.propertyCompareResponses.filter(itm => itm.examineUpdateInfo || (itm.resourceInfo !== itm.examineCommitInfo)) : [];

      const labelList = result.labelCompareResponses ? result.labelCompareResponses.filter(itm => itm.examineUpdateInfo || (itm.resourceInfo !== itm.examineCommitInfo)) : [];

      const dataSource: any = [];
      propertyList.forEach(itm => {
        dataSource.push({ ...itm, isLabel: false, uid: 'prop-' + itm.propertyId, name: itm.propertyName });
      });
      labelList.forEach(itm => {
        dataSource.push({ ...itm, isLabel: true, uid: 'label-' + itm.id });
      });
      return {
        dataSource
      };
    },
    onEdit() {
      dispatchNavigate(`/resaudit/add?examineOrderId=${examineOrderId}&categoryId=${categoryId}&categoryTemplateId=${categoryTplId}&isEdit=1&resourceId=${resourceId}&resourceType=${resourceType}&placeName=${placeName}&name=${realName}`);
    },
    onOk() {
      if (!selectRows.length) {
        message.warn('请勾选审核通过的字段');
        return;
      }
      ConfirmModal({ content: '是否确认审核通过?', onSure: () => confirmSubmit() });
    },
    confirmSubmit() {
      const params = {
        examineOrderId,
        resourceId,
        propertyIds: selectRows.filter(itm => itm.propertyId).map(itm => itm.propertyId),
        labelGroupIds: selectRows.filter(itm => !itm.propertyId).map(itm => itm.id),
      };
      postExaminePassUpdate(params).then(() => {
        message.success('操作成功');
        if (backUrl) {
          setTimeout(() => {
            dispatchNavigate(backUrl);
          }, 3000);
        } else {
          setTimeout(() => {
            dispatchNavigate('/resaudit');
          }, 1500);
        }
      });
    }
  });

  // 详情
  const handleDetail = () => {
    dispatchNavigate(`/resmng/real-detail?id=${realPlaceId}&resourceType=${resourceType}&categoryId=${categoryId}&isKA=false&activeKey=${resourceType === '0' ? '0' : spotId}`);
  };

  const handleDetailPlaceName = () => {
    dispatchNavigate(`/resmng/real-detail?id=${realPlaceId}&resourceType=${0}&categoryId=${categoryId}&isKA=false`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainWrap}>
        <p className={styles.tip}>仅对比有差异的字段。请勾选审核通过的字段，审核通过后，将用新内容替换原字段内容。您可以先对新内容进行编辑，然后通过审核</p>
        <h2 className={styles.title}>
          <span style={{ marginRight: 14 }}>
            <Button
              type='link'
              onClick={handleDetail}
            >{resourceType === '0' ? '场地' : '点位'}名称:{realName}</Button>
          </span>
          <Button
            type='link'
            onClick={handleDetailPlaceName}
          >{resourceType === '1' && <span>场地名称:{realPlaceName}</span>}</Button>
        </h2>
        <Table
          rowKey='uid'
          onFetch={loadData}
          pagination={false}
          columns={columns}
          rowSelection={{
            onChange: (selectedRowKeys, selectedRows) => {
              setSelectRows(selectedRows);
            },
          }}
        />
      </div>
      <div className={styles.footerCon}>
        <Space size={16}>
          <Button type='primary' onClick={onEdit}>编辑</Button>
          <RejectButton backUrl={backUrl} id={examineOrderId}/>
          <Button type='primary' disabled={selectRows.length === 0} onClick={onOk}>通过</Button>
        </Space>
      </div>
    </div>
  );
};

export default Compare;
