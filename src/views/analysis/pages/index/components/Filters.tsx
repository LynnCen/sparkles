import { FC, useEffect, useRef } from 'react';
import { Form } from 'antd';
import FormStores from '@/common/components/FormBusiness/FormStores';
import FormRangePicker from '@/common/components/Form/FormRangePicker';
import { changeDateScope } from '@/common/components/business/DateBar';
import dayjs from 'dayjs';
import { FilterIProps } from '../ts-config';
import { isArray } from '@lhb/func';

const style = { width: '240px' };

const formatTime = (date) => dayjs(date).format('YYYY-MM-DD');

const Filters: FC<FilterIProps> = ({
  filters,
  onSearch,
  handleChangeStore,
  handleChangeTime
}) => {
  const [form] = Form.useForm();
  // 店铺列表
  const storesList: any = useRef([]);
  const currentDate: any = useRef();

  const changeRangeTime = (date: any[]) => {
    const start = formatTime(date[0]);
    const end = (date[1] && formatTime(date[1])) || '';
    const dateScope = changeDateScope(start, end);
    handleChangeTime(start, end, dateScope);
  };

  useEffect(() => {
    if (filters.checkTab === 'customer' && Array.isArray(currentDate.current) && currentDate.current.length) {
      changeRangeTime(currentDate.current);
      form.setFieldsValue({ time: currentDate.current });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.checkTab]);

  const onValuesChange = (changedValues: any, allValues: any) => {
    if (changedValues?.time && changedValues.time.length) {
      const dates = changedValues.time;
      changeRangeTime(dates);
      return;
    }

    const storeItem = storesList.current.find((item) => item.id === allValues.storeIds);

    if (storeItem) {
      const rangeDate = [dayjs(storeItem?.startDate), (storeItem?.endDate && dayjs(storeItem.endDate)) || ''];
      currentDate.current = rangeDate;
      filters.checkTab === 'customer' && form.setFieldsValue({ time: rangeDate });
    }

    onSearch({
      storeIds: allValues.storeIds,
      ...((storeItem && {
        date: { start: storeItem?.startDate, end: storeItem?.endDate || '' },
      }) ||
        {}),
    });
  };

  // 禁止选择的日期
  const disabledDate = (current) => {
    return current && current > dayjs().subtract(1, 'days').endOf('day');
  };

  const finallyData = (list: any) => {
    storesList.current = list;
  };

  const onChangeStore = (val) => {
    const item = isArray(storesList.current) ? storesList.current.find(itm => val === itm.id) : null;
    handleChangeStore && handleChangeStore(item);
  };

  return (
    <Form onValuesChange={onValuesChange} form={form} layout='inline'>
      <FormStores
        label='选择门店'
        name='storeIds'
        allowClear={false}
        config={{ style, finallyData }}
        defaultCheck={true}
        placeholder='请选择门店'
        change={onChangeStore}
      />
      {filters.checkTab === 'customer' && (
        <FormRangePicker label='选择时间' name='time' config={{ disabledDate, style }} />
      )}
    </Form>
  );
};

export default Filters;
