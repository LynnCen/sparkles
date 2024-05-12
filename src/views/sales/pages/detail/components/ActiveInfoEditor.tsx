// 基本信息
import { FC, useEffect, useRef, useState } from 'react';
import { contrast, deepCopy, getKeysFromObjectArray, isNotEmpty, parseArrayToString } from '@lhb/func';
import { showInvalidFieldMsg } from '@/common/utils/ways';
import { postSaleOrderUpdate } from '@/common/api/purchase';
import { useIndusties } from '@/common/hook';
import dayjs from 'dayjs';
import styles from '../entry.module.less';
import { Col, Divider, Row, Typography, Form, Button, message, TreeSelect } from 'antd';
import { Description, } from '@/common/components';
import FormInput from 'src/common/components/Form/FormInput';
import FormResourceBrand from 'src/common/components/FormBusiness/FormResourceBrand';
// import FormCascaderIndustry from 'src/common/components/FormBusiness/FormCascaderIndustry';
import FormDictionarySelect from 'src/common/components/Form/FormDictionarySelect';
import FormSizeInput from 'src/common/components/Form/FormSizeInput';
import FormDatePicker from 'src/common/components/Form/FormDatePicker';
import FormUpload from '@/common/components/Form/FormUpload';
import FormTreeSelect from '@/common/components/Form/FormTreeSelect';

const layout = {
  // labelCol: { span: 6 },
  // wrapperCol: { span: 16 },
};

// 处理日期为 年月日
const parseDate = (date) => {
  return isNotEmpty(date) ? dayjs(date).format('YYYY-MM-DD') : null;
};

// 处理日期为 dayjs
const encodeDate = (date) => {
  return isNotEmpty(date) ? dayjs(date) : null;
};


interface ActiveInfoEditorProps {
  id: number, // 销售单id
  info?: any, // 销售单信息
  complete?: Function, // 保存后的回调函数
}

