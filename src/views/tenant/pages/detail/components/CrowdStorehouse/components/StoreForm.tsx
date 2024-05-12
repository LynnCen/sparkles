import { FC, useEffect, useState } from 'react';
import { Modal, Form } from 'antd';
import { useMethods } from '@lhb/hook';
import { StoreAttribute } from '../../../ts-config';
import { storeCreate, storeUpdate, storeDetail } from '@/common/api/flow';
import { dictionaryTypeItems } from '@/common/api/common';
import { SelectionOptionItem } from '@/common/components/Select/ts-config';
import { contrast } from '@lhb/func';
import dayjs from 'dayjs';
import FormSelect from '@/common/components/Form/FormSelect';
import FormInput from '@/common/components/Form/FormInput';
import FormRangePicker from '@/common/components/Form/FormRangePicker';
import FormTimeRangePicker from '@/common/components/Form/FormTimeRangePicker';
import FormCascaderIndustry from '@/common/components/FormBusiness/FormCascaderIndustry';
import FormBrand from '@/common/components/FormBusiness/FormBrand';
import FormPlaces from '@/common/components/FormBusiness/FormPlaces';
import FormSpots from '@/common/components/FormBusiness/FormSpots';

interface IProps {
  modalData: { [propname: string]: any };
  modalHandle: (status: boolean) => void;
  loadData: () => void;
}

