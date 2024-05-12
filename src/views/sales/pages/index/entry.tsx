import { FC, useState } from 'react';
import { Button, Space, Tabs, Tooltip, Typography } from 'antd';
import { KeepAlive, useActivate } from 'react-activation';

import { PageContainer, SearchForm, SearchTableContainer, Table } from '@/common/components';
import { useSearchForm } from '@/common/hook';

import FormInput from '@/common/components/Form/FormInput';
import styles from './entry.module.less';
import FormRangePicker from '@/common/components/Form/FormRangePicker';
import { getList } from '@/common/api/sales';
import dayjs from 'dayjs';
import Status from './components/Status';
import Action from '@/views/sales/components/Action';
import Operate from '@/common/components/Operate';
import { useMethods } from '@lhb/hook';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import { InfoCircleOutlined } from '@ant-design/icons';
import { renderPriceText } from '../add/components/AddPoint';
import { refactorPermissions } from '@lhb/func';


export const gotoResourecerService = (spotId: number) => {
  window.open(`${process.env.RESOURCE_SERVICE_URL}/pointMng/detail?tenantSpotId=${spotId}`);
};

const { Text } = Typography;

const items = [
  {
    label: '全部',
    key: null as any
  },
  {
    label: '待审核',
    key: '2'
  },
  {
    label: '待执行',
    key: '3'
  },
  {
    label: '执行中',
    key: '4'
  },
  {
    label: '已完成',
    key: '5'
  },
  {
    label: '已取消',
    key: '7'
  },
  {
    label: '已拒绝',
    key: '6'
  }
];

const renderPrice = (depositFee: number, saleFee: number, placeFee, serviceFee, otherFee) => {
  const colorStyle = {
    color: 'rgba(255, 255, 255, 1)'
  };
  return (
    <>
      <div className={styles.priceWrapper}>
        <span className={styles.priceLabel}>应收收入:</span>
        <Space>
          <span>¥{saleFee}</span>
          <Tooltip title={
            <Space direction='vertical' style={colorStyle}>
              <Space>
        场地费:
                <span >
                  {renderPriceText(placeFee)}
                </span>
              </Space>
              <Space>
       服务费:
                <span>
                  {renderPriceText(serviceFee)}
                </span>
              </Space>
              <Space>
        其他费用:
                <span>
                  {renderPriceText(otherFee)}
                </span>
              </Space>
            </Space>
          }>
            <InfoCircleOutlined />
          </Tooltip>
        </Space>
      </div>
      <div className={styles.priceWrapper} style={{ marginRight: 24 }}>
        <span className={styles.priceLabel}>押金:</span>
        ¥{depositFee}
      </div>
    </>
  );
};

// 状态映射
export const statusMap = new Map([
  [2, 'warning'],
  [3, 'warning'],
  [4, 'processing'],
  [5, 'success'],
  [6, 'error'],
  [7, 'default']
]);

const Sales: FC<any> = () => {
  const [tableProps, { onReset, onSearch, searchParams, onRefresh, }, meta = {}] = useSearchForm(getList, (values: any) => {
    const { date, ...resetValues } = values;
    const [start, end] = date || [];
    return {
      ...resetValues,
      start: start ? dayjs(start).format('YYYY-MM-DD') : '',
      end: end ? dayjs(end).format('YYYY-MM-DD') : '',
      status: activeKey,
    };
  });

  const { permissions = [] } = meta || {};
  const btns = refactorPermissions(permissions).map(item => ({ ...item, type: 'primary' }));

  useActivate(onRefresh);

  const [activeKey, setActiveKey] = useState<string | null>(null);

  const onChange = (activeKey: string) => {
    setActiveKey(activeKey);
    onSearch?.({ ...searchParams });
  };

  const columns = [
    {
      title: '销售单号及商家名称',
      key: 'number',
      dataIndex: 'number',
      width: 250,
      render(_: string, record: any) {
        const { number, enterName } = record;
        return (
          <Space direction='vertical'>
            <Text copyable={{ text: number }}>
              <Button style={{ padding: 0 }} type='link'>{number}</Button>
            </Text>
            <Text ellipsis={{ tooltip: enterName }} style={{ maxWidth: 200 }}>
              {enterName}
            </Text>
          </Space>
        );
      }
    },
    {
      title: '场地点位',
      dataIndex: 'spotName',
      width: 150,
      key: 'spotName',
      render(_: string, record: any) {
        const { spotName, placeName, spotId } = record;
        return (
          <Space >
            <Button
              style={{ padding: 0 }}
              type='link'
              onClick={() => gotoResourecerService(spotId)}>
              {placeName}-{spotName}
            </Button>
          </Space>
        );
      }
    },
    {
      title: '活动名称及活动时间',
      dataIndex: 'title',
      width: 150,
      key: 'title',
      render(_: string, record: any) {
        const { title, displayDates } = record;
        return (
          <Space direction='vertical' >
            <Text ellipsis={{ tooltip: displayDates?.join(',') }} style={{ maxWidth: 150 }}>
              {title}
            </Text>
            <Text ellipsis={{ tooltip: displayDates?.join(',') }} style={{ maxWidth: 150 }}>
              {displayDates?.join(',')}
            </Text>
          </Space>
        );
      }
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 150,
      render(_: string, recoder: any) {
        const { price } = recoder;
        const { depositFee, saleFee, placeFee, otherFee, serviceFee } = price || {};
        return renderPrice(depositFee, saleFee, placeFee, serviceFee, otherFee);
      }
    },
    {
      title: '备注',
      dataIndex: 'mark',
      key: 'mark',
      width: 200,
      render(_: string, recoder: any) {
        const { mark } = recoder;
        return (
          <Text ellipsis={{ tooltip: mark }} style={{ maxWidth: 300 }}>
            {mark}
          </Text>
        );
      }
    },
    {
      title: '当前状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render(_: string, recoder: any) {
        const { statusName, status } = recoder;
        return (
          <Status type={statusMap.get(status) as any}>{statusName}</Status>
        );
      }
    },
    {
      dataIndex: 'action',
      key: 'action',
      width: 180,
      title: '操作',
      fixed: 'right',
      render(_: string, recoder: any) {
        const { permissions = [], id } = recoder || {};
        return <Action btns={permissions} info={recoder} id={id} cb={onRefresh} />;
      }
    }
  ];

  const methods = useMethods({
    handleCreate() {
      dispatchNavigate('/sales/add');
    }
  });

  // 搜索条件
  const renderSearchForm = () => {
    return (
      <>
        <Tabs items={items} activeKey={activeKey as any} onChange={onChange}/>
        <SearchForm
          moreBtn={false}
          onSearch={onSearch}
          onReset={onReset}
          rightOperate={<Operate operateList={btns} onClick={({ func }) => methods[func]()}/>}
        >
          <FormInput placeholder='请输入销售单号' label='销售单号' name='number'/>
          <FormInput placeholder='请输入场地点位名称' label='场地点位' name='spotName'/>
          <FormInput placeholder='请输入商家名称' label='商家名称' name='enterName'/>
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

export default Sales;