const Component:FC<ActiveInfoEditorProps> = ({ id, info = {}, complete }) => {
  const {
    displayDates = [],
  } = info;


  const options = {
    true_or_false: [
      { value: 1, label: '是' },
      { value: 0, label: '否' },
    ],
    industries: useIndusties(),
  };

  const [form] = Form.useForm();
  const [requesting, setRequesting] = useState(false);

  const brandRef: any = useRef();

  useEffect(() => {
    const brands = contrast(info, 'brands', []);
    const snapshot = contrast(info, 'snapshot', {});

    form.setFieldsValue({
      brandIds: getKeysFromObjectArray(brands, 'id'),
      title: contrast(info, 'title'),
      displayDates: contrast(info, 'displayDates', []),
      materialIds: getKeysFromObjectArray(contrast(info, 'materials', []), 'id'),
      promotionWayIds: getKeysFromObjectArray(contrast(info, 'promotionWays', []), 'id'),
      industryIds: contrast(info, 'industries', []).map(item => ({ value: item.id, label: item.name })),
      promotionPurposeIds: getKeysFromObjectArray(contrast(info, 'promotionPurposes', []), 'id'),
      licenses: contrast(info, 'licenses', []).map((item, index) => ({ name: `图片${index + 1}.jpg`, url: item })),
      product: contrast(info, 'product'),

      entranceDate: encodeDate(contrast(snapshot, 'entranceDate')),
      withdrawDate: encodeDate(contrast(snapshot, 'withdrawDate')),
      useableSize: [contrast(snapshot, 'usableLength'), contrast(snapshot, 'usableWidth'), contrast(snapshot, 'usableHeight')], // 活动面积/使用尺寸
      size: [contrast(snapshot, 'length'), contrast(snapshot, 'width'), contrast(snapshot, 'height')], // 展具尺寸
      graph: contrast(snapshot, 'graph', []).map((item, index) => ({ name: `图片${index + 1}.jpg`, url: item })),
    });

    // 品牌联想输入框回填
    brandRef.current.setOptions(brands);

  }, [info]);

  // 确定
  const confirm = () => {
    form.validateFields().then((values) => {
      values = deepCopy(values);
      const { size, useableSize, entranceDate, withdrawDate } = values;
      const params = Object.assign({
        id,
        ...values,
        industryIds: getKeysFromObjectArray(contrast(values, 'industryIds', []), 'value'),
        entranceDate: parseDate(entranceDate),
        withdrawDate: parseDate(withdrawDate),
        graph: contrast(values, 'graph', []).map(item => item.url),
        licenses: contrast(values, 'licenses', []).map(item => item.url),

        length: contrast(values, 'size[0]')
      });

      if (Array.isArray(size)) {
        Object.assign(params, { length: size[0], width: size[1], height: size[2] });
      }
      if (Array.isArray(useableSize)) {
        Object.assign(params, { usableLength: useableSize[0], usableWidth: useableSize[1], usableHeight: useableSize[2] });
      }
      console.log('params', params);
      setRequesting(true);
      postSaleOrderUpdate(params).then(() => {
        // dispatchNavigate('/purchase');
        message.success('编辑保存成功');
        complete && complete();
      }).finally(() => {
        setRequesting(false);
      });
    }).catch((err) => {
      if (err && Array.isArray(err.errorFields) && err.errorFields.length && err.errorFields[0].errors) {
        showInvalidFieldMsg(err.errorFields, 1);
      }
    });
  };

  return (
    <>
      <Typography.Title level={5}>活动信息</Typography.Title>
      <Form {...layout} labelAlign='left' form={form} colon={true} className={styles['active-info-editor-form']} >
        <Row gutter={20}>
          <Col span={12}>
            <FormInput
              label='活动名称'
              name='title'
              maxLength={50}
              allowClear
              rules={[{ required: true, whitespace: true, message: '请输入活动名称' }]}
              placeholder='请输入活动名称'
            />
          </Col>
          <Col span={12}>
            {/* <FormCascaderIndustry
              label='所属行业'
              name='industryIds'
              allowClear={true}
              config={{
                multiple: true,
                showCheckedStrategy: Cascader.SHOW_CHILD,
                showSearch: true,
                maxTagCount: 'responsive'
              }}
              rules={[{ required: true, message: '请选择所属行业' }]}
              placeholder='选择所属行业'
            /> */}

            <FormTreeSelect
              label='所属行业'
              name='industryIds'
              treeData={options.industries}
              config={{
                fieldNames: { label: 'name', value: 'id', children: 'children' },
                multiple: true,
                allowClear: true,
                treeCheckable: true,
                treeCheckStrictly: true,
                showCheckedStrategy: TreeSelect.SHOW_ALL,
                maxTagCount: 'responsive'
              }}
              rules={[{ required: true, message: '请选择所属行业' }]}
              placeholder='选择所属行业'
            />

          </Col>
          <Col span={12}>
            <FormInput
              label='产品名称'
              name='product'
              maxLength={50}
              allowClear
              // rules={[{ required: true, whitespace: true, message: '请输入产品名称' }]}
              placeholder='请输入产品名称'
            />
          </Col>
          <Col span={12}>
            <FormResourceBrand
              name='brandIds'
              label='品牌'
              formRef={brandRef}
              config={{
                mode: 'multiple',
                immediateOnce: false, // 编辑时并且有选此数据时，不再立刻触发查询
                maxTagCount: 'responsive',
              }}

              rules={[{ required: true, message: '请选择品牌' }]}
            />
          </Col>
          <Col span={12}>
            <FormDictionarySelect
              name='promotionWayIds'
              label='推广形式'
              config={{ type: 'promotionWay' }}
              rules={[{ required: true, message: '请选择推广形式' }]}
              placeholder='请选择推广形式'
            />
          </Col>
          <Col span={12}>
            <FormDictionarySelect
              name='promotionPurposeIds'
              label='推广目的'
              config={{ type: 'promotionPurpose' }}
              rules={[{ required: true, message: '请选择推广目的' }]}
              placeholder='请选择推广目的'
            />
          </Col>
          <Col span={12}>
            <Description border label='活动日期'>{parseArrayToString(displayDates, ',') || '-'}</Description>
          </Col>

          <Col span={12}>
            {/* [usableLength, usableWidth, usableHeight] */}
            <FormSizeInput
              label='活动面积'
              name='useableSize'
              config={{ addonAfter: 'm' }}
              firstConfig={{ placeholder: '长' }}
              middleConfig={{ placeholder: '宽' }}
              lastConfig={{ placeholder: '高' }}
            />
          </Col>

          <Col span={12}>
            <FormDatePicker label='进场日期' name='entranceDate' placeholder='请选择进场日期' />
          </Col>
          <Col span={12}>
            <FormDatePicker label='撤场日期' name='withdrawDate' placeholder='请选择撤场日期' />
          </Col>
        </Row>

        <Divider style={{ margin: '16px 0', marginTop: 0, background: '#EEEEEE' }}/>

        <Row gutter={20}>
          <Col span={12}>
            <FormSizeInput
              label='展具尺寸'
              name='size'
              config={{ addonAfter: 'm' }}
              firstConfig={{ placeholder: '长' }}
              middleConfig={{ placeholder: '宽' }}
              lastConfig={{ placeholder: '高' }}
            />
          </Col>
          <Col span={12}>
            <FormDictionarySelect
              name='materialIds'
              label='物料类型'
              config={{ type: 'material' }}
              // rules={[{ required: true, message: '请选择物料类型' }]}
              placeholder='请选择物料类型'
            />
          </Col>
          <Col span={12}>
            <FormUpload
              formItemConfig={{
                help: '仅可上传 .png/.jpg/.jpeg/.bmp/.gif 文件， 不超过 50 MB， 最多上传 10 个文件'
              }}
              label='效果图'
              name='graph'
              config={{
                multiple: true,
                size: 50,
                maxCount: 10
              }}
              // rules={[{ required: true, message: '请上传效果图' }]}
            />
          </Col>
          <Col span={12}>
            <FormUpload
              formItemConfig={{
                help: '仅可上传 .png/.jpg/.jpeg/.bmp/.gif 文件， 不超过 50 MB， 最多上传 10 个文件'
              }}
              label='经营许可证品牌授权书'
              name='licenses'
              config={{
                multiple: true,
                size: 50,
                maxCount: 10
              }}
              // rules={[{ required: true, message: '请上传经营许可证品牌授权书' }]}
            />
          </Col>
        </Row>

        <div className={styles['btn-wrapper']}>
          <Button type='primary' disabled={requesting} onClick={confirm}>确定</Button>
        </div>
      </Form>

    </>);
};

export default Component;
