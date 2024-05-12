/**
 * @Description 已废弃，待删除
 */

import { FC, useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Row,
  Col,
  message,
} from 'antd';
import {
  taskSelection,
  taskCreate
} from '@/common/api/recommend';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import FormSelect from '@/common/components/Form/FormSelect';
import FormRange from '@/common/components/Form/FormRange';
import FormInput from '@/common/components/Form/FormInput';
import FormProvinceList from '@/common/components/FormBusiness/FormProvinceList';
import FormDatePicker from '@/common/components/Form/FormDatePicker';
import FormInputNumber from '@/common/components/Form/FormInputNumber';

const formItemLayout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 19,
    offset: 1
  }
};

const ModalForm: FC<any> = ({
  modalData,
  modalHandle,
  assignedHandle
  // loadData
}) => {
  const [form] = Form.useForm();
  const { visible } = modalData;
  const [selectionOptions, setSelectionOptions] = useState<any>({
    shopCategoryList: [],
    shopLevelList: [],
    unitOptions: [
      { label: '元/年', value: 1 },
      { label: '元/月', value: 2 },
      { label: '元/平米', value: 3 },
    ],
    brandList: [
      { label: '岚图', value: 1 },
    ]
  });
  const provinceData = useSelector((state: any) => state.common.provincesCities);

  useEffect(() => {
    getSelection();
  }, []);

  const getSelection = () => {
    taskSelection({ keys: ['shopCategory', 'shopLevel'] }).then(({ data }) => {
      const { shopCategoryList, shopLevelList } = data;
      setSelectionOptions((state) => ({
        ...state,
        shopCategoryList,
        shopLevelList
      }));
    });
  };

  const formChange = (changedValues, allValues) => {
    if (changedValues.hasOwnProperty('name')) return;
    const { pcIds, brand, levelId, count } = allValues;
    if (Array.isArray(pcIds) && pcIds.length && brand && count) {
      const cityName = getCityName(pcIds[0], pcIds[1]); // 城市名
      const level = selectionOptions.shopLevelList.find((item: any) => {
        return item.id === levelId;
      });
      const name = `${selectionOptions.brandList[0].label}-${cityName}开${count}个${level ? level.name : '店'}`;
      form.setFields([{
        name: 'name',
        value: name
      }]);
    }
  };

  const submitHandle = () => {
    form.validateFields().then(async (values: any) => {
      const {
        categoryId,
        levelId,
        minArea,
        maxArea,
        rent,
        rentalUnit,
        competingBrands,
        pcIds,
        count,
        brand,
        finishAt,
        name
      } = values;
      const params = {
        categoryIds: [categoryId],
        levelIds: [levelId],
        minArea,
        maxArea,
        rent,
        rentalUnit,
        competingBrands,
        cityIds: [pcIds[1]],
        cityShops: [
          { count, cityName: getCityName(pcIds[0], pcIds[1]), cityId: pcIds[1] }
        ],
        brand: {
          id: brand,
          name: selectionOptions.brandList[0].label,
          brandName: selectionOptions.brandList[0].label
        },
        finishAt: dayjs(finishAt).format('YYYY-MM-DD'),
        name
      };
      const { data } = await taskCreate(params);
      assignedHandle({
        visible: true,
        detail: data
      });
      modalHandle(false);
      message.success('创建成功');
    });
  };

  const getCityName = (provinceId: number, cityId: number) => {
    const targetProvince = provinceData.find((provinceItem) => provinceItem.id === provinceId);
    if (targetProvince) {
      const targetCity = targetProvince.children.find((cityItem) => cityItem.id === cityId);
      if (targetCity) {
        return targetCity.name;
      }
    }
    return '';
  };

  return (
    <Modal
      title='创建拓店任务'
      open={visible}
      destroyOnClose={true}
      maskClosable={false}
      keyboard={false}
      onOk={submitHandle}
      onCancel={() => modalHandle(false)}>
      <Form
        form={form}
        preserve={false}
        colon={false}
        name='form'
        onValuesChange={formChange}
        {...formItemLayout}>
        <FormSelect
          label='店铺类型'
          name='categoryId'
          options={selectionOptions.shopCategoryList}
          rules={[
            { required: true, message: '请选择店铺类型' },
          ]}
          formItemConfig={{
            initialValue: 1
          }}
          config={{
            fieldNames: {
              label: 'name',
              value: 'id'
            }
          }}/>
        <FormSelect
          label='店铺级别'
          name='levelId'
          options={selectionOptions.shopLevelList}
          rules={[
            { required: true, message: '请选择店铺级别' },
          ]}
          formItemConfig={{
            initialValue: 1
          }}
          config={{
            fieldNames: {
              label: 'name',
              value: 'id'
            }
          }}/>
        <FormRange
          label='店铺大小'
          formItemConfig={{
            required: true
          }}
          leftName='minArea'
          rightName='maxArea'
          leftRules={[
            { required: true, message: '最小店铺大小' },
          ]}
          rightRules={[
            { required: true, message: '最大店铺大小' },
          ]}
          leftConfig={{
            placeholder: '最小值'
          }}
          rightConfig={{
            placeholder: '最大值'
          }}
          min={1}
          max={999999}
          extra={
            <span className='pl-8 mt-5'>
            平米
            </span>
          }/>
        <Row gutter={20}>
          <Col span={14}>
            <FormInputNumber
              label='租金预算'
              name='rent'
              min={1}
              max={999999999}
              formItemConfig={{
                labelCol: { span: 8 }
              }}
              config={{
                style: {
                  width: '100%'
                }
              }}
              placeholder='请输入租金预算'/>
          </Col>
          <Col span={8}>
            <FormSelect
              name='rentalUnit'
              options={selectionOptions.unitOptions}
              formItemConfig={{
                initialValue: 3
              }}/>
          </Col>
        </Row>
        <FormInput
          label='竞品品牌'
          name='competingBrands'
          placeholder='请输入拓店需关注的竞品品牌'
          maxLength={50}/>
        <FormProvinceList
          label='规划城市'
          name='pcIds'
          type={2}
          placeholder='请选择省市'
          config={{
            allowClear: false,
            changeOnSelect: true
          }}
          rules={[
            { required: true, message: '请选择省市' },
          ]}/>
        <FormInputNumber
          label='拓店数量'
          name='count'
          min={1}
          max={20000}
          config={{
            style: {
              width: '150px'
            }
          }}
          rules={[
            { required: true, message: '请输入拓店数量' },
          ]}
          placeholder='请输入拓店数量'/>
        <FormSelect
          label='开店品牌'
          name='brand'
          options={selectionOptions.brandList}
          rules={[
            { required: true, message: '请选择开店品牌' },
          ]}/>
        <FormDatePicker
          label='截止日期'
          name='finishAt'
          placeholder='请选择截止日期'
          rules={[
            { required: true, message: '请选择截止日期' },
          ]}
          config={{
            style: { width: '100%' },
            allowClear: true
          }}/>
        <FormInput
          label='任务名称'
          name='name'
          placeholder='请输入任务名称'
          maxLength={30}
          rules={[
            { required: true, message: '请输入任务名称' },
          ]}/>
      </Form>
    </Modal>
  );
};

export default ModalForm;
