import V2Table from '@/common/components/Data/V2Table';
import { FC, useState } from 'react';
import styles from '../entry.module.less';
import { isArray } from '@lhb/func';
const Table:FC<any> = ({
  tableInfo,
  mainHeight
}) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([tableInfo.scoreGroups[0].code]);
  const loadData = async () => {
    const data = tableInfo.scoreGroups.map((item) => {
      return {
        ...item,
        key: item.code
      };
    });
    if (!isArray(tableInfo?.scoreGroups)) {
      return {
        dataSource: [],
        count: 0,
      };
    }
    return {
      dataSource: data,
      count: data.length,
    };
  };

  const getUnit = (code) => {
    // 需要显示'个'单位的字段
    const fieldNamesOfCount: string[] = [
      'interSecLuxuryBrand',
      'interFirLuxuryBrand',
      'excellentRetailBrand',
      'excellentKidAmusementBrand',
      'excellentRetailStore',
      'excellentKidRetailBrand',
      'parkingNum',
      'kidSportBrand',
      'sportBrand',
      'largeAmusementFacility',
      'signedCompeteBrand'
    ];
    // 需要显示'层'单位的字段
    // const fieldNamesOfFloor: string[] = ['shopFloor'];
    // 需要显示'米'单位的字段
    const fieldNamesOfMeter: string[] = [
      'distance2SubwayStation',
      'distance2BusStation',
      'shopSignWidth'
    ];
    // 需要显示'平米'单位的字段
    const fieldNamesOfSquareMeter: string[] = [
      'usableArea',
      'commercialVolume'
    ];
    // 需要显示'人/天'单位的字段
    const fieldNamesOfPersonTime: string[] = [
      'flowWeekdayIndex',
      'flowWeekendIndex',
      'flowWeekday',
      'flowWeekend'
    ];
    // 需要显示'条'单位的字段
    // const fieldNamesOfLine: string[] = [
    //   // 'busLineNum',
    //   // 'subwayLineNum',
    // ];
    // 需要显示'年'单位的字段
    // const fieldNamesOfYear: string[] = [
    //   // 'openingYears',
    // ];
    // 需要显示'%'单位的字段
    const fieldNamesOfPercentage: string[] = [
      'fullShopRate',
    ];
    // 需要显示'分'单位的字段
    const fieldNamesOfPoints: string[] = [
      'flowMatchIndex',
    ];
    // 需要显示'亿元'单位的字段
    const fieldNamesOfTenBillion: string[] = [
      'mallAnnualSales'
    ];
    // 需要显示'万元'单位的字段
    const fieldNamesOfMillion: string[] = [
      'competeProductAnnualSaleFir',
      'competeProductAnnualSaleSec',
      'competeProductAnnualSaleThird',
    ];
    // 需要显示'家'单位的字段
    // const fieldNamesOfNum: string[] = [
    //   'signedCompeteBrand',
    // ];
    // 需要显示'人'单位的字段
    const fieldNamesOfPerson: string[] = [
      'populationWithin3km'
    ];
    if (fieldNamesOfCount.includes(code)) {
      return '个';
    } else if (fieldNamesOfMeter.includes(code)) {
      return '米';
    } else if (fieldNamesOfSquareMeter.includes(code)) {
      return '平米';
    } else if (fieldNamesOfPercentage.includes(code)) {
      return '%';
    } else if (fieldNamesOfPerson.includes(code)) {
      return '人';
    } else if (fieldNamesOfPoints.includes(code)) {
      return '分';
    } else if (fieldNamesOfPersonTime.includes(code)) {
      return '人/天';
    } else if (fieldNamesOfTenBillion.includes(code)) {
      return '亿元';
    } else if (fieldNamesOfMillion.includes(code)) {
      return '万元';
    }
    return '';
  };

  const defaultColumns: any[] = [
    { title: '评分项', dataIndex: 'name', key: 'name', },
    { title: '内容', dataIndex: 'value', key: 'value',
      render: (value, record) => <span>{value}{getUnit(record.code)}</span>
    },
    { title: '得分', dataIndex: 'score', key: 'score',
      render: (val) => <span>{Math.round(val)}</span>
    },
    { title: '权重', dataIndex: 'weight', key: 'weight', },
    { title: '加权得分', dataIndex: 'weightScore', key: 'weightScore',
      render: (val) => <span>{Math.round(val)}</span>
    },
  ];
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
      scroll={{ y: mainHeight - 64 - 42 }}
    />
  );
};
export default Table;
