import SearchFormBrief from '@/common/components/Form/SearchFormBrief';
import { useMethods } from '@lhb/hook';
import { Form, Input } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { getLabels } from '@/common/api/place';

import StateTab from '@/common/components/Tabs/StateTab';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import FormPlaceCategoryTreeSelect from '@/common/components/Form/FormPlaceCategoryTreeSelect';
import HighFilterModal from '@/common/components/Business/Resmng/HighFilterModal';
import { ResourceType } from './ts-config';
import FormProvinceBussinessAreaSelect from '@/common/components/Form/FormProvinceBussinessArea';
import FormInputNumber from '../../Form/FormInputNumber';
import FormCheckbox from '../../Form/FormCheckbox';

/**
 * 资源管理搜索
 * @param param0.resourceType 0 场地 1 点位
 * @returns
 */
const SearchForm: React.FC<any> = ({ onSearch, resourceType, spotParam, channelCode = 'KA' }) => {
  const [form] = Form.useForm();
  const [formItem, setFormItem] = useState({});
  const [status, setStatus] = useState(0);
  const [allFormItem, setAllFormItem] = useState({});
  const [statuses, setStatuses] = useState<Array<{ value: Number; label: String }>>([]); // tabs 状态
  const [filterData, setFilterData] = useState<{ visible: boolean; checkedList: CheckboxValueType[] }>({
    visible: false,
    checkedList: [],
  });

  const searchRef = useRef();

  const { loadData, extra, extraForm } = useMethods({
    loadData: async () => {
      const all = await getLabels({
        type: 'standard',
        channelCode: channelCode,
        tab: resourceType === 0 ? 'placeTab' : 'spotTab',
      });
      /**
       * 设置tabber
       */
      setStatuses(
        all.map((item, index) => {
          return {
            key: index,
            label: item.title,
          };
        })
      );

      /**
       * 设置所有表单
       */
      const formItemObj = {};
      all.map((item, index) => {
        formItemObj[index] = index === 0 ? extraForm() : []; // 如果是基础信息，则需要额外插入表单
        item?.children?.map((item2) => {
          formItemObj[index].push({
            type: item2.type === 'radio' ? 'radio' : 'checkbox',
            name: 'tag' + item2.key,
            label: item2.title,
            formItemConfig: { style: { width: '100%' } },
            config: {
              options: item2.children.map((item3) => {
                return {
                  value: item3.key,
                  label: item3.title,
                };
              }),
            },
          });
        });
      });
      setAllFormItem(formItemObj);
      // 设置当前表单项
      setFormItem(formItemObj[0]);
    },

    /**
     * 高级筛选
     */
    extra: () => {
      const checkedCount = filterData?.checkedList?.length;
      return (
        <span className='color-primary ml-16 pointer' onClick={onShowFilter}>
          高级筛选{checkedCount ? '（已选' + checkedCount + '个标签）' : ''}
        </span>
      );
    },

    /**
     * 额外的表单项，目前仅在基础信息的时候进行筛选
     * @returns 表单列表
     */
    extraForm: () => {
      const arr: any =
        resourceType === ResourceType.SPOT
          ? [{ type: 'input', name: 'placeId', label: '场地ID', maxLength: '40' }]
          : [];
      arr.push({ type: 'input', name: channelCode === 'KA' ? 'name' : 'searchPlaceName', label: '场地名称', maxLength: '40' });
      // 增加点位Id和点位名称搜索
      if (resourceType !== ResourceType.PLACE) {
        arr.unshift({ type: 'input', name: 'spotId', label: '点位ID', maxLength: '20' }, { type: 'input', name: 'spotName', label: '点位名称', maxLength: '30' });
      }

      arr.push({
        custom: (index) => (
          <FormPlaceCategoryTreeSelect
            key={index}
            name='placeCategoryIdList'
            label='场地类目'
            placeholder='请选择类目进行搜索'
            type={0}
            config={{
              multiple: true,
              fieldNames: { label: 'name', value: 'id', children: 'childList' },
              style: { width: '180px' },
              allowClear: true,
            }}
          />
        ),
      });

      // 如果不是场地，则插入
      if (resourceType !== ResourceType.PLACE) {
        arr.push({
          custom: (index) => (
            <FormPlaceCategoryTreeSelect
              key={index}
              name='spotCategoryIdList'
              label='点位类目'
              placeholder='请选择类目进行搜索'
              type={1}
              config={{
                multiple: true,
                fieldNames: { label: 'name', value: 'id', children: 'childList' },
                style: { width: '180px' },
                allowClear: true,
              }}
            />
          ),
        });
      }

      arr.push({
        custom: (index) => (
          <FormProvinceBussinessAreaSelect
            channelCode={channelCode}
            key={index}
            name='city'
            label='城市'
            placeholder='请选择城市'
            config={{
              multiple: true,
              fieldNames: { label: 'title', value: 'key', children: 'children' },
              treeNodeFilterProp: 'title',
              allowClear: true,
            }}
          />
        ),
      });

      // 如果不是场地，则插入
      if (resourceType !== ResourceType.PLACE && channelCode === 'KA') {
        arr.push({
          custom: (index) => (
            <Input.Group compact key={index}>
              <FormInputNumber
                label='工作日底价'
                placeholder='最小值'
                name='weekdayDeepPriceMin'
                min={0}
                max={9999999}
                config={{
                  addonAfter: '元',
                  precision: 0,
                }}
              />
              <Input
                style={{
                  width: 30,
                  borderLeft: 0,
                  borderRight: 0,
                  pointerEvents: 'none',
                }}
                placeholder='~'
                disabled
              />
              <FormInputNumber
                placeholder='最大值'
                name='weekdayDeepPriceMax'
                min={0}
                max={999999}
                config={{
                  addonAfter: '元',
                  precision: 0,
                }}
              />
            </Input.Group>
          ),
        });

        arr.push({
          custom: (index) => (
            <Input.Group compact key={index}>
              <FormInputNumber
                label='周末底价'
                placeholder='最小值'
                name='weekendDeepPriceMin'
                min={0}
                max={9999999}
                config={{
                  addonAfter: '元',
                  precision: 0,
                }}
              />
              <Input
                style={{
                  width: 30,
                  borderLeft: 0,
                  borderRight: 0,
                  pointerEvents: 'none',
                }}
                placeholder='~'
                disabled
              />
              <FormInputNumber
                placeholder='最大值'
                name='weekendDeepPriceMax'
                min={0}
                max={999999}
                config={{
                  addonAfter: '元',
                  precision: 0,
                }}
              />
            </Input.Group>
          ),
        });
        arr.push({
          custom: (index) => (
            <Input.Group compact key={index}>
              <FormInputNumber
                label='节假日底价'
                placeholder='最小值'
                name='holidayDeepPriceMin'
                min={0}
                max={9999999}
                config={{
                  addonAfter: '元',
                  precision: 0,
                }}
              />
              <Input
                style={{
                  width: 30,
                  borderLeft: 0,
                  borderRight: 0,
                  pointerEvents: 'none',
                }}
                placeholder='~'
                disabled
              />
              <FormInputNumber
                placeholder='最大值'
                name='holidayDeepPriceMax'
                min={0}
                max={999999}
                config={{
                  addonAfter: '元',
                  precision: 0,
                }}
              />
            </Input.Group>
          ),
        });
        arr.push({
          custom: (index) => (
            <Input.Group compact key={index}>
              <FormInputNumber
                label='周底价'
                placeholder='最小值'
                name='weekDeepPriceMin'
                min={0}
                max={9999999}
                config={{
                  addonAfter: '元',
                  precision: 0,
                }}
              />
              <Input
                style={{
                  width: 30,
                  borderLeft: 0,
                  borderRight: 0,
                  pointerEvents: 'none',
                }}
                placeholder='~'
                disabled
              />
              <FormInputNumber
                placeholder='最大值'
                name='weekDeepPriceMax'
                min={0}
                max={999999}
                config={{
                  addonAfter: '元',
                  precision: 0,
                }}
              />
            </Input.Group>
          ),
        });
        arr.push({
          custom: (index) => (
            <Input.Group compact key={index}>
              <FormInputNumber
                label='月底价'
                placeholder='最小值'
                name='monthlyDeepPriceMin'
                min={0}
                max={9999999}
                config={{
                  addonAfter: '元',
                  precision: 0,
                }}
              />
              <Input
                style={{
                  width: 30,
                  borderLeft: 0,
                  borderRight: 0,
                  pointerEvents: 'none',
                }}
                placeholder='~'
                disabled
              />
              <FormInputNumber
                placeholder='最大值'
                name='monthlyDeepPriceMax'
                min={0}
                max={999999}
                config={{
                  addonAfter: '元',
                  precision: 0,
                }}
              />
            </Input.Group>
          ),
        });

        arr.push({
          custom: (index) => (
            <Input.Group compact key={index}>
              <FormInputNumber
                label='最大面积'
                placeholder='最小值'
                name='spotAreaMin'
                min={0}
                max={9999999}
                config={{
                  addonAfter: 'm²',
                  precision: 0,
                }}
              />
              <Input
                style={{
                  width: 30,
                  borderLeft: 0,
                  borderRight: 0,
                  pointerEvents: 'none',
                }}
                placeholder='~'
                disabled
              />
              <FormInputNumber
                placeholder='最大值'
                name='spotAreaMax'
                min={0}
                max={999999}
                config={{
                  addonAfter: 'm²',
                  precision: 0,
                }}
              />
            </Input.Group>
          ),
        });
      }

      return arr;
    },
  });

  /**
   * tabber切换
   * @param val tab值
   */
  const handleTabsChange = (val) => {
    setStatus(val);
    setFormItem(allFormItem[val + '']);
  };

  const onShowFilter = () => {
    form.resetFields(); // 打开高级搜索情况下，重置表单
    filterData.visible = !filterData.visible;
    setFilterData({ ...filterData });
  };

  /**
   * 重置回调
   */
  const onResetFn = () => {
    setFilterData({ visible: false, checkedList: [] });
    onSearch && onSearch({});
  };

  /**
   * 高级搜索弹出框确定事件
   */
  const onModalSubmit = (checkedList) => {
    setFilterData({ checkedList: checkedList, visible: false });
    onFormSearch({}, checkedList);
  };

  const onFormSearch = (filter: { [key: string]: any }, checkedList = filterData.checkedList) => {
    const formData = form.getFieldsValue(true);
    const { independentSpot, ...rest } = formData;
    // 虚拟项目 0-否 1-是 null-全部（不过滤），目前逻辑为勾选显示全部项目，不勾选显示非虚拟项目
    if (independentSpot && independentSpot.length) {
      rest.independentSpot = null;
    } else {
      rest.independentSpot = 0;
    }

    onSearch && onSearch({ ...rest, 'hightSearch': checkedList });
  };

  const otherSearchForm = () => {
    if (resourceType === 0 && status === 0) {
      return <FormCheckbox name={'independentSpot'} label='虚拟项目' config={{ options: [{ value: 1, label: '显示' }] }}/>;
    } else {
      return <></>;
    }
  };


  useEffect(() => {
    extra();
  }, [extra, filterData.visible]);

  useEffect(() => {
    form.resetFields();
    loadData();
    setStatus(0); // 重置tabber
    setFilterData({ checkedList: [], visible: false });
  }, [form, loadData, resourceType]);

  useEffect(() => {
    form.setFieldsValue(spotParam);
  }, [form, spotParam]);

  return (
    <>
      <StateTab options={statuses} onChange={handleTabsChange} activeKey={status + ''}></StateTab>
      <SearchFormBrief
        actionRef={searchRef}
        onSearch={onFormSearch}
        labelLength={0}
        form={form}
        isFooterButtonLine={true}
        columns={formItem}
        extra={extra()}
        onResetFn={onResetFn}
        setFilterData={setFilterData}
        otherSearchForm={otherSearchForm}
      />

      {/* 高级筛选 */}
      <HighFilterModal
        resourceType={resourceType}
        filterData={filterData}
        setFilterData={setFilterData}
        onSubmit={onModalSubmit}
        channelCode={channelCode}
      ></HighFilterModal>
    </>
  );
};

export default SearchForm;
