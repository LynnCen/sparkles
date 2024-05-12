/**
 * @Description 顶部操作区域
 */

import { FC, useState, useEffect } from 'react';
import { Form } from 'antd';
import SearchForm from '@/common/components/Form/SearchForm';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import { refactorSelection } from '@/common/utils/ways';
import { getTaskSelection } from '@/common/api/expandStore/expansiontask';
import styles from './index.module.less';
import { isArray } from '@lhb/func';
import dayjs from 'dayjs';
import FormSearchUser from './FormSearchUser';
import V2FormRangePicker from '@/common/components/Form/V2FormRangePicker/V2FormRangePicker';
import V2FormCascader from '@/common/components/Form/V2FormCascader/V2FormCascader';

// 落位日期筛选项大类型
const dropInDateTypes: any = [
  { label: '距离超期还剩', value: 0 },
  { label: '已超期', value: 1 },
];
interface Props {
  onSearch: Function; // 搜索函数
  onFilterChanged: Function;
  isWaitAsign?:boolean
}

const Filter: FC<Props> = ({ onSearch, onFilterChanged, isWaitAsign }) => {
  const [form] = Form.useForm();
  // const [departmentListOpt, setDepartmentListOpt] = useState<any[]>([]);
  const [statusOptions, setStatusOptions] = useState<any[]>([]); // 任务状态
  const [emergencyDegreesOptions, setEmergencyDegreesOptions] = useState<any[]>([]);
  const [dropInOptions, setDropInOptions] = useState<any[]>([]); // 距离期望落位时间下拉选项
  // const [selectedDepartmentIds, setSelectedDepartmentIds] = useState<any[]>([]);

  useEffect(() => {
    getSelection();
    // getDepartmentList();
  }, []);

  /**
   * 部门列表
   */
  // const getDepartmentList = async () => {
  //   const { objectList = [] }: DepartMentResult = await departmentPermissionList();
  //   setDepartmentListOpt(objectList);
  // };

  /**
   * @description 获取落位时间下拉选项
   */
  const getSelection = async () => {
    const res = await getTaskSelection();
    setStatusOptions(refactorSelection(res.taskStatus));
    setEmergencyDegreesOptions(refactorSelection(res.emergencyDegree));
    // 落位日期
    const dropInLevelTwoTypes = refactorSelection(res.expectDropInDateSearchType);
    const dropInOptions = dropInDateTypes.map((itm: any) => ({
      ...itm,
      children: dropInLevelTwoTypes,
    }));
    setDropInOptions(dropInOptions);
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
    const { dateRange, expectDropInDate, addresses } = value;
    let tmpAddresses: any;
    // 省市区参数处理
    if (isArray(addresses) && addresses.length) {
      tmpAddresses = addresses.map((itm) => ({
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

    return formattedValue;
  };

  const onValuesChange = (changedValues, allValues) => {
    onFilterChanged(formatValue(allValues));
  };

  // const onDepartmentsChange = (values) => {
  //   form.setFieldValue('managerIds', []);
  //   setSelectedDepartmentIds(values);
  // };

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
        {/* <V2FormTreeSelect
          name='departmentIds'
          label='部门'
          treeData={departmentListOpt}
          onChange={(value) => onDepartmentsChange(value)}
          placeholder='选择部门'
          config={{
            multiple: true,
            fieldNames: { label: 'name', value: 'id', children: 'children' },
            treeDefaultExpandAll: true,
            showSearch: true,
            treeNodeFilterProp: 'name',
          }}
        /> */}
        {
          !isWaitAsign ? <FormSearchUser
            label='开发经理'
            name='managerIds'
            placeholder='请输入姓名'
            mode='multiple'
          // departmentIds={selectedDepartmentIds}
          /> : <></>
        }

        <V2FormInput label='任务名称' name='keyword' />
        {
          !isWaitAsign ? <>
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
              label='紧急度'
              name='emergencyDegrees'
              options={emergencyDegreesOptions}
              config={{
                mode: 'multiple',
                maxTagCount: 'responsive',
              }}
            />
            <V2FormRangePicker
              label='创建日期'
              name='dateRange'
            />
            <V2FormCascader
              label='距离期望落位日期'
              name='expectDropInDate'
              options={dropInOptions}
            /></> : <></>
        }

      </SearchForm>
    </div>
  );
};

export default Filter;
