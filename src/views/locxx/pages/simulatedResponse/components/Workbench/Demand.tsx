import { FC, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useMethods } from '@lhb/hook';
import { getQuoteRelationRequirement, postQuoteRelationCreate } from '@/common/api/demand-management';

import cs from 'classnames';
import styles from './index.module.less';
import { Button, Spin, Typography } from 'antd';
import V2Title from 'src/common/components/Feedback/V2Title/index';
import Empty from './Empty';
import SelectDemand from './SelectDemand';
import IconFont from 'src/common/components/Base/IconFont/index';
import { deepCopy, parseObjectArrayToString, replaceEmpty } from '@lhb/func';

// 报价需求项
interface DemandProps {
  id: number, // 需求id
  name: string, // 标题
  cityListName: string, // 城市名称
  area: string, // 面积
  active: boolean, // 是否选中
}

/**
 * @description 需求列表
 * @param {*} obj.active 选中的需求信息
 * @param {*} obj.list 需求列表数据
 * @param {*} obj.changeDemand 选中需求后的回调事件
 * @return {*}
 * @example
 */
const DemandList:FC<{ active?: number, list: DemandProps[], changeDemand: Function }> = ({ active, list, changeDemand }) => {

  const handleClick = (e, item) => {
    // 使右侧滚动到中间
    e?.target?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    changeDemand(item);
  };

  return <div className={styles.quotationList}>
    {Array.isArray(list) && !!list.length ? list.map((item: DemandProps, index) => <div key={index} className={cs(styles.quotationCard, item.id === active && styles.active)} onClick={(e) => handleClick(e, item)}>
      {item.id === active && <IconFont iconHref='icon-check-circle' className={styles.quotationCardIcon}/>}
      <Typography.Text ellipsis={{ tooltip: replaceEmpty(item.name) }} className={styles.quotationCardTitle}>{item.name}</Typography.Text>
      <Typography.Text ellipsis={{ tooltip: replaceEmpty(item.cityListName) }}>{item.cityListName}</Typography.Text>
      <div>{item.area}</div>
    </div>) : <>暂无~</>}
  </div>;
};

/**
 * @description 需求列表
 * @return {*}
 * @example
 */
const Component: FC<{
  fromAccountId: string, // 会话发起方
  toAccountId: string, // 会话接收方
  className?: string,
  updateQuotationList?: Function, // 选中需求后，更新报价记录
  updatePriceDefault?: Function, // 选中需求后，更新场地费计价方式默认值
} & { ref?: any }> = forwardRef(({
  className,
  fromAccountId,
  toAccountId,
  updateQuotationList,
  updatePriceDefault }, ref) => {

  useImperativeHandle(ref, () => ({
    init: methods.init,
    getActive: () => deepCopy(selected)
  }));

  /* state */
  const selectDemandRef = useRef<any>();

  const [requesting, setRequesting] = useState(false);
  const [listData, setListData]: any[] = useState([]);
  // 选中的需求信息
  const [selected, setSelected] = useState<DemandProps | null>(null);

  /* hooks */

  /* methods */
  const methods = useMethods({
    // 初始化
    init() {
      if (!fromAccountId || !toAccountId) {
        return;
      }

      setRequesting(true);
      getQuoteRelationRequirement({ fromAccountId, toAccountId }).then((response) => {
        console.log('response', response);
        const result = Array.isArray(response) ? response.map(item => ({
          ...item,
          cityListName: parseObjectArrayToString(item.cities),
          area: item.minArea || item.maxArea ? `${item.minArea || ''}㎡-${item.maxArea || ''}㎡` : '',
        })) : [];
        setListData(result);
        if (result.length) { // 如果有数据，选中第一条
          methods.changeDemand(result[0]);
        }
      }).finally(() => {
        setRequesting(false);
      });
    },

    // 选中需求，更新选中项
    changeDemand(value) {
      setSelected(value);
      // 更新报价记录
      updateQuotationList?.(value?.id);
      updatePriceDefault?.(value?.id);
    },

    // 选择需求到列表
    selectDemand() {
      selectDemandRef.current?.init?.();
    },
    // 选择需求到列表-回调
    selectDemandComplete(value) {
      console.log('selectDemandComplete', value);

      // 保存需求和会话关系
      postQuoteRelationCreate({ fromAccountId, toAccountId, requirementIds: Array.isArray(value) ? value.map(item => item.id) : [] }).then((response) => {
        console.log(response);
      });

      if (Array.isArray(value) && value.length) {
        const curIds = listData.map(item => item.id);
        const newQuotationItems = value.filter(item => !curIds.includes(item.id));
        setListData((val) => val.concat(newQuotationItems.map(item => ({
          id: item.id,
          name: item.name,
          cityListName: item.cityListName,
          area: item.minArea || item.maxArea ? `${item.minArea || ''}㎡-${item.maxArea || ''}㎡` : '',
        }))));
        if (!curIds.length && newQuotationItems.length) { // 如果历史无需求数据，选中第一条
          methods.changeDemand(newQuotationItems[0]);
        }
      }
    }
  });

  return (<div className={className}>
    <V2Title type='H2' text='选择需求' className='mb-10' extra={!!listData.length && <Button type='link' onClick={methods.selectDemand}>从需求库选择需求</Button>}/>

    <Spin spinning={requesting}>
      {Array.isArray(listData) && !!listData.length ? <DemandList active={selected?.id} list={listData} changeDemand={methods.changeDemand}/> : <Empty add={methods.selectDemand} text='从需求库选择需求' />}
    </Spin>

    <SelectDemand ref={selectDemandRef} complete={methods.selectDemandComplete} />

  </div>);
});

export default Component;
