import { FC } from 'react';
import Table from '@/common/components/FilterTable';
import { valueFormat } from '@/common/utils/ways';
import DetailInfo from '@/common/components/business/DetailInfo';
import { decorationStatus } from '@/common/enums/options';
import { isNotEmpty } from '@lhb/func';

const commonRender = { width: 220, render: (value: number | string) => valueFormat(value) };

interface IProps {
  costInfo: any;
}

const DecorationDetails: FC<IProps> = ({ costInfo }) => {
  const electricityStatus = () => {
    if (!isNotEmpty(costInfo.needIncrease)) return '-';
    if (!costInfo.needIncrease) return `当前电量${valueFormat(costInfo.power)}kw，不需要增容`;
    return `当前电量${valueFormat(costInfo.power)}kw，需要增容`;
  };

  const loadData = async () => {
    const {
      needIncrease,
      increaseCost,
      topStatus,
      topCost,
      floorStatus,
      floorCost,
      wallStatus,
      wallCost,
      waterStatus,
      waterCost,
      info,
      otherDecorateCost,
    } = costInfo;
    return {
      dataSource: [
        { name: '电量(kw)', status: electricityStatus(), value: !needIncrease ? '-' : increaseCost },
        { name: '顶面', status: decorationStatus[topStatus], value: topCost },
        { name: '地面', status: decorationStatus[floorStatus], value: floorCost },
        { name: '墙面', status: decorationStatus[wallStatus], value: wallCost },
        { name: '上下水情况', status: decorationStatus[waterStatus], value: waterCost },
        { name: '其他装修内容', status: info, value: otherDecorateCost },
      ],
    };
  };

  const columns = [
    { title: '项目名称', key: 'name', width: 200 },
    { title: '物业现状', key: 'status', ...commonRender },
    { title: '我司投入费用(万元)', key: 'value', ...commonRender },
  ];

  return (
    <>
      <Table className='mt-20 mb-34' rowKey='name' pagination={false} columns={columns} onFetch={loadData} />
      <DetailInfo title='装修内容简述' value={costInfo?.info} />
    </>
  );
};

export default DecorationDetails;
