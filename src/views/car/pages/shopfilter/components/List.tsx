import { FC, useMemo } from 'react';
import Tables from '@/common/components/FilterTable';
import { Typography } from 'antd';
import { useClientSize } from '@lhb/hook';
import { valueFormat } from '@/common/utils/ways';
import { TargetChild } from '../ts-config';
import { formatTableTitle } from './utils';

const { Link } = Typography;

const commonRender = { width: 120, render: (value: number | string) => valueFormat(value) };
const rateRender = {
  sorter: true,
  render: (value: number | string) => {
    if (typeof value === 'number') {
      return Math.round(value * 10000) / 100;
    } else {
      return '-';
    }
  },
};

interface IProps {
  loadData: Function;
  params: Record<string, any>;
  selection: Array<TargetChild>;
  tenantStatus: Number | undefined;
  setModalHintContent: Function;
  setVisible: Function;
}

const List: FC<IProps> = ({
  loadData,
  selection,
  params,
  tenantStatus,
  setModalHintContent,
  setVisible
}) => {
  // table 头部固定，动态获取剩余可视区的高度，超过这个区域头部固定中间内容滚动
  const scrollHeight = useClientSize().height - 340;

  // const renderStatus = (value: string, record: Record<string, any>) => {
  //   return <span className={approvalStatusClass(record.approveStatus)}>{value}</span>;
  // };

  const columns = useMemo(() => {
    const baseColumns: Array<any> = [
      {
        title: '商场名称',
        key: 'siteName',
        width: 200,
        fixed: 'left',
        render: (value: string, record) => (
          <Link href={`/car/resourcedetail?tenantPlaceId=${record.placeId}`}>{value}</Link>
        ),
      },
      {
        title: '所在城市',
        key: 'cityName',
        ...commonRender,
        width: 100,
      },
      // 汽车写死
      { title: `${params.industryId === 352 ? '汽车' : ''}巡展热度`, key: 'period', sorter: true, ...commonRender },
      { title: '日均客流指数', key: 'col0101', sorter: true, ...commonRender, width: 150 },
    ];
    selection.length &&
      selection.forEach((item: TargetChild) => {
        console.log(`metaType`, item.metaType);
        baseColumns.push({
          title: formatTableTitle(item),
          key: item.metaCode,
          ...rateRender,
          width: ['居住社区房价', '手机价格', '酒店消费水平', '所在行业', '餐饮消费水平'].indexOf(item.metaType) < 0 ? 150 : 230,
        });
      });
    return baseColumns;
  }, [selection, params]);
  // 分页区域点击
  const clickPaginationHandle = () => {
    // console.log(`tenantStatus`, tenantStatus);
    if (tenantStatus === 0) {
      setModalHintContent && setModalHintContent('联系客服，查看更多数据哦');
      setVisible(true);
    };
  };

  return (
    <Tables
      // className='mt-20'
      columns={columns}
      onFetch={loadData}
      filters={params}
      scroll={{ x: 'max-content', y: scrollHeight }}
      rowKey='index'
      clickPagination={clickPaginationHandle}
      paginationIsDisabled={tenantStatus === 0}
    />
  );
};

export default List;
