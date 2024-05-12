import { FC, useRef, useState } from 'react';
import { useMethods } from '@lhb/hook';
import styles from './places.module.less';
import { replaceEmpty, beautifyThePrice, isNotEmpty, accumulation, deepCopy, refactorPermissions } from '@lhb/func';
import { parseConsecutiveDate } from 'src/common/utils/date';
import { message, Tooltip, Typography } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { OperateButtonProps, FormattingPermission } from '@/common/components/Operate/ts-config';
import Table from '@/common/components/FilterTable';
import Operate from '@/common/components/Operate';
import PointEditor from '../PointEditor/index';

// 渲染空内容
// const renderEmpty = (value: any) => replaceEmpty(value);

// 渲染点位名称
const renderName = (value: any) => {
  return (
    <div>
      <Typography.Text ellipsis={{ tooltip: replaceEmpty(value) }} style={{ maxWidth: 200 }}>
        {replaceEmpty(value)}
      </Typography.Text>
    </div>
  );
};

// 渲染金额内容
const renderPrice = (value: any) => isNotEmpty(value) ? '￥' + beautifyThePrice(value) : replaceEmpty(value);
// 渲染时间
const renderDate = (value: Array<any>) => {
  const dates = parseConsecutiveDate(value);
  return Array.isArray(dates) ? dates.join('、') : '-';
};
// 金额提示
const amountTip = function(data) {
  return <div>
    <div>收入明细</div>
    <div>场地成本：￥{beautifyThePrice(data.placeFee)}</div>
    {Array.isArray(data.extPrices) && data.extPrices.map((item, index) => <div key={index}>{item.name}：￥{beautifyThePrice(item.value)}</div>)}
  </div>;
};

/**
 * @description: 渲染收入金额列
 * @param {any} value 单元格值
 * @param {any} data 行数据
 * @return {*}
 */
const renderAmount = (value: any, data: any) => {
  // 成本 = 场地成本 + 额外成本
  let amounts:any = [];
  data.placeFee && amounts.push(data.placeFee);
  if (Array.isArray(data.extPrices)) {
    amounts = data.extPrices.reduce((result, item) => result.concat(item.value), amounts);
  }

  const total = accumulation(amounts);
  console.log('total', total);
  return <div>
    <span className='mr-5'>{renderPrice(total)}</span>

    <Tooltip placement='right' title={amountTip(data)}>
      {+total > 0 ? <InfoCircleOutlined className='color-bbc pointer'/> : null}
    </Tooltip>
  </div>;
};


/**
 * @description:
 * @param {*} loadData 获取列表
 * @param {*} setDataItems 设置列表内容
 * @return {*}
 */
const TableList:FC<{ dataItems:Array<any>, setDataItems: Function }> = ({ dataItems, setDataItems }) => {

  const [curIndex, setCurIndex] = useState(-1);

  // 获取组件实例
  const pointEditor = useRef(null);

  const methods = useMethods({
    // 编辑
    handleEdit(row, index) {
      console.log('row', row, index);

      setCurIndex(index);

      // data = {
      //   name: data.name, // 场地名称
      //   size: data.size, // 面积
      //   date: ['2022-11-10', '2022-11-28'], // 活动日期
      //   enter_time: '2022-11-27', // 进场时间
      //   exit_time: '2022-11-30', // 撤场时间
      //   actual_fee: 1000, // 场地成本
      //   extra_amounts: [{ type: 'electricFee', label: '电费', amount: 10 }, { type: 'approvalFee', label: '报批费', amount: 20 }, { type: 'doorFee', label: '拆门费', amount: 30 }], // 额外成本
      //   amount_plans: [{ time: '2022-11-27', amount: 260 }, { time: '2022-11-28', amount: 800 }], // 付款日期
      //   deposit: 100, // 押金
      //   deposit_plans: [{ time: '2022-11-27', amount: 20 }, { time: '2022-11-28', amount: 80 }], // 押金付款日期
      //   recovery_time: '2022-11-30', // 预计收回时间
      // };

      const ref = (pointEditor as any).current;
      ref && ref.init(row);
    },
    // 删除
    handleDel(row, index) {
      const data = deepCopy(dataItems);
      data.splice(index, 1);
      setDataItems(data);
      message.success('删除成功');
    }
  });

  // 渲染操作列
  const renderOperate = (value: OperateButtonProps, data: any, index: number) => {
    return <Operate
      operateList={refactorPermissions(value)}
      onClick={(btn: FormattingPermission) => methods[btn.func](data, index)}
      showBtnCount={4}
    />;
  };

  // title 颜色 #768098，公共样式，本期不改
  const columns: any[] = [
    { key: 'name', title: '点位名称', width: 160, render: renderName },
    { key: 'dates', title: '活动时间', width: 210, render: renderDate },
    { key: 'placeFee', title: '成本', width: 160, align: 'right', render: renderAmount },
    { key: 'depositFee', title: '押金', width: 140, align: 'right', render: renderPrice },
    { key: 'permissions', title: '操作', width: 120, align: 'center', fixed: 'right', render: renderOperate },
  ];

  // 点位价格-保存回调
  const onConfirm = (params) => {
    // console.log('点位价格-保存回调', params);

    params.validate = true; // 代表价格信息已完善

    const data = deepCopy(dataItems);
    data.splice(curIndex, 1, Object.assign(data[curIndex], params));
    setDataItems(data);
    setCurIndex(-1);
  };
  // 点位价格-关闭回调
  const onClose = () => {
    // console.log('点位价格-关闭回调');
    setCurIndex(-1);
  };

  return <div>

    <Table
      rowKey='id'
      dataSource={dataItems}
      // filters={params}
      pagination={false}
      columns={columns}
      className={styles.tableWrap}
    />

    {/* 编辑点位价格信息 */}
    <PointEditor
      ref={pointEditor}
      onConfirm={onConfirm}
      onClose={onClose}
    />

  </div>;
};

export default TableList;
