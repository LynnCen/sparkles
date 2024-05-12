import { FC } from 'react';
// import { Button } from 'antd';
import { ManageListTableProps } from '../ts-config';
import Tables from '@/common/components/FilterTable';
// import ModalExport from '@/common/components/business/ModalExport';
// import { orderExport } from '@/common/api/order';
import { valueFormat } from '@/common/utils/ways';
import { useClientSize } from '@lhb/hook';

const commonRender = { width: 120, render: (value: number) => valueFormat(value) };

const Table: FC<ManageListTableProps> = ({ loadData, searchParams }) => {
  // const [exportVisible, setExportVisible] = useState(false);
  // table 头部固定，动态获取剩余可视区的高度，超过这个区域头部固定中间内容滚动
  const scrollHeight = useClientSize().height - 340;

  const columns = [
    { title: '店铺名称', key: 'name', fixed: 'left', width: 200 },
    { title: '店铺编号', key: 'number', ...commonRender, width: 100 },
    { title: '营业日期', key: 'date', ...commonRender },
    { title: '销售额（元）', key: 'saleAmount', ...commonRender },
    { title: '订单量（笔）', key: 'order', ...commonRender },
    { title: '客单价（元）', key: 'unitPrice', ...commonRender },
    {
      title: '渠道营业构成',
      key: 'trench',
      children: [
        {
          title: '店内销售',
          key: 'dnxs',
          children: [
            { title: '销售额（元）', key: 'storeSaleAmount', ...commonRender },
            { title: '订单量（笔）', key: 'storeOrder', ...commonRender },
            { title: '客单价（元）', key: 'storeUnitPrice', ...commonRender },
          ],
        },
        {
          title: '美团外卖',
          key: 'mtwm',
          children: [
            { title: '销售额（元）', key: 'mtSaleAmount', ...commonRender },
            { title: '订单量（笔）', key: 'mtOrder', ...commonRender },
            { title: '客单价（元）', key: 'mtUnitPrice', ...commonRender },
          ],
        },
        {
          title: '饿了么外卖',
          key: 'elmwm',
          children: [
            { title: '销售额（元）', key: 'elSaleAmount', ...commonRender },
            { title: '订单量（笔）', key: 'elOrder', ...commonRender },
            { title: '客单价（元）', key: 'elUnitPrice', ...commonRender },
          ],
        },
      ],
    },
  ];

  // const downloadHandle = (
  //   <Button type='primary' onClick={() => setExportVisible(true)}>
  //     下载明细
  //   </Button>
  // );

  // const onOk = async (values: any) => {
  //   await orderExport({ ...searchParams, ...values });
  //   setExportVisible(false);
  // };

  return (
    <>
      <Tables
        columns={columns}
        onFetch={loadData}
        filters={searchParams}
        className='mt-20'
        scroll={{ x: 'max-content', y: scrollHeight }}
        rowKey='id'
        bordered={true}
      />
      {/* <ModalExport open={exportVisible} onOk={onOk} onClose={() => setExportVisible(false)} /> */}
    </>
  );
};

export default Table;
