/**
 * @Description 审批流水详情
 */
import { FC, forwardRef, useState, useImperativeHandle } from 'react';
import { getYNApprovalRecord } from '@/common/api/fishtogether';
import V2Title from '@/common/components/Feedback/V2Title';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import Table from 'antd/es/table';
import styles from './index.module.less';

const Detail: FC<any> = forwardRef(({
  relationId, // 点位评估id
  approvalId, // 审批id
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
      ids:审批ids，可选，多类型时按逗号分隔，如"&ids=11,13,19"，审批详情时需要传审批id
      relationType: 审批类型（1开发异动申请、2点位保护申请、3店铺评估申请）
      typeValues: 数组 审批子类型（1选址转测评、2测评转选址、3终止任务、4变更责任人、5点位保护、6申请特例、7申请续签、8点位申请、9设计申请、10合同申请）
    */
    const data = await getYNApprovalRecord({
      relationId,
      ids: approvalId ? [approvalId] : [],
      relationType: 3,
      typeValues: [8, 9, 10],
    });
    setDetail(data);
  };

  const columns = [
    { title: '审批结果', dataIndex: 'statusName', },
    { title: '审批人', dataIndex: 'employeeName', },
    { title: '审批时间', dataIndex: 'operateTime', },
    { title: '审批意见', dataIndex: 'reason',
      width: 450,
      render: text => <div className={styles.preCon}>
        {text}
      </div>
    },
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
