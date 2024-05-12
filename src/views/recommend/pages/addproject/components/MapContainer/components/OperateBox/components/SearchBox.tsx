/**
 * @Description 筛选条件相关逻辑
 */

import SearchModal from '@/common/components/business/Edit/components/Search/SearchModal';
import { debounce, each, isArray, isNotEmpty } from '@lhb/func';
import { FC, useEffect, useState } from 'react';
import { selectMultipleKeys, selectSingleKeys } from '@/common/components/business/Edit';
import { Form } from 'antd';

const SearchBox:FC<any> = ({
  isBranch,
  searchModalData,
  setSearchParams,
  setSearchModalData,
  selections
}) => {
  const [searchMoreForm] = Form.useForm(); // 全部筛选form，42个

  const [searchNum, setSearchNum] = useState<number>(0); // 全部筛选处，已经填充过的筛选项总数量

  const computedSearchNum = (params) => { // 更新setSearchNum的值
    let num = 0;
    each(params, (item, key) => {
      if (
        (isArray(item) && (item[0] || item[1])) || // 如果是数组，那至少要有其中一个值
        (!isArray(item) && isNotEmpty(item)) // 如果不是数组，就不能为空
      ) { // 有值的才做插入
        if (key !== 'no-mean') { // 规避掉 no-mean
          num++;
        }
      }
    });
    setSearchNum(num);
  };

  const updateSearchNum = () => {
    const _params = searchMoreForm.getFieldsValue();
    const mergeParams = {
      ..._params,
    };
    computedSearchNum(mergeParams);
  };
  const refactorParams = (data = {}) => {
    const _params = searchMoreForm.getFieldsValue();
    const mergeParams = {
      ..._params,
      ...data,
    };
    const result: any = {
      isOpenStore: mergeParams.isOpenStore, // 是否已开店，需要拉倒最外层
      isPlanned: mergeParams.isPlanned, // 是否已规划，需要拉倒最外层
      otherKeys: []
    };
    if (!isBranch && isNotEmpty(_params.branchCompanyPlanStatus)) { // 总公司时
      result.branchCompanyPlanStatus = _params.branchCompanyPlanStatus;
    }

    if (mergeParams.districtIdList?.length) {
      result.districtIdList = mergeParams.districtIdList.map(item => Number(item[2])); // 改为省市区三级选项了
    }
    if (mergeParams.secondLevelCategory?.length) {
      result.secondLevelCategory = mergeParams.secondLevelCategory.map(item => item[1]);
    }
    result.type = mergeParams.type;

    mergeParams.districtIdList = undefined;
    mergeParams.secondLevelCategory = undefined;
    // 把一些没有意义的字段移除,其他字段组装到other
    mergeParams.isOpenStore = undefined;
    mergeParams.isPlanned = undefined;
    mergeParams.branchCompanyPlanStatus = undefined;
    mergeParams.type = undefined;
    each(mergeParams, (item: any, key: string) => {
      if (
        (isArray(item) && (item[0] || item[1])) || // 如果是数组，那至少要有其中一个值
        (!isArray(item) && isNotEmpty(item)) // 如果不是数组，就不能为空
      ) {
        if (['sort', 'sortField', 'name'].includes(key)) {
          result[key] = item;
        } else if (key !== 'no-mean') { // 规避掉no-mean // 有值的才做插入
          const isSingleSelect = selectSingleKeys.includes(key); // 是单选select
          const isMultipleSelect = selectMultipleKeys.includes(key); // 是多选select
          const newItem: any = {
            key,
            type: isSingleSelect ? 1 : (isMultipleSelect ? 2 : 3),
          };
          if (isSingleSelect) {
            newItem.value = item;
          } else if (isMultipleSelect) {
            newItem.multiValue = item;
          } else {
            newItem.min = item[0];
            newItem.max = item[1];
          }
          result.otherKeys.push(newItem);
        }
      }
    });
    return result;
  };
  const onSearch = debounce((data) => {
    const result = refactorParams(data);
    setSearchParams(result);
  }, 300);
  const onSearchSyncParams = (params) => {
    // 同时需要更新全部筛选的number统计值
    computedSearchNum(params);

    onSearch(params);
  };
  const onReset = () => {
    searchMoreForm.resetFields(); // 重置全部筛选
    updateSearchNum(); // 重置后需要更新一下搜索数量
    onSearch({});
  };
  useEffect(() => {
    // 如果有筛选条件，需要把筛选条件传给弹窗
    if (searchModalData.formData) {
      searchMoreForm.setFieldsValue(searchModalData.formData);
      onSearchSyncParams(searchModalData.formData);
      updateSearchNum();
    }
  }, [searchModalData.formData]);

  return <div>
    <SearchModal
      form={searchMoreForm}
      isBranch={isBranch}
      searchNum={searchNum}
      selections={selections}
      detail={searchModalData.detail}
      onSearch={onSearchSyncParams}
      visible={searchModalData.visible}
      onReset={onReset}
      computedSearchNum={computedSearchNum}
      isSetSession={false}
      close={() => setSearchModalData({
        ...searchModalData,
        visible: false
      })}/>
  </div>;
};
export default SearchBox;
