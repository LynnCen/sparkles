import { brandList, brandSearch } from '@/common/api/brand';
import { industryList } from '@/common/api/industry';
import FormInputNumber from '@/common/components/Form/FormInputNumber';
import FormSelect from '@/common/components/Form/FormSelect';
import FormTreeSelect from '@/common/components/Form/FormTreeSelect';
import { useMethods } from '@lhb/hook';
import { Form, Input, Modal, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { HistoryPriceModalProps } from '../../ts-config';
import DynamicRangePicker from '../DynamicRangePicker';
import { debounce, deepCopy, recursionEach } from '@lhb/func';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const HistoryPriceModal: React.FC<HistoryPriceModalProps> = ({
  historyPriceModalInfo,
  setHistoryPriceModalInfo,
  data,
  setData,
  onChange,
}) => {
  const [form] = Form.useForm();
  const [brandOptions, setBrandOptions] = useState<any>([]);
  const [industryOptions, setIndustryOptions] = useState<any>([]);
  const { parseTitle, onCancel, loadBrandData, loadIndustryData } = useMethods({
    parseTitle() {
      return historyPriceModalInfo.id ? '编辑报价' : '新增报价';
    },
    onCancel() {
      setHistoryPriceModalInfo({ visible: false });
      form.resetFields();
    },
    loadBrandData: async () => {
      const result = await brandList({ type: 1 });
      if (result && result.objectList) {
        const resultOptions = result.objectList.map((item) => {
          return { label: item.name, value: item.id };
        });
        setBrandOptions(resultOptions);
      }
    },
    loadIndustryData: async () => {
      const result = await industryList({});
      setIndustryOptions(result.industryResponseList);
    },
  });
  // 确定
  const onSubmit = () => {
    form.validateFields().then((values) => {
      if (historyPriceModalInfo.id) {
        const dataCopy = deepCopy(data);
        dataCopy.forEach((element) => {
          if (element.id === historyPriceModalInfo.id) {
            element.brandId = values.brandId;
            element.industryId = values.industryId;
            element.cost = values.cost;
            element.specialApprovalFee = values.specialApprovalFee;
            element.approvalFee = values.approvalFee;
            element.price = values.price;
            element.spec = values.spec;
            element.time = values.time;

            recursionEach(industryOptions, 'childList', (item: any) => {
              if (item.id === values.industryId) {
                element.industryName = item.name;
              }
            });
            recursionEach(brandOptions, 'childList', (item: any) => {
              if (item.value === values.brandId) {
                element.brandName = item.label;
              }
            });
          }
        });
        onChange(dataCopy);
        setData(dataCopy);
        onCancel();
      } else {
        values.id = Math.random();
        const dataCopy = deepCopy(data);
        recursionEach(industryOptions, 'childList', (item: any) => {
          if (item.id === values.industryId) {
            values.industryName = item.name;
          }
        });
        recursionEach(brandOptions, 'childList', (item: any) => {
          if (item.value === values.brandId) {
            values.brandName = item.label;
          }
          console.log(values);
        });
        dataCopy.push(values);
        onChange(dataCopy);
        setData(dataCopy);
        onCancel();
      }
    });
  };

  useEffect(() => {
    // 弹窗打开没必要重复调接口
    if (!historyPriceModalInfo.visible) {
      return;
    }
    if (historyPriceModalInfo.id) {
      form.setFieldsValue(historyPriceModalInfo);
    }
    loadBrandData();
    loadIndustryData();
    // eslint-disable-next-line
  }, [historyPriceModalInfo]);

  const searchBrand = async (name) => {
    const result = await brandSearch({ type: 1, name });
    if (result && result.objectList) {
      const resultOptions = result.objectList.map((item) => {
        return { label: item.name, value: item.id };
      });
      setBrandOptions(resultOptions);
    }
  };

  const onSearch = (value) => {
    const newFn = debounce(searchBrand, 300);
    newFn(value);
  };

  return (
    <Modal title={parseTitle()} open={historyPriceModalInfo.visible} onOk={onSubmit} onCancel={onCancel}>
      <Form {...layout} form={form}>
        <FormSelect
          label='品牌'
          name='brandId'
          options={brandOptions}
          config={{ showSearch: true, onSearch: onSearch }}
          formItemConfig={{
            rules: [{ required: true, message: '请选择品牌' }],
          }}
        />
        <FormTreeSelect
          label='行业'
          name='industryId'
          placeholder='请选择类目'
          treeData={industryOptions}
          formItemConfig={{
            rules: [{ required: true, message: '请选择类目' }],
          }}
          config={{
            fieldNames: { label: 'name', value: 'id', children: 'childList' },
          }}
        />
        <FormInputNumber
          label='场地成本'
          placeholder='请输入场地成本'
          name='cost'
          min={0}
          max={1000000}
          config={{
            precision: 2,
            style: { width: 314.66 },
          }}
          formItemConfig={{
            rules: [{ required: true, message: '请输入场地成本' }],
          }}
        />
        <FormInputNumber
          label='特殊报批费'
          placeholder='请输入特殊报批费'
          name='specialApprovalFee'
          min={0}
          max={1000000}
          config={{
            precision: 2,
            style: { width: 314.66 },
          }}
          formItemConfig={{
            rules: [{ required: false, message: '请输入特殊报批费' }],
          }}
        />
        <FormInputNumber
          label='报批费'
          placeholder='报批费'
          name='approvalFee'
          min={0}
          max={1000000}
          config={{
            precision: 2,
            style: { width: 314.66 },
          }}
          formItemConfig={{
            rules: [{ required: false, message: '请输入报批费' }],
          }}
        />
        <FormInputNumber
          label='销售额'
          placeholder='请输入销售额'
          name='price'
          min={0}
          max={1000000}
          config={{
            precision: 2,
            style: { width: 314.66 },
          }}
          formItemConfig={{
            rules: [{ required: true, message: '请输入销售额' }],
          }}
        />
        <Form.Item label='规格' required={true}>
          <Space style={{ display: 'flex', marginBottom: 8 }} align='center'>
            <Form.Item
              name={['spec', 'l']}
              style={{ display: 'inline-block', width: '150px' }}
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: '请输入长',
                },
              ]}
              noStyle
            >
              <Input placeholder='请输入长' style={{ width: '150px', marginRight: '5px' }} addonAfter='m' />
            </Form.Item>
            <div>✖️</div>
            <Form.Item
              name={['spec', 'w']}
              style={{ display: 'inline-block', width: '150px' }}
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: '请输入宽',
                },
              ]}
              noStyle
            >
              <Input placeholder='请输入宽' style={{ width: '150px', marginRight: '5px' }} addonAfter='m' />
            </Form.Item>
          </Space>
        </Form.Item>
        <Form.Item label='活动起止时间' name='time' rules={[{ required: true, message: '活动起止时间' }]}>
          <DynamicRangePicker value={historyPriceModalInfo.time} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default HistoryPriceModal;
