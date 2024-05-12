import { resTemplateDetail } from '@/common/api/template';
import FormInput from '@/common/components/Form/FormInput';
import FormInputNumber from '@/common/components/Form/FormInputNumber';
import FormRadio from '@/common/components/Form/FormRadio';
import FormSelect from '@/common/components/Form/FormSelect';
import { useMethods } from '@lhb/hook';
import { post } from '@/common/request';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { FC, useEffect, useState } from 'react';

const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 10,
  },
};

const orderPeriodOptions = [
  { value: 1, label: '按周订（7天）' },
  { value: 2, label: '按月订（30天）' },
];
const SpecControlType = {
  orderPeriod: {
    name: 'orderPeriod',
    type: 1,
  },
  specialDate: {
    name: 'specialDate',
    type: 2,
  },
  area: {
    name: 'area',
    type: 3,
  },
  specialCategory: {
    name: 'specialCategory',
    type: 4,
  },

  dailyCount: {
    name: 'dailyCount',
    type: 5,
  },

  limitTextCount: {
    name: 'limitTextCount',
    type: 6,
  },
};
const SpecTab: FC<any> = ({ categoryId, categoryTemplateId }) => {
  const [form] = useForm();
  const [checkInfo, setCheckInfo] = useState<any>({});

  const { onOk, onSearch, loadData, parseFormValue, onChange } = useMethods({
    onChange(value) {
      setCheckInfo({ ...checkInfo, ...value });
    },
    onSearch() {
      loadData();
    },
    loadData: async () => {
      setCheckInfo({});
      form.resetFields();
      const result = await resTemplateDetail({ categoryId, categoryTemplateId });
      if (result.specVOList) {
        let formValues = {};
        result.specVOList.map((item) => {
          const itemValue = parseFormValue(item);
          formValues = { ...formValues, ...itemValue };
        });
        form.setFieldsValue(formValues);
      }
    },
    parseFormValue(item) {
      switch (item.controlType) {
        case SpecControlType.orderPeriod.type:
          setCheckInfo({ ...checkInfo, orderPeriod: true });
          const customOptions: any = item.specOptionList.filter((item) => item.identification === 'input');
          return {
            orderPeriod: Number(item.specOptionList.filter((item) => item.identification === 'select')[0].value),
            ...(customOptions && {
              orderPeriodCustom: customOptions.map((item) => {
                return {
                  orderPeriodName: item.name,
                  orderPeriodDays: item.value,
                };
              }),
            }),
          };
        case SpecControlType.specialDate.type:
          setCheckInfo({ ...checkInfo, specialDate: true });
          return {
            specialDate: item.specOptionList.map((item) => Number(item.value)),
          };
        case SpecControlType.area.type:
          setCheckInfo({ ...checkInfo, area: true });
          return {
            maxLength: item.specOptionList.filter((item) => item.name === 'maxLength')[0].value,
            maxWidth: item.specOptionList.filter((item) => item.name === 'maxWidth')[0].value,
          };
        case SpecControlType.specialCategory.type:
          setCheckInfo({ ...checkInfo, specialCategory: true });
          const input = item.specOptionList.filter((item) => item.identification === 'input');
          return {
            specialCategory: item.specOptionList
              .filter((item) => item.identification === 'select')
              .map((item) => Number(item.value)),
            ...(input && input.length && {specialCategoryCustom: input[0].value})
          };
        case SpecControlType.dailyCount.type:
          setCheckInfo({ ...checkInfo, dailyCount: true });
          return {
            dailyCount: item.specOptionList[0].value,
          };
        case SpecControlType.limitTextCount.type:
          setCheckInfo({ ...checkInfo, limitTextCount: true });
          return {
            maxTextCount: item.specOptionList.filter((item) => item.name === 'maxTextCount')[0].value,
            minTextCount: item.specOptionList.filter((item) => item.name === 'minTextCount')[0].value,
          };
        default:
          return {};
      }
    },
    onOk() {
      form.validateFields().then((values: any) => {
        console.log(123, values, checkInfo);
        const params: any = [];

        // 订购周期处理
        if (checkInfo.orderPeriod) {
          const orderPeriodOptionList: any = [
            {
              name: 1 === values.orderPeriod ? '按周订（7天）' : '按月订（30天）',
              value: values.orderPeriod,
              identification: 'select',
            },
          ];

          if (values.orderPeriodCustom) {
            values.orderPeriodCustom.forEach((item) => {
              orderPeriodOptionList.push({
                name: item.orderPeriodName,
                value: item.orderPeriodDays,
                identification: 'input',
              });
            });
          }

          params.push({
            categoryId,
            categoryTemplateId,
            controlType: SpecControlType.orderPeriod.type,
            name: SpecControlType.orderPeriod.name,
            specOptionList: orderPeriodOptionList,
          });
        }

        // 特殊日期类处理
        if (checkInfo.specialDate) {
          if(values.specialDate === undefined || values.specialDate.length === 0){
            message.warn('请选择日期！');
            return;
          }
          params.push({
            categoryId,
            categoryTemplateId,
            controlType: SpecControlType.specialDate.type,
            name: SpecControlType.specialDate.name,
            specOptionList: values.specialDate.map((item) => ({ name: item, value: item, identification: 'select' })),
          });
        }

        // 面积规格处理
        if (checkInfo.area) {
          if(values.maxLength === undefined || values.maxWidth === undefined  || values.maxLength === null || values.maxWidth === null){
            message.warn('请输入长度或者宽度！');
            return;
          }
          params.push({
            categoryId,
            categoryTemplateId,
            controlType: SpecControlType.area.type,
            name: SpecControlType.area.name,
            specOptionList: [
              { name: 'maxLength', value: values.maxLength },
              { name: 'maxWidth', value: values.maxWidth },
            ],
          });
        }

        // 特殊品类规格处理
        if (checkInfo.specialCategory) {
          const specialCategoryOptionList: any = [];
          if (values.specialCategory && values.specialCategory.length) {
            values.specialCategory.forEach((id) => {
              if (1 === id) {
                specialCategoryOptionList.push({
                  name: '金融理财类',
                  value: id,
                  identification: 'select',
                });
              }
              if (2 === id) {
                specialCategoryOptionList.push({
                  name: '房产类',
                  value: id,
                  identification: 'select',
                });
              }
              if (3 === id) {
                specialCategoryOptionList.push({
                  name: '车展类',
                  value: id,
                  identification: 'select',
                });
              }
            });
          }
          if(specialCategoryOptionList.length === 0){
            message.warn('请选择品类！');
            return;
          }

          if (values.specialCategoryCustom) {
            specialCategoryOptionList.push({
              name: '其他特殊品类',
              value: values.specialCategoryCustom,
              identification: 'input',
            });
          }

          params.push({
            categoryId,
            categoryTemplateId,
            controlType: SpecControlType.specialCategory.type,
            name: SpecControlType.specialCategory.name,
            specOptionList: specialCategoryOptionList,
          });
        }

        // 单日次数处理
        if (checkInfo.dailyCount) {
          if(values.dailyCount === undefined || values.dailyCount === null){
            message.warn('请输入单日次数！');
            return;
          }
          params.push({
            categoryId,
            categoryTemplateId,
            controlType: SpecControlType.dailyCount.type,
            name: SpecControlType.dailyCount.name,
            specOptionList: [
              {
                value: values.dailyCount,
              },
            ],
          });
        }

        // 限制字数处理
        if (checkInfo.limitTextCount) {
          if(values.maxTextCount === undefined || values.minTextCount === undefined  || values.maxTextCount === null || values.minTextCount === null){
            message.warn('请输入限制字数！');
            return;
          }
          params.push({
            categoryId,
            categoryTemplateId,
            controlType: SpecControlType.limitTextCount.type,
            name: SpecControlType.limitTextCount.name,
            specOptionList: [
              { name: 'maxTextCount', value: values.maxTextCount },
              { name: 'minTextCount', value: values.minTextCount },
            ],
          });
        }

        if (params.length == 0) {
          post('/spec/deleteByCategoryTemplateId', { id: categoryTemplateId }, true).then(() => {
            message.success(`保存规格成功`);
            onSearch();
          });
          return;
        } else {
          post('/spec/saveSpecs', params, true).then(() => {
            message.success(`保存规格成功`);
            onSearch();
          });
        }
      });
    },
  });

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <Form {...layout} form={form}>
        <FormRadio
          name='orderPeriod'
          label={
            <>
              <Checkbox
                checked={checkInfo.orderPeriod}
                style={{ marginRight: '5px' }}
                onChange={(e) => {
                  onChange({ orderPeriod: e.target.checked });
                }}
              />
              订购周期
            </>
          }
          initialValue={1}
          config={{
            options: orderPeriodOptions,
          }}
        />
        <Form.Item
          wrapperCol={{
            offset: 4,
            span: 10,
          }}
          required={false}
        >
          <Form.List name='orderPeriodCustom'>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align='baseline'>
                    <Form.Item
                      {...restField}
                      name={[name, 'orderPeriodName']}
                      style={{ display: 'inline-block', width: '150px' }}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: '请输入订购周期名称',
                        },
                      ]}
                      noStyle
                    >
                      <Input placeholder='请输入订购周期名称' style={{ width: '150px', marginRight: '5px' }} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'orderPeriodDays']}
                      style={{ display: 'inline-block', width: '150px' }}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: '请输入订购周期天数',
                        },
                      ]}
                      noStyle
                    >
                      <Input placeholder='请输入订购周期天数' style={{ width: '150px', marginRight: '5px' }} />
                    </Form.Item>
                    <DeleteOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Button type='primary' onClick={() => add()}>
                  新增订购周期
                </Button>
              </>
            )}
          </Form.List>
        </Form.Item>
        <FormSelect
          mode='multiple'
          name='specialDate'
          label={
            <>
              <Checkbox
                checked={checkInfo.specialDate}
                style={{ marginRight: '5px' }}
                onChange={(e) => {
                  onChange({ specialDate: e.target.checked });
                }}
              />
              特殊日期类
            </>
          }
          placeholder='选择日期'
          options={[
            { value: 1, label: '星期一' },
            { value: 2, label: '星期二' },
            { value: 3, label: '星期三' },
            { value: 4, label: '星期四' },
            { value: 5, label: '星期五' },
            { value: 6, label: '星期六' },
            { value: 7, label: '星期日' },
          ]}
        />

        <Form.Item
          label={
            <>
              <Checkbox
                checked={checkInfo.area}
                style={{ marginRight: '5px' }}
                onChange={(e) => {
                  onChange({ area: e.target.checked });
                }}
              />
              面积规格
            </>
          }
        >
          <FormInputNumber
            placeholder='最大长度'
            name='maxLength'
            min={0}
            max={9999}
            formItemConfig={{
              style: { display: 'inline-block', width: '150px' },
            }}
            config={{
              addonAfter: 'm',
              precision: 0,
            }}
          />
          <FormInputNumber
            placeholder='最大宽度'
            name='maxWidth'
            min={0}
            max={9999}
            formItemConfig={{
              style: { display: 'inline-block', marginLeft: '14px', width: '150px' },
            }}
            config={{
              addonAfter: 'm',
              precision: 0,
            }}
          />
        </Form.Item>

        <FormSelect
          name='specialCategory'
          mode='multiple'
          label={
            <>
              <Checkbox
                checked={checkInfo.specialCategory}
                style={{ marginRight: '5px' }}
                onChange={(e) => {
                  onChange({ specialCategory: e.target.checked });
                }}
              />
              特殊品类规格
            </>
          }
          placeholder='请选择品类'
          options={[
            { value: 1, label: '金融理财类' },
            { value: 2, label: '房产类' },
            { value: 3, label: '车展类' },
          ]}
        />
        <Form.Item
          wrapperCol={{
            offset: 4,
            span: 10,
          }}
        >
          <FormInput
            formItemConfig={{
              help: '如对特殊品类特殊收费，可输入品类名称，如：服装售卖',
            }}
            name='specialCategoryCustom'
            placeholder='请输入品类名称'
            rules={[{ required: false, message: '请输入品类名称' }]}
            maxLength={20}
          />
        </Form.Item>
        <FormInputNumber
          name='dailyCount'
          label={
            <>
              <Checkbox
                checked={checkInfo.dailyCount}
                style={{ marginRight: '5px' }}
                onChange={(e) => {
                  onChange({ dailyCount: e.target.checked });
                }}
              />
              单日次数
            </>
          }
          placeholder='请输入单日次数'
          min={0}
          max={9999}
          config={{
            addonAfter: '次/天',
            precision: 0,
          }}
        />

        <Form.Item
          label={
            <>
              <Checkbox
                checked={checkInfo.limitTextCount}
                style={{ marginRight: '5px' }}
                onChange={(e) => {
                  onChange({ limitTextCount: e.target.checked });
                }}
              />
              限制字数
            </>
          }
        >
          <FormInputNumber
            placeholder='最少字数'
            name='minTextCount'
            min={0}
            max={9999}
            formItemConfig={{
              style: { display: 'inline-block', width: '150px' },
            }}
            config={{
              addonAfter: '字',
              precision: 0,
            }}
          />
          <FormInputNumber
            placeholder='最多字数'
            name='maxTextCount'
            min={0}
            max={9999}
            formItemConfig={{
              style: { display: 'inline-block', marginLeft: '14px', width: '150px' },
            }}
            config={{
              addonAfter: '字',
              precision: 0,
            }}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4 }}>
          <Button type='primary' onClick={onOk}>
            保存
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default SpecTab;
