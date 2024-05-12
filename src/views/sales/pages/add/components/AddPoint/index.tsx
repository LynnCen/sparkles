import { FC, useEffect, useRef, useState } from 'react';

import { Button, Empty, Space, Tooltip, Typography } from 'antd';

import { Table } from '@/common/components';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Price } from '@/common/api/sales';
import ResourceAddPoint from '@/common/business/ResourceAddPoint';
import { useVisible } from '@/common/hook';

import styles from './index.module.less';

import empty from '@/assets/empty.png';
import EditPoint from './EditPoint';
import dayjs from 'dayjs';


interface AddPointProps {
  value?: any;
  onChange?: (value: any) => void;

}

const { Text, Title } = Typography;

export const renderPriceText = (text?: number) => {
  if (text) {
    return `¥${text}`;
  }

  return '-';
};

// 渲染弹出框
const renderPricePopver = (title: string, price: Price) => {
  const { serviceFee, placeFee, otherFee } = price;
  const colorStyle = {
    color: 'rgba(255, 255, 255, 1)'
  };

  return (
    <Tooltip placement='rightTop' title={
      <Space direction='vertical' style={colorStyle}>
        <Title style={colorStyle} level={5}>{title}</Title>
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
    } >
      <InfoCircleOutlined />
    </Tooltip>
  );
};


const AddPoint:FC<AddPointProps> = ({ value, onChange }) => {
  const { visible, onHidden, onShow } = useVisible(false);
  const { visible: draweVisible, onHidden: onDrawerHidden, onShow: onDrawerShow } = useVisible(false);
  const [info, setInfo] = useState<any>({});
  const { name, tenantSpotId } = info;

  // 用来数据去重
  const tableDataMap = useRef<Map<string, any>>(new Map());
  const [tableData, setTableData] = useState<any[]>([]);
  const onOK = (closeable?: boolean, selectedRows: any = []) => {
    if (closeable) {
      onHidden();
    }
    // @ts-ignore
    const newTableData = [...tableData];
    selectedRows.forEach(selectedRow => {
      const { tenantSpotId } = selectedRow;
      if (!tableDataMap.current.has(tenantSpotId)) {
        tableDataMap.current.set(tenantSpotId, selectedRow);
        newTableData.push(selectedRow);
      }
    });

    setTableData(newTableData);
    onChange?.(newTableData);
  };

  const columns = [
    {
      title: '点位名称',
      key: 'name',
      width: 150,
      render(_: string, record: any) {
        const { spotName, placeName, isOK } = record;
        return (
          <>
            {placeName}-{spotName}
            {!isOK && (<Tooltip title='请完善点位信息'><InfoCircleOutlined style={{ marginLeft: 8 }} /></Tooltip>)}
          </>
        );
      }
    },
    {
      title: '活动时间',
      width: 150,
      key: 'dates',
      dataIndex: 'dates',
      render(_: string, record: any) {
        const { baseInfo = {} } = record;
        const { dates = [] } = baseInfo;
        return (
          <Text ellipsis={{ tooltip: dates.map(item => (dayjs(item).format('YYYY-MM-DD'))).join(',') }} style={{ maxWidth: 150 }}>
            {
              dates.map(item => (dayjs(item).format('YYYY-MM-DD')))
            }
          </Text>

        );
      }
    },
    {
      title: '收入',
      width: 80,
      dataindex: 'placeName',
      key: 'placeName',
      render(_: string, record: any) {
        const { priceInfo } = record;
        const { placeFee = 0, serviceFee = 0, otherFee = 0, depositFee = 0 } = priceInfo || {};
        const saleFee = placeFee + serviceFee + otherFee + depositFee;
        return (
          <Space>
            <span>¥{saleFee}</span>
            {renderPricePopver('收入明细', { placeFee, serviceFee, otherFee })}
          </Space>

        );
      }
    },
    {
      title: '押金',
      width: 80,
      dataindex: 'dates',
      key: 'price',
      render(_: string, record: any) {
        const { priceInfo } = record;
        const { depositFee = 0 } = priceInfo || {};
        return renderPriceText(depositFee);
      }
    },

    {
      dataIndex: 'action',
      title: '操作',
      key: 'action',
      width: 100,
      algin: 'center',
      render(_:string, recoder: any, index: number) {
        const { isOK } = recoder;

        const onDelete = () => {
          // @ts-ignore
          const newTableData: any = [...tableData];
          // const index = newTabelData.findIndex(item => item.id === id);
          // console.log(index, '66666');
          if (index > -1) {
            newTableData.splice(index, 1);
            tableDataMap.current.delete(recoder.tenantSpotId);
          }

          setTableData(newTableData);
          onChange?.(newTableData);
        };

        const onEdit = () => {
          setInfo(recoder);
          onDrawerShow();
        };

        return (
          <Space>
            <Button style={{ padding: 0 }} type='link' onClick={onEdit}>{isOK ? '编辑' : '完善点位'}</Button>
            <Button type='link' onClick={onDelete}>删除</Button>
          </Space>
        );
      }
    }
  ];

  const renderEmpty = () => {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Space direction='vertical'>
          <Empty
            image={empty}
            description={<span>暂无场地点位,<Button type='link' onClick={onShow}>去添加</Button></span>} />
        </Space>
      </div>
    );
  };

  const onEditPointOk = ({ baseInfo, priceInfo }) => {
    // @ts-ignore
    const newTableData = [...tableData];
    // const { area, size, ...resetBaseInfo } = baseInfo;
    // const { length, height, width } = area;
    // const { length: usableLength, height: usableHeight, width: usableWidth } = size;
    const index = newTableData.findIndex(item => item.tenantSpotId ===
      tenantSpotId
    );
    if (index > -1) {
      newTableData.splice(index, 1, {
        ...tableData[index],
        priceInfo, baseInfo,
        isOK: true,
        // length,
        // width,
        // height,
        // usableLength,
        // usableHeight,
        // usableWidth
      });
      setTableData(newTableData);
      onChange?.(newTableData);
      onDrawerHidden();
    }
  };

  useEffect(() => {
    setTableData(value || []);
  }, [value]);


  return (
    <>
      <div>
        <div className={styles.toolbar}>
          <Title level={5}>场地点位以及价格</Title>
          {tableData.length > 0 && <Space>
            <Button type='primary' onClick={onShow} ghost>添加场地点位</Button>
          </Space>}
        </div>
        {
          tableData.length
            ? (<Table
              columns={columns}
              rowKey='tenantSpotId'
              scroll={{ y: 300 }}
              pagination={false}
              dataSource={tableData}/>)
            : renderEmpty()
        }
      </div>
      <ResourceAddPoint visible={visible} onClose={onHidden} onOK={onOK}/>
      <EditPoint
        visible={draweVisible}
        onClose={onDrawerHidden}
        onOK={onEditPointOk}
        spotName={name}
        info={info}/>
    </>
  );
};

export default AddPoint;
