import { FC, useState } from 'react';
import { Button, Space, Tabs, Tooltip, Typography } from 'antd';
import { KeepAlive, useActivate } from 'react-activation';

import { PageContainer, SearchForm, SearchTableContainer, Table } from '@/common/components';
import { useSearchForm } from '@/common/hook';

import FormInput from '@/common/components/Form/FormInput';
import styles from './entry.module.less';
import FormRangePicker from '@/common/components/Form/FormRangePicker';
import { getList } from '@/common/api/purchase';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import Status from './components/Status';
import { useMethods } from '@lhb/hook';
import { deepCopy, refactorPermissions } from '@lhb/func';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import Action from '@/views/purchase/components/Action';
import { gotoResourecerService } from '@/views/sales/pages/index/entry';
import { renderPriceText } from '@/views/sales/pages/add/components/AddPoint';
import { InfoCircleOutlined } from '@ant-design/icons';

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



// 状态映射
export const statusMap = new Map([
  [2, 'warning'],
  [3, 'warning'],
  [4, 'processing'],
  [5, 'success'],
  [6, 'error']
]);

const Purchase: FC<any> = () => {
  const [tableProps, { onReset, onSearch, searchParams, onRefresh }, meta] = useSearchForm(getList, (values: any) => {
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
    handleAddNew() {
      dispatchNavigate('/purchase/edit');
    }
  });

  const renderPrice = (depositFee, placeFee, purchaseFee, priceDetail) => {
    const colorStyle = {
      color: 'rgba(255, 255, 255, 1)'
    };
    return (
      <>
        <div className={styles.priceWrapper}>
          <span className={styles.priceLabel}>应付成本:</span>
          <Space>
            <span>¥{purchaseFee}</span>
            <Tooltip title={
              <Space direction='vertical' style={colorStyle}>
                <Space>
          场地成本:
                  <span >
                    {renderPriceText(placeFee)}
                  </span>
                </Space>
                {priceDetail.map((item, index) => {
                  return <Space key={index}>
                    {item.name}:
                    <span>
                      {renderPriceText(item.value)}
                    </span>
                  </Space>;
                }) }
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


  const columns = [
    {
      title: '采购单号及供应商名',
      key: 'number',
      dataIndex: 'number',
      minWidth: 250,
      render(_: string, record: any) {
        const { number, supplyName } = record;
        return (
          <Space direction='vertical'>
            <Text copyable={{ text: number }}>
              <Link to='' style={{ padding: 0 }}>{number}</Link>
            </Text>
            <Text ellipsis={{ tooltip: supplyName }} style={{ maxWidth: 200 }}>
              {supplyName}
            </Text>
          </Space>
        );
      }
    },
    {
      title: '场地点位',
      dataIndex: 'spotName',
      minWidth: 200,
      key: 'spotName',
      render(_: string, record: any) {
        const { spotName, placeName, spotId } = record;
        return (
          <Space >
            <Text ellipsis={{ tooltip: placeName + ' - ' + spotName }}>
              <span className='pointer color-primary' onClick={() => gotoResourecerService(spotId)}>{placeName}-{spotName}</span>
            </Text>
          </Space>
        );
      }
    },
    // {
    //   title: '品牌',
    //   dataIndex: 'brand',
    //   key: 'brand',
    //   width: 200,
    //   render(_: string, recoder: any) {
    //     const { brand } = recoder;
    //     return <Text ellipsis={{ tooltip: brand }} style={{ maxWidth: 200 }}>
    //       {brand}
    //     </Text>;
    //   }
    // },
    {
      title: '活动名称及活动时间',
      dataIndex: 'title',
      minWidth: 200,
      key: 'title',
      render(_: string, record: any) {
        const { title, displayDates } = record;
        return (
          <Space direction='vertical' >
            <Text ellipsis={{ tooltip: displayDates?.join(',') }} style={{ maxWidth: 200 }}>
              {title}
            </Text>
            <Text ellipsis={{ tooltip: displayDates?.join(',') }} style={{ maxWidth: 200 }}>
              {displayDates?.join(',')}
            </Text>
          </Space>
        );
      }
    },
    {
      title: '价格',
      dataIndex: 'placeFee',
      key: 'placeFee',
      minWidth: 200,
      render(_: string, recoder: any) {
        const { depositFee, placeFee, purchaseFee, priceDetail } = recoder || {};
        return renderPrice(depositFee, placeFee, purchaseFee, priceDetail);
      }
    },
    {
      title: '备注',
      dataIndex: 'mark',
      key: 'mark',
      width: 300,
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
      dataIndex: 'permissions',
      key: 'permissions',
      width: 180,
      title: '操作',
      fixed: 'right',
      render(_: string, recoder: any) {
        const { permissions = [], id, orderStateId, priceDetail } = recoder;
        return <Action
          btns={permissions}
          id={id}
          orderStateId={orderStateId}
          cb={onRefresh}
          info={recoder}
          priceDetailData={priceDetail}/>;
      }
    }
  ];

  const rightOperate: any = () => {
    const list = refactorPermissions(deepCopy(meta?.permissions));
    return list.map((item, index) => {
      const res: any = {
        name: item.text,
        type: item.isBatch ? 'default' : 'primary',
      };
      if (item.event === 'create') {
        res.onClick = () => methods.handleAddNew();
      }

      return <Button onClick={res.onClick} key={index} type={res.type}>{res.name}</Button>;
    });
  };


  // 搜索条件
  const renderSearchForm = () => {
    return (
      <>
        <Tabs items={items} activeKey={activeKey as any} onChange={onChange}/>
        <SearchForm moreBtn={false} onSearch={onSearch} onReset={onReset} rightOperate={rightOperate()} rightOperatePlace='bottom'>
          <FormInput placeholder='请输入采购单号' label='采购单号' name='number'/>
          <FormInput placeholder='请输入场地点位名称' label='场地点位' name='spotName'/>
          <FormInput placeholder='请输入供应商名' label='供应商名' name='supplyName'/>
          <FormInput placeholder='请输入品牌名称' label='品牌名称' name='brand'/>
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

export default Purchase;
