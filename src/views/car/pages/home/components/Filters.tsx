import { FC, useEffect, useRef } from 'react';
import { Form, message } from 'antd';
import FormRangePicker from '@/common/components/Form/FormRangePicker';
import dayjs from 'dayjs';
import { FilterIProps } from '../ts-config';
import FormProvinceList from '@/common/components/FormBusiness/FormProvinceList';
import FormInputNumberRange from '@/common/components/Form/FormInputNumberRange';
import SearchForm from '@/common/components/Form/SearchForm';
import { changeDateScope } from '@/common/components/business/DateBar';
import { useSelector } from 'react-redux';
import FormDemoStores from '@/common/components/FormBusiness/FormDemoStores';

const formatTime = (date) => dayjs(date).format('YYYY-MM-DD');

const style = { width: '240px' };

const Filters: FC<FilterIProps> = ({ filters, onSearch, setHaveStores }) => {
  const [form] = Form.useForm();
  const storesList: any = useRef([]);
  const provincesCities = useSelector((state: any) => state.common.provincesCities);

  useEffect(() => {
    if (filters.checkTab === 'customer') {
      form.setFieldsValue({ time: [] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.checkTab]);

  const generateCities = (ids: any) => {
    if (!ids) return [];
    const cityIds: number[] = [];
    ids.forEach((item) => {
      if (item.length === 1) {
        cityIds.push(...provincesCities[item[0] - 1].children.map((city) => city.id));
        return;
      }
      cityIds.push(item[1]);
    });
    return cityIds;
  };

  const formStoresChange = (val: any) => {
    if (!val.length) {
      // 取消选择默认选中全部门店
      form.setFieldsValue({ storeIds: [-1] });
      return;
    }
    const targetIndex = val.findIndex((item: number) => item === -1);
    const lastCheck = val[val.length - 1];
    let checkList: number[] = val;
    // 最后一个选择的是全部门店
    if (lastCheck === -1) {
      checkList = [-1];
      // 前面选过全部门店之后再选具体某个门店，过滤掉全部门店
    } else if (lastCheck !== -1 && targetIndex !== -1) {
      checkList = val.filter((item: number) => item !== -1);
    }
    form.setFieldsValue({ storeIds: checkList });
  };

  const changeRangeTime = (date: any[]) => {
    const start = formatTime(date[0]);
    const end = (date[1] && formatTime(date[1])) || '';
    const dateScope = changeDateScope(start, end);
    return dateScope;
  };

  const onSearchFrom = (value: any) => {
    const searchParams: any = {
      storeIds: value.storeIds,
      cityIds: generateCities(value.cityIds),
      openDate: value.open && formatTime(value.open[0]),
      closeDate: value.open && formatTime(value.open[1]),
      passbyMin: value.passby && value.passby.min,
      passbyMax: value.passby && value.passby.max,
      indoorMin: value.indoor && value.indoor.min,
      indoorMax: value.indoor && value.indoor.max,
      stayInfoMin: value.stayInfo && value.stayInfo.min,
      stayInfoMax: value.stayInfo && value.stayInfo.max,
      orderMin: value.order && value.order.min,
      orderMax: value.order && value.order.max,
    };
    if (value.time) {
      searchParams.start = formatTime(value.time[0]);
      searchParams.end = formatTime(value.time[1]);
      searchParams.dateScope = changeRangeTime(value.time);
    }
    onSearch(searchParams);
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

  const formDateChange = (value) => {
    if (value) {
      const start = formatTime(value[0]);
      const end = formatTime(value[1]);
      if (start === end) {
        message.warning('请选择至少间隔1天的日期');
        form.setFieldsValue({ time: [] });
      }
    }
  };

  return (
    <SearchForm onSearch={onSearchFrom} form={form} labelLength={4}>
      <FormProvinceList
        label='所在城市'
        config={{
          multiple: true,
          maxTagCount: 'responsive',
          changeOnSelect: true,
        }}
        name='cityIds'
        type={2} />
      <FormDemoStores
        label='选择门店'
        name='storeIds'
        allowClear={true}
        config={{
          mode: 'multiple',
          style,
          finallyData,
          maxTagCount: 'responsive',
        }}
        addAllStores={true}
        defaultCheck={true}
        placeholder='请选择门店'
        change={formStoresChange}
      />
      {filters.checkTab === 'customer' ? (
        <FormRangePicker
          label='选择时间'
          name='time'
          config={{
            disabledDate,
            style,
            onChange: formDateChange,
          }}
        />
      ) : <></>}
      <FormInputNumberRange label='日均过店' isRely={false} min={0} max={10000000} name='passby' addonAfter='人' />
      <FormInputNumberRange label='日均进店' isRely={false} min={0} max={10000000} name='indoor' addonAfter='人' />
      <FormInputNumberRange label='日均留资' isRely={false} min={0} max={10000000} name='stayInfo' addonAfter='人' />
      <FormInputNumberRange label='日均大定' isRely={false} min={0} max={10000000} name='order' addonAfter='人' />
      <FormRangePicker
        label='营业日期'
        name='open'
        config={{
          disabledDate,
        }}
      />
    </SearchForm>
  );
};

export default Filters;
