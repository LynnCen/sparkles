import Table from '@/common/components/FilterTable';
import { useMethods } from '@lhb/hook';
import { FC, useState } from 'react';
import { getResourceCompare } from '@/common/api/audit';
import { resTemplateList } from '@/common/api/template';
// import { Button } from 'antd';
// import { dispatchNavigate } from '@/common/document-event/dispatch';
import styles from './entry.module.less';
import { urlParams } from '@lhb/func';
import Info from './components/Info';
import { Button } from 'antd';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import useGetInfoByeExamineOrderId from '../index/hooks/useGetInfoByeExamineOrderId';
// import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

const ApprovalDetail: FC<any> = ({ location }) => {
  const { resourceId, resourceType, examineOrderId, categoryId, status, type } = urlParams(location.search);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const columns = [
    // {
    //   title: '是否审核',
    //   width: 20,
    //   align: 'center',
    //   /** todo */
    //   render(_: any, record: any) {
    //     const { status } = record;
    //     if (status === 2) {
    //       return <CheckOutlined style={{ color: '#52c41a' }} />;
    //     }
    //     return <CloseOutlined style={{ color: '#ff4d4f' }} />;
    //   }
    // },
    { key: 'name', title: '字段名称', width: 100 },
    {
      key: 'examineCommitInfo',
      title: '审核内容',
      width: 150,
      render: (value, record) => <Info info={record.examineCommitInfo} controlType={record.controlType}/>
    },
    {
      key: 'examinePassInfo',
      title: '审核修改内容',
      width: 150,
      render: (value, record) => (record.examinePassInfo && (record.examinePassInfo !== record.examineCommitInfo)) ? <Info info={record.examinePassInfo} controlType={record.controlType}/> : '无'
    },
  ];

  // 审批未通过（拒绝类型中的新增类型不显示场地名称或者点位名称
  const isShow = status === '3' && type === '0';
  const { placeId, placeName, spotId, spotName } = useGetInfoByeExamineOrderId(examineOrderId);

  const { loadData/*, onResourceDetail*/ } = useMethods({
    loadData: async () => {
      const tmplResult = await resTemplateList({ resourcesType: resourceType, useType: 0 });
      const categoryTplId = tmplResult.objectList.length ? tmplResult.objectList[0].id : null;

      const params = {
        examineOrderId,
        categoryId,
        categoryTplId,
        resourceType,
        resourceId
      };
      const result = await getResourceCompare(params) || {};
      const { propertyCompareResponses } = result;
      const selectRowKeys = propertyCompareResponses.filter(item => item.status === 2).map(item => item.propertyId);

      setSelectedRowKeys(selectRowKeys);

      const dataSource: any = [];
      result.propertyCompareResponses && result.propertyCompareResponses.forEach(itm => {
        dataSource.push({ ...itm, isLabel: false, uid: 'label-' + itm.propertyId, name: itm.propertyName });
      });
      result.labelCompareResponses && result.labelCompareResponses.forEach(itm => {
        dataSource.push({ ...itm, isLabel: true, uid: 'prop-' + itm.id });
      });
      return {
        dataSource
      };
    },

    // onResourceDetail: () => {
    //   // 暂时还没有场地详情页，不处理
    //   // dispatchNavigate(`/resmng/detail?placeId=${resourceId}`);
    // }
  });

  // 详情
  const handleDetail = () => {
    dispatchNavigate(`/resmng/real-detail?id=${placeId}&resourceType=${resourceType}&categoryId=${categoryId}&isKA=false&activeKey=${resourceType === '0' ? '0' : spotId}`);
  };

  // 场地详情
  const handleDetailPlace = () => {
    dispatchNavigate(`/resmng/real-detail?id=${placeId}&resourceType=${0}&categoryId=${categoryId}&isKA=false`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainWrap}>
        {!isShow && (
          <h2 className={styles.title}>
            <span style={{ marginRight: 14 }}>
              <Button
                type='link'
                onClick={handleDetail}
              >{resourceType === '0' ? '场地' : '点位'}名称:{resourceType === '0' ? placeName : spotName}</Button>
            </span>
            <Button
              type='link'
              onClick={handleDetailPlace}
            >{resourceType === '1' && <span>场地名称:{placeName}</span>}</Button>
          </h2>
        )}
        {/* <p className={styles.tip}>与”杭州龙湖西溪天街“重复，审核内容仅显示与资源中心场地有差异的字段。</p> */}
        <Table
          rowKey='propertyId'
          onFetch={loadData}
          pagination={false}
          columns={columns}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys,
            getCheckboxProps () {
              return {
                disabled: true
              };
            }
          }

          }
        />
      </div>
      {/* <div className={styles.footerCon}>
        <Button type='primary' onClick={onResourceDetail}>场地详情</Button>
      </div> */}
    </div>
  );
};

export default ApprovalDetail;
