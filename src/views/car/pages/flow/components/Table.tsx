import {
  FC,
  useState
} from 'react';
import Tables from '@/common/components/FilterTable';
import { valueFormat } from '@/common/utils/ways';
import IconFont from '@/common/components/IconFont';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import ModalHint from '@/common/components/business/ModalHint';

const Table: FC<any> = ({
  loadData,
  params,
  tenantStatus
}) => {
  const [visible, setVisible] = useState<boolean>(false);// 试用版弹窗

  const jumpCheckHandle = (cameraId: number) => {
    // tenantStatus 0:试用企业，1：正式企业； 默认1
    if (tenantStatus === 0) {
      setVisible(true);
      return;
    }
    dispatchNavigate(`/monitoring?id=${cameraId}`);
  };

  const commonRender = {
    sorter: true,
    render: (value: number) => valueFormat(value),
  };

  const renderCompare = (value, compareValue) => {
    return compareValue < 0 ? <span className='c-f23'>{value}</span> : value;
  };

  const columns = [
    {
      title: '所在城市',
      key: 'cityName',
    },
    {
      title: '店铺名称',
      key: 'name',
      render: (value, record) =>
        <span
          className='c-244 pointer'
          onClick={() => dispatchNavigate(`/car/analysis?id=${record.id}`)}
        >
          {valueFormat(value)}
        </span>
    },
    {
      title: '门店类型',
      key: 'typeName',
    },
    {
      title: '营业日期',
      // TODO
      key: 'date',
      render: (value:string, record) =>
        (<span>
          {record.openDate}-{record.closeDate}
        </span>)
    },
    {
      title: '日均过店客流',
      key: 'passby',
      ...commonRender
    },

    {
      title: '进店情况',
      children: [
        { title: '日均人数', key: 'indoor', width: 80, sorter: true },
        {
          title: '进店率',
          key: 'indoorRate',
          width: 80,
          render: (text, record) => renderCompare(text, record.indoorRateCompare),
        },
      ],
    },
    {
      title: '留资情况',
      children: [
        { title: '日均人数', key: 'stayInfo', width: 80, sorter: true },
        {
          title: '留资率',
          key: 'stayInfoRate',
          width: 80,
          render: (text, record) => renderCompare(text, record.stayInfoRateCompare),
        },
      ],
    },
    {
      title: '试驾情况',
      children: [
        { title: '日均人数', key: 'testDrive', width: 80, sorter: true },
        {
          title: '试驾率',
          key: 'testDriveRate',
          width: 80,
          render: (text, record) => renderCompare(text, record.testDriveRateCompare),
        },
      ],
    },
    {
      title: '大定情况',
      children: [
        { title: '日均人数', key: 'order', width: 80, sorter: true },
        {
          title: '大定率',
          key: 'orderRate',
          width: 80,
          render: (text, record) => renderCompare(text, record.orderRateCompare),
        },
      ],
    },
    {
      title: '查看监控',
      key: 'monitoring',
      render: (value, record) =>
        <IconFont
          iconHref='icona-ic_shouyeshipin' onClick={() => jumpCheckHandle(record.cameraId)}
          className='fs-36 pointer'
        />
    },
  ];
  return (
    <>
      <Tables
        className='mt-20'
        columns={columns}
        onFetch={loadData}
        filters={params}
        rowKey='id'
      />
      <ModalHint
        visible={visible}
        setVisible={setVisible}
        content='购买产品后，即可查看本门店摄像数据'/>
    </>
  );
};

export default Table;
