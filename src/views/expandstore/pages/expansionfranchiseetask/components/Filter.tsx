/**
 * @Description 顶部操作区域
 */

import { FC, useState, useEffect } from 'react';
import { Form, Cascader } from 'antd';
import SearchForm from '@/common/components/Form/SearchForm';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormCascader from '@/common/components/Form/V2FormCascader/V2FormCascader';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormRangePicker from '@/common/components/Form/V2FormRangePicker/V2FormRangePicker';
import V2FormProvinceList from '@/common/components/Form/V2FormProvinceList';
import { refactorSelection } from '@/common/utils/ways';
import { getTaskSelection, taskTypeList } from '@/common/api/expandStore/expansiontask';
import styles from './index.module.less';
import { isArray } from '@lhb/func';
import dayjs from 'dayjs';

// 落位日期筛选项大类型
const dropInDateTypes: any = [
  { label: '距离超期还剩', value: 0 },
  { label: '已超期', value: 1 },
];

interface Props {
  onSearch: Function, // 搜索函数
  onFilterChanged: Function,
}

const Filter: FC<Props> = ({
  onSearch,
  onFilterChanged,
}) => {
  const [form] = Form.useForm();
  const [statusOptions, setStatusOptions] = useState<any[]>([]); // 任务状态
  const [dropInOptions, setDropInOptions] = useState<any[]>([]); // 距离期望落位时间下拉选项
  const [taskTypeOptions, setTaskTypeOptions] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);

  useEffect(() => {
    getSelection();
    getTaskTypeList();
  }, []);

  /**
   * @description 获取落位时间下拉选项
   */
  const getSelection = async () => {
    const res = await getTaskSelection();

    // 落位日期
    const dropInLevelTwoTypes = refactorSelection(res.expectDropInDateSearchType);
    const dropInOptions = dropInDateTypes.map((itm: any) => ({
      ...itm,
      children: dropInLevelTwoTypes,
    }));
    setDropInOptions(dropInOptions);

    // 状态
    setStatusOptions(refactorSelection(res.taskStatus));
    // 机会点状态
    isArray(res?.chancePointStatus) && setStatuses(refactorSelection(res.chancePointStatus));

    // 机会点状态选项
    // getChancepointSelection({}).then(({ status }: any) => {
    //   isArray(status) && setStatuses(refactorSelection(status));
    // });
  };

  /**
   * @description 任务类型选项
   */
  const getTaskTypeList = () => {
    taskTypeList().then((data) => {
      if (isArray(data) && data.length) {
        const options = data.map((itm: any) => ({ value: itm.id, label: itm.typeName }));
        setTaskTypeOptions(options);
      }
    });
  };

  /**
   * @description 点击搜索框模糊查询
   * @param fields 搜索框参数
   */
  const handleSearch = (value: any) => {
    // 搜索
    onSearch(formatValue(value));
  };

  /**
   * @description form数据转为为提交要求格式
   * @param value
   * @return 转为后格式
   */
  const formatValue = (value: any) => {
    // console.log('==params 原始', deepCopy(value));

    const { dateRange, expectDropInDate, addresses } = value;
    let tmpAddresses: any;
    // 省市区参数处理
    if (isArray(addresses) && addresses.length) {
      tmpAddresses = addresses.map(itm => ({
        provinceId: itm.length ? itm[0] : undefined,
        cityId: itm.length > 1 ? itm[1] : undefined,
        districtId: itm.length > 2 ? itm[2] : undefined,
      }));
    }

    // 创建日期
    const hasDate = isArray(dateRange) && dateRange.length === 2;
    // 期望落位日期
    const hasDropInDate = isArray(expectDropInDate) && expectDropInDate.length === 2;

    const _params = form.getFieldsValue();
    const formattedValue = {
      ..._params,
      ...value,
      // 日期特殊处理
      createdAtStart: hasDate ? dayjs(dateRange[0]).format('YYYY-MM-DD') : undefined,
      createdAtEnd: hasDate ? dayjs(dateRange[1]).format('YYYY-MM-DD') : undefined,
      // 期望落位日期特殊处理
      isOverTime: hasDropInDate ? !!expectDropInDate[0] : undefined,
      expectDropInDateSearchType: hasDropInDate ? expectDropInDate[1] : undefined,
      // 省市区特殊处理
      addresses: tmpAddresses,
    };
    delete formattedValue.dateRange;
    delete formattedValue.expectDropInDate;

    // console.log('==params 格式后', formattedValue);

    return formattedValue;
  };

  const onValuesChange = (changedValues, allValues) => {
    // console.log('onValuesChange, changedValues:', changedValues);
    // console.log('    allValues:', allValues);
    onFilterChanged(formatValue(allValues));
  };

  return (
    <div>
      <SearchForm
        onOkText='搜索'
        form={form}
        onSearch={handleSearch}
        labelLength={8}
        className={styles.searchFromCon}
        onValuesChange={onValuesChange}
      >
        <V2FormInput label='名称搜索' name='keyword' />
        <V2FormInput label='分公司名称' name='branchCompanyName' />
        <V2FormSelect
          label='机会点状态'
          name='chancePointStatuses'
          options={statuses}
          config={{
            mode: 'multiple',
            maxTagCount: 'responsive',
          }}/>
        <V2FormSelect
          label='任务状态'
          name='statuses'
          options={statusOptions}
          config={{
            mode: 'multiple',
            maxTagCount: 'responsive',
          }}
        />
        <V2FormSelect
          label='任务类型'
          name='taskTypeIdList'
          options={taskTypeOptions}
          config={{
            mode: 'multiple',
            maxTagCount: 'responsive',
          }}
        />
        <V2FormProvinceList
          label='省市区'
          name='addresses'
          type={1}
          multiple
          config={{ showCheckedStrategy: Cascader.SHOW_PARENT }}
        />
        <V2FormInput label='开发经理' name='accountName' />
        <V2FormRangePicker
          label='创建日期'
          name='dateRange'
        />
        <V2FormCascader
          label='距离期望落位日期'
          name='expectDropInDate'
          options={dropInOptions}
        />
      </SearchForm>
    </div>
  );
};

export default Filter;
