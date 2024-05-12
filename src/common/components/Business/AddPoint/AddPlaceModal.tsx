import { postPlaceCreate } from '@/common/api/place';
import { DynamicAddress, FormInModal } from '@/common/components';
import FormInput from '@/common/components/Form/FormInput';
import { Form, message } from 'antd';
import { FC } from 'react';
import CategorySelect from '@/common/business/CategorySelect';
import CitySelect from '@/common/business/CitySelect';

interface AddPlaceModalProps {
  visible?: boolean;
  zIndex?: number;
  onHidden?: () => void;
  onSuccess?: (result?: any) => void;
  channel?: string;
}

const { Item } = Form;

const layout = { labelCol: { span: 4 } };

// 新增场地弹窗
const AddPlaceModal: FC<AddPlaceModalProps> = ({ visible, channel, onHidden, zIndex, onSuccess }) => {
  const onSubmit = async (success: boolean, values: any) => {
    if (!channel) {
      message.warning('请根据对应模块填写channel');
      return;
    }
    const { area, address, ...restValues } = values;
    const [provinceId, cityId, districtId] = area || [];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { search, ...restAddress } = address;
    const inofo = {
      channel,
      ...restValues,
      address: {
        ...restAddress
      },
      area: {
        provinceId,
        cityId,
        districtId
      }
    };
    if (success) {
      const result = await postPlaceCreate(inofo);
      if (result) {
        message.success('新增成功');
        onSuccess?.(result);
      }
    }

  };
  return (
    <FormInModal
      visible={visible}
      onSubmit={onSubmit}
      onCancelSubmit={onHidden}
      title='新增场地'
      zIndex={zIndex}
    >
      <Form labelCol={layout.labelCol}>
        <FormInput name='placeName' label='场地名称' rules={[{ required: true, message: '场地名称必填' }]}/>
        <Item label='场地类型' name='placeCategoryId' rules={[{ required: true, message: '场地类型必选' }]}>
          <CategorySelect visible={visible} resoureType={0} multiple={false} />
        </Item>
        <Item label='所在城市' name='area' rules={[{ required: true, message: '省市区必选' }]}>
          <CitySelect fieldValue='id' multiple={false} placeholder='请选择省市区' />
        </Item>
        <Item name='address'>
          <DynamicAddress
            layout={layout}
            rules={[{ required: true, message: '高德项目必填' }]}
            selectRules={[{ required: true, message: '位置必选' }]}
            placeholder='请输入搜索位置'
          />
        </Item>
      </Form>
    </FormInModal>
  );
};
export default AddPlaceModal;
