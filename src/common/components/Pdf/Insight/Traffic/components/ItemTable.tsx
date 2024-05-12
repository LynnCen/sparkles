import { FC, useState, useEffect } from 'react';
import { Table } from 'antd';
import styles from '../../entry.module.less';

const ItemTable: FC<any> = ({
  type,
  radius,
  label,
  listData,
}) => {

  const [rankingData, setRrankingData] = useState<any>({
    str: '',
    data: [],
    tableParams: []
  });

  useEffect(() => {
    if (Array.isArray(listData) && listData.length) {
      const targetList = listData.filter((item, index) => index < 5).map((item, index) => ({ ...item, index: index + 1 }));
      const str = `${listData[0].name}距离目标位置最近（${listData[0].distance}m），可带来大量潜在客源`;
      setRrankingData({
        str: type === 1 ? str : '',
        data: targetList,
        tableParams: getTableParams(label)
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listData]);

  const getTableParams = (targetLabel: string) => {
    if (type === 1) { // 圆形
      return [
        { dataIndex: 'index', title: '序号' },
        { dataIndex: 'name', title: targetLabel },
        { dataIndex: 'distance', title: '距离(m)' },
      ];
    } else if (type === 2) { // 自定义区域
      return [
        { dataIndex: 'index', title: '序号' },
        { dataIndex: 'name', title: targetLabel },
      ];
    }
    return [];
  };

  return (
    <>
      {
        rankingData.data.length > 0 && (
          <>
            <div className='fs-18 bold'>
              { type === 1 ? `范围内${label}(${radius})` : `范围内${label}`}
              { rankingData.str ? <div className={styles.summaryStrCon}>
                {rankingData.str}
              </div> : null
              }
            </div>
            <Table
              rowKey='name'
              dataSource={rankingData.data}
              columns={rankingData.tableParams}
              pagination={false}
              className='mt-20'/>
          </>
        )
      }
    </>
  );
};

export default ItemTable;
