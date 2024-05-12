import { FC, useState } from 'react';
import { KeepAlive, useActivate } from 'react-activation';
import { PageContainer, SearchForm, SearchTableContainer, Table } from '@/common/components';
import { Tabs, Typography, Space } from 'antd';
import { Link } from 'react-router-dom';
import FormInput from '@/common/components/Form/FormInput';
import styles from './entry.module.less';
import FormRangePicker from '@/common/components/Form/FormRangePicker';
import { useSearchForm } from '@/common/hook';
import { getList, Info } from '@/common/api/purchaseTask';
import dayjs from 'dayjs';
import { useMethods } from '@lhb/hook';
import Status from '@/views/sales/pages/index/components/Status';
import { OperateButtonProps, FormattingPermission } from '@/common/components/Operate/ts-config';
import Operate from '@/common/components/Operate';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import { refactorPermissions } from '@lhb/func';

const { Text } = Typography;

const items = [
  { label: '全部', key: null as any },
  { label: '待处理', key: '1' },
  { label: '已下单', key: '2' },
  { label: '已拒绝', key: '3' },
];

// 状态映射
export const statusMap = new Map([
  [1, 'warning'],
  [2, 'success'],
  [3, 'error'],
]);

const PurchaseTask: FC<any> = () => {
  const [tableProps, { onReset, onSearch, searchParams, onRefresh }] = useSearchForm(getList, (values: any) => {
    const { date, ...resetValues } = values;
    const [start, end] = date || [];
    return {
      ...resetValues,
      start: start ? dayjs(start).format('YYYY-MM-DD') : '',
      end: end ? dayjs(end).format('YYYY-MM-DD') : '',
      status: activeKey,
    };
  });

  useActivate(onRefresh);

  const [activeKey, setActiveKey] = useState<string | null>(null);

  const onChange = (activeKey: string) => {
    setActiveKey(activeKey);
    onSearch?.({ ...searchParams });
  };

  const methods = useMethods({
    toSpotDetail(spotId: number) {
      window.open(`${process.env.RESOURCE_SERVICE_URL}/pointMng/detail?tenantSpotId=${spotId}`);
    },
    handleDetail(record: any) {
      dispatchNavigate(`/purchaseTask/detail?id=${record.id}`);
    },
    handleProcess(record: any) {
      dispatchNavigate(`/purchaseTask/edit?id=${record.id}`);
    },
  });

  const columns = [
    {
      title: '采购单号及商家名称',
      key: 'number',
      dataIndex: 'number',
      width: 250,
      render(_: string, record: Info) {
        const { number, enterName } = record;
        return (
          <Space direction='vertical'>
            <Text copyable={{ text: number }}>
              <Link to='' style={{ padding: 0 }}>{number}</Link>
            </Text>
            <Text ellipsis={{ tooltip: enterName }}>
              {enterName}
            </Text>
          </Space>
        );
      }
    },
    {
      title: '场地点位',
      dataIndex: 'spotName',
      width: 200,
      key: 'spotName',
      render(_: string, record: Info) {
        const { placeName, spotId } = record;
        return (
          <Space >
            <Text ellipsis={{ tooltip: placeName }}>
              <span className='pointer color-primary' onClick={() => methods.toSpotDetail(spotId as number)}>{placeName}</span>
            </Text>
          </Space>
        );
      }
    },
    {
      title: '品牌',
      dataIndex: 'brand',
      key: 'brand',
      width: 200,
      render(_: string, recoder: Info) {
        const { brand } = recoder;
        return <Text ellipsis={{ tooltip: brand }} style={{ maxWidth: 200 }}>
          {brand}
        </Text>;
      }
    },
    {
      title: '活动名称及活动时间',
      dataIndex: 'title',
      width: 200,
      key: 'title',
      render(_: string, record: Info) {
        const { title, dates } = record;
        return (
          <Space direction='vertical' >
            <Text ellipsis={{ tooltip: dates?.join(',') }} style={{ maxWidth: 200 }}>
              {title}
            </Text>
            <Text ellipsis={{ tooltip: dates?.join(',') }} style={{ maxWidth: 200 }}>
              {dates?.join(',')}
            </Text>
          </Space>
        );
      }
    },
    {
      title: '备注',
      dataIndex: 'mark',
      key: 'mark',
      width: 200,
      render(_: string, recoder: Info) {
        const { mark } = recoder;
        return (
          <Text ellipsis={{ tooltip: mark }} style={{ maxWidth: 200 }}>
            {mark || '-'}
          </Text>
        );
      }
    },
    {
      title: '当前状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render(_: string, recoder: Info) {
        const { statusName, status } = recoder;
        return (
          <Status type={statusMap.get(status as number) as any}>{statusName}</Status>
        );
      }
    },
    {
      dataIndex: 'permissions',
      key: 'permissions',
      width: 180,
      title: '操作',
      fixed: 'right',
      render: (value: OperateButtonProps, record: Info) => (
        <Operate
          operateList={refactorPermissions(value || [])}
          onClick={(btn: FormattingPermission) => methods[btn.func](record)}
        />
      ),
    }
  ];

  // 搜索条件
  const renderSearchForm = () => {
    return (
      <>
        <Tabs items={items} activeKey={activeKey as any} onChange={onChange}/>
        <SearchForm moreBtn={false} onSearch={onSearch} onReset={onReset} >
          <FormInput placeholder='请输入采购单号' label='采购单号' name='number'/>
          <FormInput placeholder='请输入场地点位名称' label='场地点位' name='placeName'/>
          <FormInput placeholder='请输入商家名称' label='商家名称' name='enterName'/>
          <FormInput placeholder='请输入品牌名称' label='品牌名称' name='brandName'/>
          <FormInput placeholder='请输入活动名称' label='活动名称' name='title'/>
          <FormRangePicker config={{ style: { width: '100%' } }} name='date' label='活动日期' />
        </SearchForm>
      </>
    );
  };

  return (
    <KeepAlive>
      <div className={styles.container}>
        <PageContainer noMargin>
          <SearchTableContainer topComponent={renderSearchForm()}>
            <Table {...tableProps} rowKey='id' columns={columns} />
          </SearchTableContainer>
        </PageContainer>
      </div>
    </KeepAlive>
  );
};

export default PurchaseTask;
