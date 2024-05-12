import { brandList } from '@/common/api/brand';
import FormInput from '@/common/components/Form/FormInput';
import FormSelect from '@/common/components/Form/FormSelect';
import { useMethods } from '@lhb/hook';
import { Form, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { FloorInfoModalProps } from '../../ts-config';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

// B5、LG5、B4、LG4、B3、LG3、B2、LG2、B1、LG1、LG、M、MU、G、GF、RG、UG、1F~50F
const floorOptions = [
  { label: 'B5', value: 'B5' },
  { label: 'LG5', value: 'LG5' },
  { label: 'B4', value: 'B4' },
  { label: 'LG4', value: 'LG4' },
  { label: 'B3', value: 'B3' },
  { label: 'LG3', value: 'LG3' },
  { label: 'B2', value: 'B2' },
  { label: 'LG2', value: 'LG2' },
  { label: 'B1', value: 'B1' },
  { label: 'LG1', value: 'LG1' },
  { label: 'LG', value: 'LG' },
  { label: 'M', value: 'M' },
  { label: 'MU', value: 'MU' },
  { label: 'G', value: 'G' },
  { label: 'GF', value: 'GF' },
  { label: 'RG', value: 'RG' },
  { label: 'UG', value: 'UG' },
];

for (let i = 0; i < 51; i++) {
  const floor = i + 'F';
  floorOptions.push({ label: floor, value: floor });
}

const typeOptions = [
  { label: '主力店', value: '主力店' },
  { label: '次主力店', value: '次主力店' },
  { label: '男装', value: '男装' },
  { label: '女装', value: '女装' },
  { label: '儿童业态', value: '儿童业态' },
  { label: '餐饮业态', value: '餐饮业态' },
  { label: '超市', value: '超市' },
];

const FloorInfoModal: React.FC<FloorInfoModalProps> = ({
  floorInfoModalInfo,
  setFloorInfoModalInfo,
  data,
  onChange,
}) => {
  const [form] = Form.useForm();
  const [brandOptions, setBrandOptions] = useState<any>([]);
  const { parseTitle, onCancel, loadBrandData } = useMethods({
    parseTitle() {
      return floorInfoModalInfo.id ? '编辑楼层信息' : '新增楼层信息';
    },
    onCancel() {
      setFloorInfoModalInfo({ visible: false });
      form.resetFields();
    },
    loadBrandData: async () => {
      const result = await brandList({ type: 1 });
      if (result && result.objectList) {
        const resultOptions = result.objectList.map((item) => {
          return { label: item.name, value: item.name };
        });
        setBrandOptions(resultOptions);
      }
    },
  });
  // 确定
  const onSubmit = () => {
    form.validateFields().then((values) => {
      console.log(floorInfoModalInfo.id);
      if (floorInfoModalInfo.id) {
        data.forEach((element) => {
          if (element.id === floorInfoModalInfo.id) {
            console.log(111);
            element.floor = values.floor;
            element.name = values.name;
            element.brandName = values.brandName;
            element.industryName = values.industryName;
            element.type = values.type;
          }
        });
        onChange([].concat(data));
        onCancel();
      } else {
        values.id = Math.random();
        data.push(values);
        onChange([].concat(data));
        onCancel();
      }
    });
  };

  useEffect(() => {
    if (floorInfoModalInfo.id) {
      form.setFieldsValue(floorInfoModalInfo);
    }
    loadBrandData();
    // eslint-disable-next-line
  }, [floorInfoModalInfo]);

  return (
    <Modal title={parseTitle()} open={floorInfoModalInfo.visible} onOk={onSubmit} onCancel={onCancel}>
      <Form {...layout} form={form}>
        <FormSelect label='楼层' name='floor' options={floorOptions} />
        <FormInput
          label='店铺名称'
          name='name'
          maxLength={32}
          rules={[{ required: true, message: '请输入店铺名称' }]}
          placeholder='请输入店铺名称'
        />

        <FormSelect label='品牌名称' name='labelName' options={brandOptions} config={{ showSearch: true }} />
        <FormInput
          label='所属行业'
          name='industryName'
          maxLength={32}
          placeholder='请输入所属行业'
        />
        <FormSelect label='店铺类型' name='type' options={typeOptions} />
      </Form>
    </Modal>
  );
};
export default FloorInfoModal;
