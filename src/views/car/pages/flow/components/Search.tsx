import FormInput from '@/common/components/Form/FormInput';
import FormInputNumberRange from '@/common/components/Form/FormInputNumberRange';
import FormRangePicker from '@/common/components/Form/FormRangePicker';
import FormSearch from '@/common/components/Form/SearchForm';
import FormProvinceList from '@/common/components/FormBusiness/FormProvinceList';
import { FC } from 'react';
import styles from '../entry.module.less';
import dayjs from 'dayjs';

const Search:FC<any> = ({ onSearch }) => {

  const onFinish = (values) => {

    const params = {
      // ...values,
      ...((Array.isArray(values?.cityId) &&
      values?.cityId.length && { cityIds: values.cityId[1] }) || {
        cityIds: undefined,
      }),
      name: values.name,
      // 营业日期字段处理
      ...((values?.date && {
        openDate: dayjs(values.date[0]).format('YYYY-MM-DD'),
        closeDate: dayjs(values.date[1]).format('YYYY-MM-DD'),
      }) || {
        openDate: undefined,
        closeDate: undefined
      }),
      // 日均过店客流最大最小值处理
      ...((values.passby && {
        passbyMin: values.passby.min,
        passbyMax: values.passby.max
      }) || {
        passbyMin: undefined,
        passbyMax: undefined,
      }),
      // 日均进店客流
      ...((values.indoor && {
        indoorMin: values.indoor.min,
        indoorMax: values.indoor.max
      }) || {
        indoorMin: undefined,
        indoorMax: undefined,
      }),
      // 日均留资客流
      ...((values.stayInfo && {
        stayInfoMin: values.stayInfo.min,
        stayInfoMax: values.stayInfo.max
      }) || {
        stayInfoMin: undefined,
        stayInfoMax: undefined,
      }),
      // 日均试驾人数
      ...((values.testDrive && {
        testDriveMin: values.testDrive.min,
        testDriveMax: values.testDrive.max
      }) || {
        testDriveMin: undefined,
        testDriveMax: undefined,
      }),
      // 日均大定人数
      ...((values.order && {
        orderMin: values.order.min,
        orderMax: values.order.max
      }) || {
        orderMin: undefined,
        orderMax: undefined,
      }),

    };
    onSearch(params);
  };
  return (
    <div className={styles.SearchCon}>
      <FormSearch onSearch={onFinish} labelLength={7}>
        <FormProvinceList label='所在城市' name='cityId' type={2} />
        <FormInput label='店铺名称' name='name' />
        <FormRangePicker label='营业日期' name='date' />
        <FormInputNumberRange label='日均过店客流' min={0} max={10000000} name='passby' addonAfter='人次' />
        <FormInputNumberRange label='日均进店客流' min={0} max={10000000} name='indoor' addonAfter='人次' />
        <FormInputNumberRange label='日均留资客流' min={0} max={10000000} name='stayInfo' addonAfter='人次' />
        <FormInputNumberRange label='日均试驾人数' min={0} max={10000000} name='testDrive' addonAfter='人次' />
        <FormInputNumberRange label='日均大定人数' min={0} max={10000000} name='order' addonAfter='人次' />

      </FormSearch>
    </div>
  );
};

export default Search;
