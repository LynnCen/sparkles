import { FC, useEffect, useRef } from 'react';
import { Form } from 'antd';
import { isArray } from '@lhb/func';
import FormStores from '@/common/components/FormBusiness/FormStores';
import FormRangePicker from '@/common/components/Form/FormRangePicker';
import { changeDateScope } from '@/common/components/business/DateBar';
import dayjs from 'dayjs';
import { FilterIProps } from '../ts-config';

const formatTime = (date) => dayjs(date).format('YYYY-MM-DD');

const style = { width: '240px' };

const Filters: FC<FilterIProps> = ({ filters, onSearch, setHaveStores, handleChangeTime }) => {
  const [form] = Form.useForm();
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
    let storesId = allValues?.storeIds;
    if (!(isArray(storesId) && storesId.length)) {
      storesId = [];
    }
    if (changedValues?.time && changedValues.time.length) {
      const dates = changedValues.time;
      changeRangeTime(dates);
      // 如果选择的不是单门店，则保存选择的时间，下次多门店进入依旧使用该时间
      if ((storesId.length === 1 && storesId[0] === -1) || storesId.length > 1) {
        currentDate.current = dates;
      }
      return;
    }

    if (!storesId.length) {
      // 取消选择默认选中全部门店
      form.setFieldsValue({ storeIds: [-1] });
      onSearch({ storeIds: [-1] });
      return;
    }
    const targetIndex = storesId.findIndex((item: number) => item === -1);
    const lastCheck = storesId[storesId.length - 1];
    let checkList: number[] = storesId;
    // 最后一个选择的是全部门店
    if (lastCheck === -1) {
      checkList = [-1];
      // 前面选过全部门店之后再选具体某个门店，过滤掉全部门店
    } else if (lastCheck !== -1 && targetIndex !== -1) {
      checkList = storesId.filter((item: number) => item !== -1);
    }
    // 如果选的是单门店-则获取该门店的营业时间，将时间填充到form里面
    let storeItem: any;
    if (checkList.length === 1 && checkList[0] !== -1) {
      storeItem = storesList.current.find((item) => item.id === checkList[0]);
      if (storeItem) {
        const rangeDate = [dayjs(storeItem?.startDate), (storeItem?.endDate && dayjs(storeItem?.endDate)) || ''];
        currentDate.current = rangeDate;
        filters.checkTab === 'customer' && form.setFieldsValue({ time: rangeDate });
      }
    } else {
      // 如果非单门店存储之前选择的时间
      currentDate.current = allValues.time;
    }

    form.setFieldsValue({ storeIds: checkList });
    onSearch({
      storeIds: checkList,
      ...((storeItem && {
        date: { start: storeItem?.startDate, end: storeItem?.endDate },
      }) ||
        {}),
    });
  };

  const finallyData = (list: any) => {
    storesList.current = list;
    if (!Array.isArray(list) || list.length < 1) {
      setHaveStores(false);
    } else {
      setHaveStores(true);
    }
  };

  // 禁止选择的日期
  const disabledDate = (current) => {
    return current && current > dayjs().subtract(1, 'days').endOf('day');
  };

  return (
    <Form onValuesChange={onValuesChange} form={form} layout='inline'>
      <FormStores
        label='选择门店'
        name='storeIds'
        allowClear={true}
        config={{
          mode: 'multiple',
          style,
          finallyData,
        }}
        addAllStores={true}
        defaultCheck={true}
        placeholder='请选择门店'
      />
      {filters.checkTab === 'customer' && (
        <FormRangePicker
          label='选择时间'
          name='time'
          config={{
            disabledDate,
            style,
          }}
        />
      )}
    </Form>
  );
};

export default Filters;
