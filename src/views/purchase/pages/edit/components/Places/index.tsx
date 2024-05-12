// 场地点位及价格
import { Button } from 'antd';
import { FC, forwardRef, useImperativeHandle, useState } from 'react';
import styles from './places.module.less';
import cs from 'classnames';
import Empty from './Empty';
import TableList from './TableList';
import ResourceAddPoint from '@/common/business/ResourceAddPoint';
import { useVisible } from '@/common/hook';

// 获取原始数据-场地点位价格信息
const getOriPlacePriceData = () => {
  return {
    placeId: null, // 场地id
    placeName: null, // 场地名称
    name: null, // 点位全称
    specification: null, // 面积
    placeCategoryId: null, // 场地类型id
    placeCategoryName: null, // 场地类型名称
    spotId: null, // 点位id
    spotName: null, // 点位名称
    spotCategoryId: null, // 点位类型id
    spotCategoryName: null, // 点位类型名称

    dates: null, // 日期列表
    entranceDate: '', // 进场时间
    withdrawDate: null, // 撤场时间
    purchaseFee: null, // 采购总金额（元）
    placeFee: null, // 场地成本（元）
    extPrices: null, // 额外金额 [{ name, value }]
    purchasePeriods: null, // 采购金付款周期 [{date, amount}]
    depositFee: null, // 押金（元）
    depositPeriods: null, // 押金付款周期 [{date, amount}]
    depositRecoveryDate: null, // 押金退回时间/押金付款日期

    permissions: [
      { event: 'edit', name: '编辑' },
      { event: 'del', name: '删除' }
    ], // 操作按钮
  };
};

const Places:FC<any & {ref?:any}> = forwardRef((props, ref) => {
  const [dataItems, setDataItems] = useState<any>([]);

  // 抛出给 ref 事件
  useImperativeHandle(ref, () => ({
    dataItems,
  }));

  // 添加点位
  const { visible, onHidden, onShow: addPoint } = useVisible(false);

  // 添加点位-回调
  const onOK = (closeable?: boolean, selectedRows: any = []) => {
    if (closeable) {
      onHidden();
    }

    const curSpotIds = dataItems.map(item => item.spotId);

    const newTableData = selectedRows.filter(item => !curSpotIds.includes(item.tenantSpotId)).map(item => ({
      ...getOriPlacePriceData(),

      placeId: item.tenantPlaceId, // 场地id
      placeName: item.placeName, // 场地名称
      name: `${item.placeName || ''}-${item.spotName || ''}`, // 点位全称
      specification: Array.isArray(item.specLW) && item.specLW.length ? `${item.specLW[0].w}m * ${item.specLW[0].l}m` : null, // 面积/规格 specLW
      placeCategoryId: item.placeCategoryId, // 场地类型id
      placeCategoryName: item.placeCategoryName, // 场地类型名称

      spotId: item.tenantSpotId, // 点位id
      spotName: item.spotName, // 点位名称
      spotCategoryId: item.spotCategoryId, // 点位类型id
      spotCategoryName: item.spotCategoryName, // 点位类型名称

      // dates: ['2022-11-10', '2022-11-28'], // 活动日期
      // entranceDate: '2022-11-27', // 进场时间
      // withdrawDate: '2022-11-30', // 撤场时间
      // purchaseFee: null, // 采购总金额（元）
      // placeFee: 1000, // 场地成本（元）
      // extPrices: [{ field: 'electricFee', name: '电费', value: 10 }, { field: 'approvalFee', name: '报批费', value: 20 }, { field: 'doorFee', name: '拆门费', value: 30 }], // 额外金额 [{ name, value }]
      // purchasePeriods: [{ date: '2022-11-27', amount: 260 }, { date: '2022-11-28', amount: 800 }], // 采购金付款周期 [{date, amount}]
      // depositFee: 100, // 押金（元）
      // depositPeriods: [{ date: '2022-11-27', amount: 20 }, { date: '2022-11-28', amount: 80 }], // 押金退回时间/押金付款日期 [{date, amount}]
      // depositRecoveryDate: '2022-11-30', // 押金退回时间

      permissions: [
        { event: 'edit', name: '编辑' },
        { event: 'del', name: '删除' }
      ]
    }));

    setDataItems(dataItems.concat(newTableData));
  };

  return <div className=''>
    <div className={cs(styles.title, 'mb-16')}>
      <div className='fn-16 lh-22 font-weight-500'>场地点位及价格</div>
      <Button type='primary' ghost onClick={addPoint}>添加点位</Button>
    </div>

    {Array.isArray(dataItems) && dataItems.length ? <TableList dataItems={dataItems} setDataItems={setDataItems} /> : <Empty add={addPoint} />}

    <ResourceAddPoint visible={visible} onClose={onHidden} onOK={onOK}/>

  </div>;
});

export default Places;
