/**
 * @Description 标准版本-审批流水详情
 */
import { FC, forwardRef, useState, useImperativeHandle } from 'react';
import V2Title from '@/common/components/Feedback/V2Title';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import Table from 'antd/es/table';
import styles from './index.module.less';
import { getApprovalRecord } from '@/common/api/expandStore/approveworkbench';

const Detail: FC<any> = forwardRef(({
  relationId, // 点位评估id
}, ref) => {
  useImperativeHandle(ref, () => ({
    onload: () => {
      getDetail();
    },
  }));

  const [detail, setDetail] = useState<any>({});

  const getDetail = async () => {
    /*
      relationId:点位评估id
      ids:审批ids，可选，多类型时按逗号分隔，如"&ids=11,13,19"
      relationType: TODO 标准版本固定传1
      typeValues: [1] 标准版本固定传，未来迭代维护
    */
    const params = {
      relationId,
      ids: [],
      relationType: 1,
      typeValues: [1],
    };

    // 标准版本和鱼你版本请求的接口不一致
    const data = await getApprovalRecord({ ...params });
    setDetail(data);
  };

  const columns = [
    { title: '审批结果', dataIndex: 'statusName', },
    { title: '审批人', dataIndex: 'employeeName', },
    { title: '审批时间', dataIndex: 'operateTime', },
    { title: '审批意见', dataIndex: 'reason', },
  ];

  const transferRecords = (records: any) => {
    return Array.isArray(records) ? records.map((rcd: any, index: any) => ({ ...rcd, index })) : [];
  };

  return (
    <>
      <V2Title text='审批结果'/>
      {!!Array.isArray(detail.typeValueCategories) && detail.typeValueCategories.length ? detail.typeValueCategories.map((category: any, idx: number) => (<div key={idx}>
        <div className={styles.typeHeader}>
          <TitleTips name={category.typeValueName} showTips={false}/>
          <span className='fs-14 c-132'>{category.statusName}</span>
        </div>
        <Table
          pagination={false}
          columns={columns}
          dataSource={transferRecords(category.records)}
          rowKey='index'
        />
      </div>)) : <div className='mt-20 fs-14'>暂无审批数据</div>
      }
    </>
  );
});

export default Detail;
