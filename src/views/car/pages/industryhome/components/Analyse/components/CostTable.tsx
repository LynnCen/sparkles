import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
// import { replaceEmpty } from '@lhb/func';
import { carHomeTable } from '@/common/api/carhome';
import Table from '@/common/components/FilterTable';
import IconFont from '@/common/components/IconFont';
import Empty from '@/common/components/Empty';

const CostTable: FC<any> = ({
  params,
  setVisible,
  setContent,
  tenantStatus
}) => {
  const navigate = useNavigate();

  const jumpHandle = (id) => {
    navigate(`/car/analysis?id=${id}`);
  };

  const jumpMonitoring = (id) => {
    // tenantStatus 0:试用企业，1：正式企业； 默认1
    if (tenantStatus === 0) {
      setVisible(true);
      setContent('购买产品后，即可查看门店摄像数据');
      return;
    }
    navigate(`/monitoring?id=${id}`);
  };

  const jumpMore = () => {
    if (tenantStatus === 0) {
      setVisible(true);
      setContent('购买产品后，即可查看更多门店数据');
      return;
    }
    navigate(`/car/cost`);
  };

  const renderCompare = (value, compareValue) => {
    return compareValue > 0 ? <span className='c-f23'>{value}</span> : value;
  };

  const columns = [
    {
      title: '店铺名称',
      key: 'name',
      width: 170,
      fixed: 'left',
      ellipsis: true,
      render: (text, record) => (
        <div className='color-primary-operate fs-14' onClick={() => jumpHandle(record.id)}>
          {text}
        </div>
      ),
    },
    { title: '所在城市', key: 'cityName', width: 80 },
    {
      title: '门店类型',
      key: 'type',
      width: 80,
      render: () => <div>快闪店</div>,
    },
    {
      title: '营业日期',
      key: 'operation',
      width: 210,
      render: (text, record) => (
        <div>
          {record.openDate} - {record.closeDate}
          {/* {record.openDate ? replaceEmpty(record.openDate, '-', '.') : ''}
        -
        {record.closeDate ? replaceEmpty(record.closeDate, '-', '.') : ''} */}
        </div>
      ),
    },
    {
      title: '单位过店成本（元）',
      key: 'passbyCost',
      width: 150,
      render: (text, record) => renderCompare(text, record.passbyCostCompare),
    },
    {
      title: '单位进店成本（元）',
      key: 'indoorCost',
      width: 150,
      render: (text, record) => renderCompare(text, record.indoorCostCompare),
    },
    {
      title: '单位留资成本（元）',
      key: 'stayInfoCost',
      width: 150,
      render: (text, record) => renderCompare(text, record.stayInfoCostCompare),
    },
    {
      title: '单位试驾成本（元）',
      key: 'testDriveCost',
      width: 150,
      render: (text, record) => renderCompare(text, record.testDriveCostCompare),
    },
    {
      title: '单位大定成本（元）',
      key: 'orderCost',
      width: 150,
      render: (text, record) => renderCompare(text, record.orderCostCompare),
    },
    { title: '租金（元）', key: 'rent', width: 80 },
    {
      title: '查看监控',
      key: 'monitoring',
      width: 70,
      align: 'center',
      fixed: 'right',
      render: (text, record) => (
        <div className='ct'>
          <IconFont
            iconHref='icona-ic_shouyeshipin'
            className='fs-24 pointer'
            onClick={() => jumpMonitoring(record.monitoringId)}
          ></IconFont>
        </div>
      ),
    },
  ];
  const loadData = async () => {
    // https://yapi.lanhanba.com/project/353/interface/api/34427
    const result = await carHomeTable(params);
    return { dataSource: result };
  };
  return (
    <>
      {params?.battles?.length ? (
        <>
          <Table
            rowKey='id'
            // scroll={{ x: 'max-content', y: 500 }}
            pagination={false}
            columns={columns}
            filters={params}
            onFetch={loadData}
          />
          <div className='rt color-primary-operate mt-20 mr-24' onClick={() => jumpMore()}>
            查看更多
          </div>
        </>
      ) : (
        <Empty />
      )}
    </>
  );
};

export default CostTable;
