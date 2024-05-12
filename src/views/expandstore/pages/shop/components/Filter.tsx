/**
 * @Description 门店管理筛选项
 */

import { FC, useEffect, useState } from 'react';
import { Form, Cascader } from 'antd';
import SearchForm from '@/common/components/Form/SearchForm';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormCascader from '@/common/components/Form/V2FormCascader/V2FormCascader';
import { isArray, refactorSelection } from '@lhb/func';
import styles from './index.module.less';
import { shopSelection } from '@/common/api/expandStore/shop';

interface Props {
  onSearch: Function, // 搜索函数
}

const Filter: FC<Props> = ({
  onSearch
}) => {
  const [form] = Form.useForm();
  const [areaList, setAreaList] = useState<any[]>([]);
  const [origins, setOrigins] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);

  useEffect(() => {
    getSelection();
  }, []);

  const getSelection = async () => {
    const data = await shopSelection();
    // 所属公司包含的省市
    isArray(data.areaList) && setAreaList(data.areaList.map((itm: any) => ({
      ...itm,
      value: itm.id,
      label: itm.name,
      children: itm.cities.map((city: any) => ({
        value: city.id,
        label: city.name,
      }))
    })));
    // 数据来源
    isArray(data.originList) && setOrigins(refactorSelection(data.originList));
    // 状态
    isArray(data.statusList) && setStatuses(refactorSelection(data.statusList));
  };

  /**
   * @description 查询时部分参数特殊处理
   * @param value 参数
   * @return
   */
  const handleSearch = (value: any) => {
    const { addresses } = value;
    let tmpAddresses: any;
    // 省市区参数处理
    if (isArray(addresses) && addresses.length) {
      tmpAddresses = addresses.map(itm => ({
        provinceId: itm.length ? itm[0] : undefined,
        cityId: itm.length > 1 ? itm[1] : undefined,
      }));
      value.addresses = tmpAddresses;
    }
    const _params = form.getFieldsValue();
    onSearch && onSearch({
      ..._params,
      ...value
    });
  };

  return (
    <div>
      <SearchForm
        form={form}
        labelLength={4}
        onSearch={handleSearch}
        className={styles.searchFromCon}
      >
        <V2FormInput label='门店名称' name='name' placeholder='请输入门店名称'/>
        <V2FormCascader
          label='所在城市'
          name='addresses'
          options={areaList}
          multiple
          config={{ showCheckedStrategy: Cascader.SHOW_PARENT }}
        />
        <V2FormSelect
          label='当前状态'
          name='statuses'
          options={statuses}
          config={{
            mode: 'multiple',
            maxTagCount: 'responsive',
            showSearch: true,
            filterOption: false,
          }}/>
        <V2FormSelect
          label='数据来源'
          name='origin'
          options={origins}/>
      </SearchForm>
    </div>
  );
};

export default Filter;
