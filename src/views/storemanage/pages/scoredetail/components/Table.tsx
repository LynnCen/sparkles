import V2Table from '@/common/components/Data/V2Table';
import { FC, useState } from 'react';
import styles from '../entry.module.less';
import { isArray } from '@lhb/func';
import { fixNumber, valueFormat } from '@/common/utils/ways';
const Table:FC<any> = ({
  tableInfo,
  mainHeight
}) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([tableInfo.scoreGroups[0].code]);
  const loadData = async () => {
    if (!isArray(tableInfo?.scoreGroups)) {
      return {
        dataSource: [],
        count: 0,
      };
    }
    return {
      dataSource: tableInfo.scoreGroups,
      count: tableInfo.scoreGroups.length,
    };
  };
  const defaultColumns: any[] = [
    { title: '评分项', dataIndex: 'name', key: 'name', },
    { title: '内容', dataIndex: 'value', key: 'value',
      render: (val, record) => <span>{handleValue(record)}</span>
    },
    { title: '得分', dataIndex: 'score', key: 'score',
      render: (val) => <span>{fixNumber(val)}</span>
    },
    { title: '权重', dataIndex: 'weight', key: 'weight', },
    { title: '加权得分', dataIndex: 'weightScore', key: 'weightScore',
      render: (val) => <span>{fixNumber(val)}</span>
    },
  ];

  const handleValue = (record) => {
    if (record.code === 'competeInformationList') {
      const parseVal = JSON.parse(record.value);

      if (isArray(parseVal) && parseVal.length) {
        return <div>
          {parseVal[0].brandName && <div>品牌名称：{parseVal[0].brandName}</div>}
          {parseVal[0].floor && <div>所在楼层：{parseVal[0].floor}层</div>}
          {parseVal[0].area && <div>面积：{parseVal[0].area}平米</div>}
          {parseVal[0].distance && <div>距离本店铺：{parseVal[0].distance}米</div>}
        </div>;
      } else {
        return <div></div>;
      }
    } else if (isArray(record.scoreItems) && record.scoreItems.length) {
      return <span>{record.value}</span>;
    } else {
      return <span>{valueFormat(record.value)}{record.value && getUnit(record.code)}</span>;
    }
  };

  const getUnit = (code) => {
    // 需要显示'个'单位的字段
    const fieldNamesOfCount: string[] = [
      'schoolCount', // 学校数量
      'officeBuildingCount', // 写字楼数量
      'communityCount', // 小区数量
      'mtOver1000CompetingShop', // 美团销量过千竞品门店
      'mtOver1000KeyShop', // 美团销量过千重点门店
      'elmOver1000CompetingShop', // 美团销量过千竞品门店
      'elmOver1000KeyShop', // 美团销量过千竞品门店
      'entertainmentStoreNum',
      'parkingNum',
      'restaurantsNum',
      'communityNum'
    ];
    // 需要显示'层'单位的字段
    const fieldNamesOfFloor: string[] = ['shopFloor'];
    // 需要显示'米'单位的字段
    const fieldNamesOfMeter: string[] = [
      'shopDepth',
      'shopWidth',
      'shopHeight',
      'flowLineDistance',
      'busStationDistance',
      'subwayStationDistance',
      'coreBusinessDistance',
      'escalatorEntranceDistance'
    ];
    // 需要显示'平米'单位的字段
    const fieldNamesOfSquareMeter: string[] = [
      'usableArea'
    ];
    // 需要显示'人次'单位的字段
    const fieldNamesOfPersonTime: string[] = [
      'flowWeekday',
      'flowWeekend',
    ];
    // 需要显示'条'单位的字段
    const fieldNamesOfLine: string[] = [
      'busLineNum',
      'subwayLineNum',
    ];
    // 需要显示'年'单位的字段
    const fieldNamesOfYear: string[] = [
      'openingYears',
    ];
    // 需要显示'%'单位的字段
    const fieldNamesOfPercentage: string[] = [
      'fullCoverageRate',
      'investmentCompletionRate',
      'roomRate'
    ];
    // 需要显示'万元'单位的字段
    const fieldNamesOfWY: string[] = [
      'mallAnnualSales'
    ];
    if (fieldNamesOfCount.includes(code)) {
      return '个';
    } else if (fieldNamesOfFloor.includes(code)) {
      return '层';
    } else if (fieldNamesOfMeter.includes(code)) {
      return '米';
    } else if (fieldNamesOfSquareMeter.includes(code)) {
      return '平米';
    } else if (fieldNamesOfPersonTime.includes(code)) {
      return '人次';
    } else if (fieldNamesOfLine.includes(code)) {
      return '条';
    } else if (fieldNamesOfYear.includes(code)) {
      return '年';
    } else if (fieldNamesOfPercentage.includes(code)) {
      return '%';
    } else if (fieldNamesOfWY.includes(code)) {
      return '万元';
    }
    return '';
  };

  // 嵌套子表格
  const expandedRowRender = (val) => {
    const childLoadData = async () => {
      if (!isArray(val.scoreItems)) {
        return {
          dataSource: [],
          count: 0
        };
      }
      return {
        dataSource: val.scoreItems,
        count: val.scoreItems.length,
      };
    };
    return <V2Table
      rowKey='code'
      showHeader={false}
      defaultColumns={defaultColumns}
      onFetch={childLoadData}
      hideColumnPlaceholder
      pagination={false}
    />;
  };

  return (
    <V2Table
      rowKey='code'
      onFetch={loadData}
      defaultColumns={defaultColumns}
      expandable={{
        expandedRowRender: (val) => expandedRowRender(val),
        onExpandedRowsChange: (val) => setExpandedRowKeys(val),
        expandedRowKeys: expandedRowKeys,
      }}
      hideColumnPlaceholder
      className={styles.tableCon}
      scroll={{ y: mainHeight - 64 - 60 }}
    />
  );
};
export default Table;