const StoreForm: FC<IProps> = ({ modalData, modalHandle, loadData }) => {
  const [form] = Form.useForm();
  const { visible, id, tenantId } = modalData;
  const storeAttributeOptions = [
    { label: '正铺', value: StoreAttribute.DemoticStore },
    { label: '快闪店', value: StoreAttribute.TemporaryStore },
    { label: '慢闪店', value: StoreAttribute.LongTermStore },
  ];
  const [storeAttributeVal, setStoreAttributeVal] = useState(1);
  const [promotionOptions, setPromotionOptions] = useState<{ label: string; value: number }[]>([]);
  const [brandData, setBrandData] = useState<SelectionOptionItem[]>([]);

  const [refreshKeyword, setRefreshKeyword] = useState<any>();
  const [selectedPlaceId, setSelectedPlaceId] = useState<any>();
  const [spotPlaceHolder, setSpotPlaceHolder] = useState<any>('请输入点位名称');
  const [isImmediateOnce, setIsImmediateOnce] = useState<boolean>(false);

  // methods
  const {
    onPlaceChange,
    showPromotion,
    typeChange,
    getPromotionSelection,
    submitHandle,
    editAssignment,
    // customBoothOption,
    closeHandle,
    validateEndDate,
  } = useMethods({
    onPlaceChange: (option) => {
      form.setFieldsValue({ 'resourceSpotId': undefined });
      option ? setSelectedPlaceId(option.key) : setSelectedPlaceId(-1);
    },
    editAssignment: async () => {
      const detail: any = await storeDetail({ id });
      const { type, startDate, endDate, promotionPurposes, brand, boothId, boothName, startAt, endAt } = detail;
      const formData: any = {
        name: contrast(detail, 'name'),
        type: contrast(detail, 'type'),
        number: contrast(detail, 'number'),
        businessDate: [startDate ? dayjs(startDate) : '', endDate ? dayjs(endDate) : ''], // 营业日期
        businessTime: startAt && endAt ? [dayjs(startAt, 'HH:mm'), dayjs(endAt, 'HH:mm')] : [], // 营业时间
        industryIds: contrast(detail, 'industryIds', []),
        brandId: contrast(brand, 'id'),
        product: contrast(detail, 'product', ''),
        promotionPurposeIds: Array.isArray(promotionPurposes) ? promotionPurposes.map((item) => item.id) : [],
        boothId: boothId ? contrast(detail, 'boothId') : boothName,
        resourcePlaceId: contrast(detail, 'resourcePlaceId'),
        resourcePlaceName: contrast(detail, 'resourcePlaceName'),
        resourceSpotId: contrast(detail, 'resourceSpotId'),
      };
      form.setFieldsValue(formData);
      brand && setBrandData([brand]);
      formData.resourcePlaceName ? setRefreshKeyword(formData.resourcePlaceName) : setIsImmediateOnce(true);
      setStoreAttributeVal(type);
      boothName && setSpotPlaceHolder(boothName);
      setSelectedPlaceId(formData.resourcePlaceId);
      // (boothId || boothName) && setSelectedBooth([{
      //   id: boothId ? contrast(detail, 'boothId') : boothName,
      //   name: boothName || '未知的展位',
      //   address: boothAddress,
      //   provinceId,
      //   cityId,
      //   districtId
      // }]);
    },
    typeChange: (value: number) => {
      setStoreAttributeVal(value);
    },
    showPromotion: () => {
      if (storeAttributeVal === 2 || storeAttributeVal === 3) {
        return (
          <>
            <FormInput
              label='推广产品'
              name='product'
              maxLength={20}
              placeholder='推广产品，最多20个字'
              rules={[{ required: true, message: '请填写推广产品' }]}
            />
            <FormSelect
              label='推广目的'
              name='promotionPurposeIds'
              rules={[{ required: true, message: '请选择推广目的' }]}
              mode='multiple'
              options={promotionOptions}
            />
          </>
        );
      }
      return null;
    },
    getPromotionSelection: async () => {
      const data = await dictionaryTypeItems({ encode: 'promotionPurpose' });
      if (!(Array.isArray(data) && data.length)) return;
      const options = data.map((optionItem: Record<string, any>) => ({
        label: optionItem.name,
        value: optionItem.id,
      }));
      setPromotionOptions(options);
    },
    submitHandle: () => {
      form
        .validateFields()
        .then(async (values: any) => {
          const requestHandle = id ? storeUpdate : storeCreate;
          // const { boothId } = values;
          // 兼容历史数据，没有endDate的数据
          if (!validateEndDate(values)) return;
          const params: any = {
            tenantId,
            name: contrast(values, 'name', ''),
            type: contrast(values, 'type', 1),
            number: contrast(values, 'number', ''),
            startDate: dayjs(values.businessDate[0]).format('YYYY-MM-DD'),
            endDate: dayjs(values.businessDate[1]).format('YYYY-MM-DD'),
            startAt: dayjs(values.businessTime[0]).format('HH:mm'),
            endAt: dayjs(values.businessTime[1]).format('HH:mm'),
            industryIds: contrast(values, 'industryIds', []),
            brandId: contrast(values, 'brandId', ''),
            resourcePlaceId: contrast(values, 'resourcePlaceId', ''),
            resourceSpotId: contrast(values, 'resourceSpotId', ''),
          };
          id && (params.id = id);
          if (storeAttributeVal === 2 || storeAttributeVal === 3) {
            params.product = contrast(values, 'product', '');
            params.promotionPurposeIds = contrast(values, 'promotionPurposeIds', []);
          }
          await requestHandle(params);
          loadData();
          closeHandle();
        })
        .catch(({ values }) => {
          validateEndDate(values);
        });
    },
    validateEndDate: (values: any) => {
      // 兼容历史数据，没有endDate的数据
      if (!values?.businessDate?.[1]) {
        form.setFields([
          {
            name: ['businessDate'],
            errors: ['请填写结束日期'],
          },
        ]);
        return false;
      }
      return true;
    },
    customBoothOption(option: Record<string, any>) {
      const { name, address } = option;
      return (
        <>
          <div>{name}</div>
          <div className='color-help fn-12'>地址：{address}</div>
        </>
      );
    },
    closeHandle: () => {
      setStoreAttributeVal(1);
      setBrandData([]);
      // setSelectedBooth([]);
      modalHandle(false);
      setIsImmediateOnce(false);
    },
  });

  useEffect(() => {
    // 推广目的
    if (!promotionOptions.length) {
      getPromotionSelection();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 编辑时
  useEffect(() => {
    if (!visible) return;
    if (id) {
      editAssignment();
      return;
    }
    setSpotPlaceHolder('请输入点位名称');
    setIsImmediateOnce(true);
    // id ? editAssignment() : setSpotPlaceHolder('请输入点位名称');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, visible]);

  // useMemo

  return (
    <Modal
      title={id ? '编辑店铺' : '新增店铺'}
      open={visible}
      width={500}
      destroyOnClose={true}
      maskClosable={false}
      keyboard={false}
      onOk={submitHandle}
      onCancel={closeHandle}
    >
      <Form form={form} preserve={false} colon={false} labelCol={{ span: 5 }} name='form'>
        <FormSelect
          label='店铺属性'
          name='type'
          rules={[{ required: true, message: '请选择' }]}
          options={storeAttributeOptions}
          config={{
            onChange: typeChange,
          }}
        />
        <FormInput
          label='店铺名称'
          name='name'
          maxLength={30}
          placeholder='店铺名称，最多30个字'
          rules={[{ required: true, message: '请填写店铺名称' }]}
        />
        <FormInput
          label='店铺编号'
          name='number'
          maxLength={7}
          placeholder='店铺编号，最多7个字'
          rules={[{ required: true, message: '请填写店铺编号' }]}
        />
        <FormBrand
          form={form}
          label='店铺品牌'
          name='brandId'
          placeholder='输入关键词搜索'
          isAddable
          rules={[{ required: true, message: '请选择店铺品牌' }]}
          config={{
            allowClear: true,
            immediateOnce: false,
            setListData: brandData,
            // mode: 'multiple',
            maxTagCount: 1,
          }}
        />
        <FormCascaderIndustry
          label='所属行业'
          name='industryIds'
          placeholder='选择所属行业'
          rules={[{ required: true, message: '请选择所属行业' }]}
        />
        {showPromotion()}
        <FormPlaces
          label='场地名称'
          name='resourcePlaceId'
          form={form}
          allowClear={true}
          rules={[{ required: true, message: '请输入场地名称' }]}
          placeholder='请输入场地名称'
          enableNotFoundNode={true}
          refreshKeyword={refreshKeyword}
          // {...(editTask.id && {
          //   keyword: editTask.demandBrandName,
          // })}
          changeHandle={(_, option) => {
            onPlaceChange(option);
          }}
          config={{
            getPopupContainer: (node) => node.parentNode
          }}
          immediateOnce={isImmediateOnce}
        />
        <FormSpots
          label='点位名称'
          name='resourceSpotId'
          form={form}
          allowClear={true}
          rules={[{ required: true, message: '请输入场地名称' }]}
          placeholder={spotPlaceHolder}
          enableNotFoundNode={true}
          selectedPlaceId={selectedPlaceId}
          config={{
            getPopupContainer: (node) => node.parentNode,
          }}
        />
        <FormRangePicker
          label='营业日期'
          name='businessDate'
          rules={[{ required: true, message: '请选择营业日期' }]}
          config={{
            format: 'YYYY-MM-DD',
            style: {
              width: '100%',
            },
          }}
        />
        <FormTimeRangePicker
          label='营业时间'
          name='businessTime'
          rules={[{ required: true, message: '请选择营业时间' }]}
          config={{
            style: {
              width: '100%',
            },
          }}
        />
      </Form>
    </Modal>
  );
};

export default StoreForm;
