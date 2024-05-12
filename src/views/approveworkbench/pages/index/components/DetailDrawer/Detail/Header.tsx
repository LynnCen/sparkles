/*
  审批详情标题栏
*/
import { FC, useMemo, useState } from 'react';
import { Button, message } from 'antd';
import { downloadFile } from '@/common/utils/ways';
import { exportYNChancepointPdf } from '@/common/api/fishtogether';
import V2Title from '@/common/components/Feedback/V2Title';
import styles from './index.module.less';
import { bigdataBtn } from '@/common/utils/bigdata';

const Top: FC<any> = ({
  aprDetail,
  detail
}) => {
  const [loading, setLoading] = useState(false);

  /**
   * @description 根据审批详情中的类型字段获取title
   * @return 展示用标题
   */
  const getTitle = useMemo(() => {
    // 各种状态的审批，标题不同
    if (!aprDetail) return '审批详情';
    // type  1：开发异动申请  2：点位保护申请 3：店铺评估申请
    // typeValue 1：选址转测评  2：测评转选址  3：终止任务  4：变更责任人  5：点位保护  6：申请特例  7：申请续签  8：店铺测评 11：跨公司调整
    const { type, typeValue } = aprDetail;
    const { reportName } = detail;
    const prefix = reportName ? `${reportName}-` : '';
    if (type === 1) {
      return typeValue === 1 ? '选址任务审批' : '测评任务审批';
    }
    if (type === 2) {
      return '点位区域保护申请 ';
    }
    if (type === 3) {
      if (typeValue === 9) {
        return `${prefix}提前设计申请`;
      } else if (typeValue === 10) {
        return `${prefix}合同审批申请`;
      }
      return `${prefix}点位评估申请`;
    }
    return '审批详情';
  }, [aprDetail, detail]);

  // 从src/common/components/business/Fishtogether/PointDetail/components/Detail/Header.tsx拷贝
  const handleExportReport = () => {
    bigdataBtn('0b63137b-86a9-42f0-b421-3e0f5aff75b1', '机会点', '机会点详情pc端导出报告', '导出了机会点详情');
    setLoading(true);
    exportYNChancepointPdf({ id: detail?.chancePointId }).then(({ url, name }: any) => {
      if (url) {
        downloadFile({
          name: name,
          url: url,
        });
      } else {
        message.warning('表格数据异常或无数据');
      }
    }).finally(() => {
      setLoading(false);
    });
  };

  return Object.keys(detail).length ? (
    <V2Title
      text={getTitle}
      className={styles.titleRow}
      extra={<>
        {
          // 鱼你审核被拒绝的话是没有机会点id的
          detail?.chancePointId ? <Button
            type='primary'
            onClick={handleExportReport}
            loading={loading}
            className='ml-4'>
              导出报告
          </Button> : null
        }
      </>
      }/>
  ) : <></>;
};

export default Top;
