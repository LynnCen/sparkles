import { useEffect, FC, useState, useRef } from 'react';
import { Form, Button, message } from 'antd';
import FormSearch from '@/common/components/Form/SearchForm';
import FormStores from '@/common/components/FormBusiness/FormStores';
import ModalExport from '@/common/components/business/ModalExport';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormDatePicker from '@/common/components/Form/V2FormDatePicker/V2FormDatePicker';
import dayjs from 'dayjs';
import { storeType } from '@/common/enums/options';
import { predictExport } from '@/common/api/predict';
import { idsInStoreds } from '@/common/utils/ways';
import { SearchFormProps } from '../../ts-config';
import styles from './index.module.less';

const FormItemStyles = { width: '240px' };

const Filters: FC<SearchFormProps> = ({ filters, onSearch, haveResult, showOkBth }) => {
  const [form] = Form.useForm();
  const [showModal, setShowModal] = useState<boolean>(false);
  const isFirstFetch = useRef(true);

  useEffect(() => {
    form.setFieldsValue({
      ...filters,
      month: filters?.month && dayjs(filters?.month),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFinish = (values: any) => {
    const storesId = values.storeIds;
    if (!storesId || !storesId.length) {
      message.error('请选择门店');
      return;
    }
    if (!values.month) {
      message.error('请选择预测日期');
      return;
    }
    onSearch(values);
  };

  // 预测只可选当月和下月
  const disabledDate = (current) => {
    return (current && current < dayjs().startOf('month')) || current > dayjs().add(1, 'month');
  };

  // 下载
  const uploadExcel = (values: any) => {
    predictExport({ ...filters, type: 1, ...values }).then(() => {
      message.success('正在发送报表，请稍后前往邮箱查看。');
      setShowModal(true);
    });
  };

  const finallyData = (list: any) => {
    if (isFirstFetch.current) {
      const ids = filters.storeIds && !filters.storeIds.length ? [-1] : filters.storeIds;
      const newIds: number[] = idsInStoreds(ids, list);
      form.setFieldsValue({ storeIds: !newIds.length && list.length ? [-1] : newIds });
    }
    isFirstFetch.current = false;
  };

  return (
    <div className={styles.searchWrap}>
      <FormSearch form={form} onFinish={onFinish} onSearch={onSearch} onOkText='预测' hiddenOkBtn={showOkBth}>
        <FormStores
          label='选择门店'
          name='storeIds'
          config={{
            mode: 'multiple',
            finallyData,
          }}
          form={form}
          addAllStores={true}
          placeholder='请选择门店'
        />
        <V2FormSelect name='storeType' label='门店类型' options={storeType}/>
        <V2FormDatePicker label='预测月份' name='month' config={{ style: FormItemStyles, picker: 'month', disabledDate }} />
      </FormSearch>
      {haveResult && (
        <Button type='primary' onClick={() => setShowModal(true)}>
          下载预测结果
        </Button>
      )}
      <ModalExport visible={showModal} onOk={uploadExcel} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default Filters;
