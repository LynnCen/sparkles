/**
 * @Description 城市分析-行政区信息对比
 */

import V2Table from '@/common/components/Data/V2Table';
import { Modal } from 'antd';
import { useEffect, useState } from 'react';

const DistrictModal = ({ open, setOpen, data }) => {
  /* status */
  const [filters, setFilters] = useState<any>({});
  const defaultColumns = [
    { key: 'districtName', title: '区域', width: 64 },
    // { key: 'householdPopulation', title: '户籍人口数', width: 116, render: (value) => value ? `${value} 万人` : '-' },
    { key: 'avgHousePrice', title: '行政区住房均价', width: 144, render: (value) => value ? `${value} 元` : '-' },
    { key: 'population', title: '常住人口数｜占比', render: (value, record) => value ? `${value} 万人｜${record.populationRate}%` : '-' },
    { key: 'gdp', title: '行政区 GDP｜占比', render: (value, record) => value ? `${value} 亿元｜${record.gdpRate}%` : '-' },
  ];

  /* hooks */
  useEffect(() => {
    if (open) {
      setFilters({ ...filters });
    }
  }, [open]);

  /* methods */
  const loadData = () => {
    return {
      dataSource: data || [],
      count: data?.length
    };
  };

  return (
    <Modal
      title='行政区信息对比'
      open={open}
      width={800}
      onCancel={() => setOpen(false)}
      footer={null}
    >
      <V2Table
        rowKey='districtName'
        pagination={false}
        type='easy'
        filters={filters}
        defaultColumns={defaultColumns}
        onFetch={loadData}
        scroll={{ x: 'max-content', y: 500 }}
        hideColumnPlaceholder
      />
    </Modal>
  );
};

export default DistrictModal;
