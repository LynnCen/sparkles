/**
 * @Description 拓店任务详情Drawer-匹配点位列表
 */
import { FC } from 'react';
import { Typography } from 'antd';
import V2Table from '@/common/components/Data/V2Table';
import styles from '../index.module.less';

const { Link } = Typography;

const Evaluations: FC<any> = ({
  evaluations,
  isLoaded,
  onPointDetail // 查看点位详情
}) => {
  const defaultColumns = [
    {
      title: '点位名称',
      key: 'name',
      width: 100,
      render: (text, record) => <Link onClick={() => {
        onPointDetail && onPointDetail(record);
      }}>{text}</Link>,
    },
    {
      title: '城市',
      key: 'cityName',
      width: 100,
    },
    {
      title: '面积(m²)',
      key: 'usableArea',
      width: 100,
    },
    {
      title: '匹配日期',
      key: 'matchDate',
      width: 100,
    },
    {
      title: '当前进展',
      key: 'statusName',
      width: 100,
    },
    {
      title: '是否匹配',
      key: 'isMatch',
      width: 100,
      render: (text) => (text ? '是' : '否'),
    },
    {
      title: '解除匹配原因',
      key: 'releaseReason',
      width: 100,
      render: (text) => text || '-',
    },
  ];

  const loadData = async () => {
    return { dataSource: evaluations, count: evaluations.length };
  };

  return (
    <>
      <div className={styles.point}>
        <div className={styles.title}>点位匹配情况</div>
      </div>
      {
        isLoaded ? <V2Table
          onFetch={loadData}
          // filters={params}
          defaultColumns={defaultColumns}
          rowKey='id'
          scroll={{ y: 300 }}
          hideColumnPlaceholder
          pagination={false}
        /> : null
      }
    </>
  );
};
export default Evaluations;
