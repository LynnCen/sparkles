import React, { useEffect, useState } from 'react';
import { useMethods } from '@lhb/hook';
import { Cascader, Form, message, Modal } from 'antd';
import FormInput from '@/common/components/Form/FormInput';
import FormSelect from '@/common/components/Form/FormSelect';
import { TaskBrandModalProps } from '../ts-config';
import { radarAddressList, submitRadarTask } from '@/common/api/radar';
import FormCascader from '@/common/components/Form/FormCascader';
import { recursionEach } from '@lhb/func';
import { refactorSelection } from '@/common/utils/ways';
import { brandList } from '@/common/api/brand';
import FormRadio from '@/common/components/Form/FormRadio';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const channelList = [{ label: '高德', value: 'GAODE' }];

const TaskBrandModal: React.FC<TaskBrandModalProps> = ({ brandInfo, setBrandInfo, onSearch }) => {
  const [form] = Form.useForm();
  const brandCode = Form.useWatch('brandCode', form);
  const selectOrInput = Form.useWatch('selectOrInput', form);
  const inputBrand = Form.useWatch('inputBrand', form);
  const [brandsOptions, setBrandsOptions] = useState<any[]>([]);
  const [addressOptions, setAddressOptions] = useState<any[]>([]);
  console.log('brandCode', brandCode);
  const { onSubmit, onCancel } = useMethods({
    onCancel() {
      setBrandInfo({ visible: false });
      onSearch();
    },
    onSubmit() {
      const bands:any = [];
      if (selectOrInput === 1) {
        brandCode.map((item, index) => {
          brandsOptions.map(v => {
            // console.log('v', v);
            if (v.value === item) {
              bands[index] = {
                brandCode: item,
                brandName: v.label
              };
            }
          });
        });
      } else if (selectOrInput === 2) {
        bands[0] = {
          brandName: inputBrand
        };
      }
      form.validateFields()
        .then((values: any) => {
          const params = {
            ...values,
            taskType: 'BRAND_TASK',
            categoryCodeList: null,
            brandList: bands,
            addressCodeList: values.addressCodeList
              .map((item) => item[1] || item[0])
              .filter(Boolean),
          };
          submitRadarTask(params).then(() => {
            onCancel();
            onSearch();
          });
          onCancel();
          onSearch();
        })
        .catch((errorInfo: any) => {
          onCancel();
          message.error(errorInfo.message);
          console.log('errorInfo', errorInfo);
        });
    },
  });

  const getBrandsList = async () => {
    const { objectList } = await brandList();
    // console.log('data', objectList);
    // if (Array.isArray(objectList)) {
    //   recursionEach(objectList, 'children', (item: any) => {
    //     item.label = item.name;
    //     item.value = item.name;
    //   });
    //   setBrandsOptions(objectList);
    // }
    setBrandsOptions(refactorSelection(objectList));
  };
  // brandList:[
  //  {
  //   brandCode:,
  //   brandName:
  //  },
  //  {
  //   brandCode:,
  //   brandName:
  //  }
  // ]

  const addressList = async () => {
    const data = await radarAddressList({ channel: 'GAODE' });
    if (Array.isArray(data)) {
      recursionEach(data, 'children', (item: any) => {
        item.label = item.name;
        item.value = item.code;
      });
      setAddressOptions(data);
    }
  };

  useEffect(() => {
    form.resetFields();
    getBrandsList();
    addressList();
  }, [brandInfo.visible]);

  return (
    <Modal
      title='创建指定品牌任务'
      destroyOnClose
      open={brandInfo.visible}
      getContainer={false}
      onCancel={onCancel}
      onOk={onSubmit}
      forceRender
    >
      <Form {...layout} form={form}>
        <FormInput
          label='任务名称'
          name='name'
          placeholder='请输入任务名称'
          rules={[{ required: true, message: '请输入任务名称' }]}
          maxLength={20}
        />
        <FormSelect
          label='渠道'
          name='channel'
          placeholder='请选择渠道'
          options={channelList}
          rules={[{ required: true, message: '请选择渠道' }]}
        />
        <FormCascader
          label='所属城市'
          name='addressCodeList'
          placeholder='选择所属城市'
          options={addressOptions}
          rules={[{ required: true, message: '请选择所属城市' }]}
          config={{ multiple: true, showCheckedStrategy: Cascader.SHOW_CHILD }}
        />
        <FormRadio
          name='selectOrInput'
          label='品牌选择切换'
          initialValue={1}
          rules={[{ required: true }]}
          options={[
            { label: '多选框', value: 1 },
            { label: '输入框', value: 2 },
          ]}
        />
        {selectOrInput === 1 && <FormSelect
          label='品牌名称'
          name='brandCode'
          placeholder='请选择品牌'
          allowClear
          options={brandsOptions}
          mode={'multiple'}
          rules={[{ required: true, message: '请选择品牌' }]}
        />}
        {selectOrInput === 2 && <FormInput
          label='品牌名称'
          name='inputBrand'
          placeholder='请输入单一品牌名称'
          rules={[{ required: true, message: '请输入单一品牌名称' }]}
          maxLength={20}
        />}
      </Form>
    </Modal>
  );
};

export default TaskBrandModal;
