import { FC, useEffect, useRef, useState } from 'react';
import styles from './index.module.less';
import { Col, Form, message, Modal, Row } from 'antd';
import { useMethods } from '@lhb/hook';
import V2Form from '@/common/components/Form/V2Form';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormDatePicker from '@/common/components/Form/V2FormDatePicker/V2FormDatePicker';
import V2FormRadio from '@/common/components/Form/V2FormRadio/V2FormRadio';
import V2FormRangePicker from '@/common/components/Form/V2FormRangePicker/V2FormRangePicker';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import FormResourceBrand from '@/common/components/FormBusiness/FormResourceBrand';
import FormMergeRules from '@/common/components/Form/FormMergeRules/FormMergeRules';
import { postStoreCreate, postStoreUpdate, getStoreSelection } from '@/common/api/passenger-flow';
import dayjs from 'dayjs';
import { contrast, deepCopy } from '@lhb/func';
import { refactorSelection } from '@/common/utils/ways';
import FormSelectSpot from '@/common/components/FormBusiness/FormSelectSpot';
const DateOptions = [
  { label: '指定日期', value: 0 },
  { label: '永久经营', value: 1 },
];
const ShopModal: FC<any> = ({
  updateData,
  visible,
  setVisible,
  onSearch
}) => {
  const [form] = Form.useForm();
  const spotRef: any = useRef();
  const brandRef: any = useRef();
  const isPerpetual = Form.useWatch('isPerpetual', form);
  const [storeTypes, setStoreTypes] = useState([]);
  const methods = useMethods({
    getStoreTypes() {
      getStoreSelection().then((res) => {
        setStoreTypes(res.storeTypes);
      });
    },
    backfill(updateData) { // 回填表单联想查询项
      // 品牌联想输入框回填
      if (updateData.spotId) {
        spotRef.current.setOptions([{
          categoryName: updateData.spotCategoryName,
          id: updateData.spotId,
          longName: updateData.spotName
        }]);
      }
      // 品牌联想输入框回填
      if (updateData.brandId) {
        brandRef.current.setOptions([{
          id: updateData.brandId,
          name: updateData.brandName
        }]);
      }
    },
    submit() {
      form.validateFields().then((res) => {
        const params = deepCopy(res);
        // 只有在指定日期时，需要从 date 里面拿
        // 如果是永久时间， 就直接取 startDate字段即可
        if (!params.isPerpetual) {
          params.startDate = dayjs(params.date[0]).format('YYYY-MM-DD');
          params.endDate = dayjs(params.date[1]).format('YYYY-MM-DD');
        }
        delete params.date;
        updateData && (params.id = updateData.id);
        params.startAt = dayjs(params.startAt).format('HH:mm:ss');
        params.endAt = dayjs(params.endAt).format('HH:mm:ss');
        const func = updateData ? postStoreUpdate : postStoreCreate;
        func(params).then(() => {
          onSearch();
          message.success(`${updateData ? '编辑' : '添加'}成功`);
          setVisible(false);
        });
      });
    }
  });
  useEffect(() => {
    if (visible) {
      const params: any = {
        name: contrast(updateData, 'name', undefined),
        isPerpetual: contrast(updateData, 'isPerpetual', 0),
        brandId: contrast(updateData, 'brandId', undefined),
        spotId: contrast(updateData, 'spotId', undefined),
        type: contrast(updateData, 'type', undefined),
        date: [], // isPerpetual === 1
      };
      if (updateData) { // 对联想查询组件进行回填
        methods.backfill(updateData);
        if (!params.isPerpetual) { // isPerpetual === 0时
          params.date = [dayjs(updateData.startDate), dayjs(updateData.endDate)];
          params.startDate = undefined;
        } else {
          params.startDate = dayjs(updateData.startDate);
        }
        if (updateData.startAt) {
          params.startAt = dayjs(updateData.startAt, 'HH:mm:ss');
        }
        if (updateData.endAt) {
          params.endAt = dayjs(updateData.endAt, 'HH:mm:ss');
        }
      }
      form.setFieldsValue(params);
      if (!storeTypes.length) {
        methods.getStoreTypes();
      }
    }
  }, [visible]);
  return (
    <Modal
      title={`${updateData ? '编辑' : '新增'}门店`}
      width={640}
      open={visible}
      onOk={methods.submit}
      maskClosable={false}
      className={styles.shopSearch}
      onCancel={() => setVisible(false)}>
      <V2Form form={form} colon={false}>
        <Row gutter={16}>
          <Col span={12}>
            <V2FormInput
              label='门店名称'
              name='name'
              maxLength={20}
              required/>
          </Col>
          <Col span={12}>
            <FormSelectSpot
              label='关联点位'
              needAddableNotFoundNode
              spotRef={spotRef}
              config={{
                immediateOnce: !updateData?.spotId // 编辑时并且有选此数据时，不再立刻触发查询
              }}
              extraParams={{
                examineStatusList: [1, 2, 4] // 审核状态
              }}
              form={form}
              allowClear
              channel='PASSENGER_FLOW' // 代表客流宝
              rules={[{ required: true, message: '输入点位或场地进行查询' }]}
              name='spotId'
            />
          </Col>
          <Col span={12}>
            <FormResourceBrand
              label='品牌名称'
              allowClear
              formRef={brandRef}
              config={{
                immediateOnce: !updateData?.brandId // 编辑时并且有选此数据时，不再立刻触发查询
              }}
              name='brandId'/>
          </Col>
          <Col span={12}>
            <FormMergeRules
              label='日营业时段'
              dependencies={['startAt', 'endAt']}
              required
              full
              rules={[{
                validator() {
                  const startAt = form.getFieldValue('startAt');
                  const endAt = form.getFieldValue('endAt');
                  if (!startAt || !endAt) {
                    return Promise.reject(new Error('日营业时段必填'));
                  }
                  return Promise.resolve();
                }
              }]}>
              <V2FormDatePicker
                config={{
                  picker: 'time'
                }}
                formItemConfig={{
                  noStyle: true
                }}
                placeholder='开始时段'
                name='startAt' />
              至
              <V2FormDatePicker
                config={{
                  picker: 'time'
                }}
                formItemConfig={{
                  noStyle: true
                }}
                placeholder='结束时段'
                name='endAt' />
            </FormMergeRules>
          </Col>
          <Col span={12}>
            <V2FormSelect label='店铺类型' name='type' options={refactorSelection(storeTypes)} allowClear />
          </Col>
          <Col span={12}>
            <V2FormRadio
              name='isPerpetual'
              label='经营日期'
              required
              options={DateOptions}
              formItemConfig={{
                style: {
                  marginBottom: '6px'
                }
              }}
            />
            <V2FormRangePicker
              label='&nbsp;'
              name='date'
              formItemConfig={{
                className: styles.noColon,
                hidden: isPerpetual,
              }}
              rules={[{ required: !isPerpetual, message: '请选择日期' }]}
            />
            <V2FormDatePicker
              label='&nbsp;'
              name='startDate'
              formItemConfig={{
                className: styles.noColon,
                hidden: !isPerpetual,
              }}
              rules={[{ required: isPerpetual, message: '请选择开始日期' }]}
              placeholder='请选择开始日期'
            />
          </Col>
        </Row>
      </V2Form>
    </Modal>
  );
};

export default ShopModal;
