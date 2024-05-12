import { FC, useEffect, useState, useRef } from 'react';
import { Form, Button, message } from 'antd';
import FormSearch from '@/common/components/Form/SearchForm';
import FormStores from '@/common/components/FormBusiness/FormStores';
import ModalExport from '@/common/components/business/ModalExport';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormDatePicker from '@/common/components/Form/V2FormDatePicker/V2FormDatePicker';
import dayjs from 'dayjs';
import { storeType } from '@/common/enums/options';
import { continuousDateMonth, idsInStoreds } from '@/common/utils/ways';
import { post } from '@/common/request/index';
import { predictExport } from '@/common/api/predict';
import { isEqual } from '@lhb/func';
import { SearchFormProps } from '../../ts-config';
import styles from './index.module.less';

const FormItemStyles = { width: '200px' };

const Filters: FC<SearchFormProps> = ({ filters, onSearch, haveResult, showOkBth }) => {
  const [form] = Form.useForm();
  const [predictMonth, setPredictMonth] = useState<{ start: string; end: string }[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isHaveStores, setIsHaveStores] = useState<boolean>(false);
  const [predictParams, setPredictParams] = useState<{ storeIds: number[]; storeType?: string }>({
    storeIds: filters.storeIds,
    storeType: filters.storeType,
  });

  // 是否首次请求门店列表
  const isFirstFetch = useRef(true);

  useEffect(() => {
    form.setFieldsValue({
      ...filters,
      month: filters?.month && dayjs(filters?.month),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const predictMonth = async () => {
      const { storeIds } = predictParams;
      const month = form.getFieldValue('month');
      if (!storeIds) return;
      const result = await post('/predict/month', predictParams);
      setPredictMonth(continuousDateMonth(result || []));
      if (month && !result.includes(dayjs(month).format('YYYY-MM'))) {
        form.setFieldsValue({ month: '' });
      }
    };
    isHaveStores && predictMonth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [predictParams, isHaveStores]);

  // 点击预测需要验证筛选条件
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

  const onValuesChange = (value, allValues) => {
    const storeIds = allValues.storeIds;
    if (!storeIds) {
      // 如果没有选择门店-选了时间，则清空时间选择，并提示
      if (allValues.month) {
        message.error('请先选择门店');
        form.setFieldsValue({ month: '' });
      }
      return;
    }
    let checkList: number[] = storeIds;
    // 如果变更的是选中门店-则重新处理所选门店
    if (value?.storeIds) {
      const targetIndex = storeIds.findIndex((item: number) => item === -1);
      const lastCheck = storeIds[storeIds.length - 1];
      // 最后一个选择的是全部门店
      if (lastCheck === -1) {
        checkList = [-1];
        // 前面选过全部门店之后再选具体某个门店，过滤掉全部门店
      } else if (lastCheck !== -1 && targetIndex !== -1) {
        checkList = storeIds.filter((item: number) => item !== -1);
      }
    }
    // 如果变动的不是月份
    if (!value?.month) {
      const storeId = checkList && checkList.length === 1 && checkList[0] === -1 ? [] : checkList;
      if (!isEqual(storeId, predictParams.storeIds) || allValues.storeType !== predictParams.storeType) {
        setPredictParams({ storeIds: storeId, storeType: allValues.storeType });
      }
    }
    form.setFieldsValue({ ...allValues, storeIds: checkList });
  };

  // 可选月份依据选择的门店和类型动态请求获取
  const disabledDate = (current: any) => {
    if (!predictMonth.length) return true;
    if (predictMonth.length === 1) {
      return (current && current >= dayjs(predictMonth[0].end).add(1, 'month')) || current < dayjs(predictMonth[0].end);
    }
    const result: any = [];
    predictMonth.map((item) => {
      if (item.start && item.end) {
        result.push(current > dayjs(item.start) && current < dayjs(item.end));
      } else if (item.end && !item.start) {
        result.push(current < dayjs(item.end));
      } else {
        result.push(current > dayjs(item.start));
      }
    });
    return current && result.includes(true);
  };

  // 如果无可选月份，提示
  const onOpenChange = (open) => {
    if (open && !predictMonth.length) {
      message.warn('当前筛选条件无可查看的历史预测记录，请重新选择');
    }
  };

  // 下载
  const uploadExcel = (values: any) => {
    predictExport({ ...filters, type: 2, ...values }).then(() => {
      message.success('正在发送报表，请稍后前往邮箱查看。');
      setShowModal(true);
    });
  };

  const finallyData = (list: any) => {
    // 只在第一次请求的时候添加此判断，如果上一次存储的门店id在门店列表不存在，则默认选中全部门店
    if (isFirstFetch.current) {
      const ids = filters.storeIds && !filters.storeIds.length ? [-1] : filters.storeIds;
      const newIds: number[] = idsInStoreds(ids, list);
      setIsHaveStores(!!list.length);
      form.setFieldsValue({ storeIds: !newIds.length && list.length ? [-1] : newIds });
    }

    isFirstFetch.current = false;
  };

  return (
    <div className={styles.searchWrap}>
      <FormSearch
        form={form}
        onFinish={onFinish}
        onSearch={onSearch}
        onValuesChange={onValuesChange}
        hiddenOkBtn={showOkBth}
      >
        <FormStores
          label='选择门店'
          name='storeIds'
          config={{
            mode: 'multiple',
            finallyData,
          }}
          addAllStores={true}
          placeholder='请选择门店'
        />
        <V2FormSelect name='storeType' label='门店类型' options={storeType} />
        <V2FormDatePicker
          label='预测月份'
          name='month'
          config={{
            style: FormItemStyles,
            picker: 'month',
            disabledDate,
            format: 'YYYY-MM',
            onOpenChange,
          }}
        />
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
