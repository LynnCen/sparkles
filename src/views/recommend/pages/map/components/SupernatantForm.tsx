import { FC, useEffect, useState } from 'react';
import { Form, Button, Space, Modal, Row, Col } from 'antd';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import {
  shopRecommendSelection,
  shopRecommendGenerate,
  shopRecommendIndustrySelection
} from '@/common/api/recommend';
import cs from 'classnames';
import styles from '../entry.module.less';
import FormCascader from '@/common/components/Form/FormCascader';
import FormSelect from '@/common/components/Form/FormSelect';
import FormInputNumber from '@/common/components/Form/FormInputNumber';
import FormInput from '@/common/components/Form/FormInput';
import FormRange from '@/common/components/Form/FormRange';
import TemporaryFormItems from './TemporaryFormItems';

const { confirm } = Modal;
const SupernatantForm: FC<any> = ({
  searchData,
  setSearchData
}) => {
  const [form] = Form.useForm();
  const [selectionData, setSelectionData] = useState<any>({
    industry: [],
    shopCategory: [],
    scope: [],
    consumptionLevel: []
  });
  const [loading, setLoading] = useState(false);
  // const [state, setState] = useState<>();
  const { visibleForm, pcdIds } = searchData;
  useEffect(() => {
    getSelection();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getSelection = async () => {
    // const params = {
    //   keys: ['industry', 'shopCategory', 'scope', 'consumptionLevel']
    // };
    const res = await shopRecommendSelection({});
    const industryList = await shopRecommendIndustrySelection({});
    res.industry = industryList;
    setSelectionData(res);
  };

  const cancelHandle = () => {
    setSearchData((state) => ({ ...state, visibleForm: false }));
    form.resetFields();
  };

  const resetHandle = () => {
    form.resetFields();
  };

  const submitHandle = (values: any) => {
    const {
      competitiveBrand,
      consumptionLevel,
      housePriceMax,
      housePriceMin,
      industryEcology,
      // industryEcology: [Array(2)]
      industryEcologyNum,
      preferIndustry,
      scope,
      shopCategory,
      synergyBrand,
      unitPriceMax,
      unitPriceMin,
    } = values;
    const params: any = {
      provinceId: pcdIds[0],
      cityId: pcdIds[1],
      shopCategory,
      scope,
      industryEcologyNum,
      unitPriceMin,
      unitPriceMax,
      housePriceMin,
      housePriceMax,
      consumptionLevel,
      synergyBrand,
      competitiveBrand,
      preferIndustry: preferIndustry[preferIndustry.length - 1], // 意向行业
      industryEcology: industryEcology.map((item: Array<any>) => item[item.length - 1])
    };
    if (pcdIds[2]) { // 选择了区
      params.districtId = pcdIds[2];
    }
    setLoading(true);
    shopRecommendGenerate(params).then(() => {
      setLoading(false);
      confirm({
        title: '提示',
        maskClosable: false,
        keyboard: false,
        content: '推荐计算中，请耐心等待，您也可关闭页面，后期登录推荐报告查询页面查询本次推荐结果',
        okText: '确定',
        onOk() {
          // 跳转
          dispatchNavigate('/recommend/report');
        },
        onCancel() {
          dispatchNavigate('/recommend/report');
        }
      });
    });
  };

  return (
    <Form
      form={form}
      onFinish={submitHandle}
      className={cs(styles.supernatantCon, visibleForm ? '' : 'hide')}>
      <FormCascader
        label='意向开店行业'
        name='preferIndustry'
        config={{
          // multiple: true,
          maxTagCount: 'responsive',
          fieldNames: {
            label: 'name',
            value: 'code'
          }
        }}
        options={selectionData.industry}
        rules={[
          { required: true, message: '请选择意向开店行业' },
        ]}/>
      <FormSelect
        label='意向店铺类型'
        name='shopCategory'
        options={selectionData.shopCategory	}
        rules={[
          { required: true, message: '请选择意向店铺类型' },
        ]}
        config={{
          fieldNames: {
            label: 'name',
            value: 'id'
          }
        }}/>
      <FormSelect
        label='参考辐射范围'
        name='scope'
        options={selectionData.scope}
        rules={[
          { required: true, message: '请选择参考辐射范围' },
        ]}
        config={{
          fieldNames: {
            label: 'name',
            value: 'id'
          }
        }}/>
      <div className='mb-16'>
          周边商业氛围：
      </div>
      <FormCascader
        label='周边'
        name='industryEcology'
        config={{
          multiple: true,
          maxTagCount: 'responsive',
          showCheckedStrategy: 'SHOW_CHILD',
          fieldNames: {
            label: 'name',
            value: 'code'
          }
        }}
        options={selectionData.industry}
        rules={[
          { required: true, message: '请选择周边行业' },
        ]}/>
      <Row gutter={12}>
        <Col span={14}>
          <FormInputNumber
            label='门店数量大于'
            min={0}
            max={99999}
            name='industryEcologyNum'
            placeholder='数量'
            rules={[
              { required: true, message: '填写门店数量' },
            ]}/>
        </Col>
        <Col span={6} className='mt-5'>
          家
        </Col>
      </Row>
      <FormRange
        label='目标客单价'
        formItemConfig={{
          required: true
        }}
        leftName='unitPriceMin'
        rightName='unitPriceMax'
        leftRules={[
          { required: true, message: '最低客单价' },
        ]}
        rightRules={[
          { required: true, message: '最高客单价' },
        ]}
        min={0.1}
        max={999999}
        extra={
          <span className='pl-8 mt-5'>
            元
          </span>
        }/>
      <FormSelect
        label='周边客群消费水平'
        name='consumptionLevel'
        options={selectionData.consumptionLevel}
        config={{
          fieldNames: {
            label: 'name',
            value: 'id'
          }
        }}/>
      <TemporaryFormItems/>
      <FormRange
        label='周边二手房价'
        formItemConfig={{
          required: true
        }}
        leftName='housePriceMin'
        rightName='housePriceMax'
        leftRules={[
          { required: true, message: '最低二手房' },
        ]}
        rightRules={[
          { required: true, message: '最高二手房' },
        ]}
        min={0.1}
        max={999999}
        extra={
          <span className='pl-8 mt-5'>
            元
          </span>
        }/>
      <FormInput
        label='协同品牌'
        name='synergyBrand'
        placeholder='请输入协同品牌名称，多个用逗号隔开'
        maxLength={50}/>
      <FormInput
        label='竞争品牌'
        name='competitiveBrand'
        placeholder='请输入竞争品牌名称，多个用逗号隔开'
        maxLength={50}/>
      <Space align='end' className={styles.bottomBtn}>
        <Button onClick={() => cancelHandle()}>取消</Button>
        <Button onClick={() => resetHandle()}>重置</Button>
        <Button
          loading={loading}
          type='primary'
          htmlType='submit'>
            生成推荐区域
        </Button>
      </Space>
    </Form>
  );
};

export default SupernatantForm;
