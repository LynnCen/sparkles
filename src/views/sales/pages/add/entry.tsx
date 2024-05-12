import { FC, useEffect, useState } from 'react';
import { Button, Col, Form, message, Row, Space, Typography } from 'antd';

import styles from './entry.module.less';
import { Layout, PageContainer } from '@/common/components';
import FormInput from '@/common/components/Form/FormInput';
import FormTextArea from '@/common/components/Form/FormTextArea';
import IndustrySelect from '@/common/business/IndustryTres';
import { AddPoint } from './components';
import FormUpload from '@/common/components/Form/FormUpload';
import DictionarySelect from '@/common/business/DictionarySelect';
import { add, getCRMToken, } from '@/common/api/sales';
import dayjs from 'dayjs';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import SupplierContact from './components/SupplierContact';
import Supplier from './components/Supplier';
import AssignModal from './components/AssignModal';
import { isNotEmpty } from '@lhb/func';
import FormResourceBrand from '@/common/components/FormBusiness/FormResourceBrand';

const { Title } = Typography;
const { Item, useForm, useWatch } = Form;


// 处理日期为 年月日
const parseDate = (date) => {
  return isNotEmpty(date) ? dayjs(date).format('YYYY-MM-DD') : null;
};

// 设置响应式表格
export const reactiveColSpan = { xs: { span: 12 }, sm: { span: 12 }, md: { span: 12 }, lg: { span: 12 }, xl: { span: 12 }, xxl: { span: 12 } };

export const renderLabel = (text: string) => {
  return (
    text
    // <Paragraph ellipsis={{ tooltip: text, rows: 2 }} style={{ margin: 0, width: '4em' }}>
    //   <span style={{ color: '#768098', textAlign: 'right' }}>
    //     {text}
    //   </span>
    // </Paragraph>
  );
};

const Add: FC<any> = () => {
  const [form] = useForm();
  const [token, setToken] = useState<string>('');
  const [assignModalData, setAssignModalData] = useState<any>({
    visible: false,
    orderItems: [],
  });

  const onSubmit = async () => {
    const values = await form.validateFields();
    const { spots = [], licenses = [], enterId = '', industryIds, contactId = '', ...restValues } = values;
    const enter = {
      enterId: enterId.split('-')[0],
      enterName: enterId.split('-')[1],
    };

    const contact = {
      busId: contactId.split('-')[0],
      busName: contactId.split('-')[1],
      busMobile: contactId.split('-')[2],
    };
    const newSpots = spots.map(spot => {
      const { baseInfo, priceInfo, tenantSpotId, tenantPlaceId, specLW = [], ...resetSpot } = spot;
      const {
        area, // 活动面积 [usableLength, usableWidth, usableHeight]
        size, // 展具尺寸 ['length', 'width', 'height']
        dates = [],
        entranceDate,
        withdrawDate,
        graph = [],
        ...restBaseInfo
      } = baseInfo || {};
      const { length: usableLength, height: usableHeight, width: usableWidth } = area || {};
      const { length, height, width } = size || {};
      const { salePeriods = [], depositPeriods = [], depositWithdrawDate, ...restPriceInfo } = priceInfo;
      return {
        length,
        height,
        width,
        usableHeight,
        usableLength,
        usableWidth,
        entranceDate: parseDate(entranceDate),
        withdrawDate: parseDate(withdrawDate),
        depositWithdrawDate: parseDate(depositWithdrawDate),
        graph: graph.map(item => item.url),
        // graph: graph.map(item => ({ name: item.name, url: item.url })),
        dates: dates.map(item => parseDate(item)),
        salePeriods: salePeriods.map(item => ({ amount: item.amount, date: parseDate(item.date) })),
        depositPeriods: depositPeriods.map(item => ({ amount: item.amount, date: parseDate(item.date) })),
        ...restBaseInfo,
        ...restPriceInfo,
        spotId: tenantSpotId,
        placeId: tenantPlaceId,
        specification: specLW?.length ? `${specLW[0].l}m * ${specLW[0].w}m` : '',
        ...resetSpot
      };
    });

    const newValues = {
      spots: newSpots,
      licenses: licenses.map(item => item.url),
      // licenses: licenses.map(item => ({ name: item.name, url: item.url })),
      industryIds: industryIds && industryIds.map(item => item.pop()),
      ...enter,
      ...contact,
      ...restValues,
    };

    const orderItems = await add(newValues);
    if (orderItems) {
      message.success('创建成功');
      setAssignModalData({
        visible: true,
        orderItems: Array.isArray(orderItems) ? orderItems : [],
      });
    }

  };

  const onCloseAssign = () => {
    dispatchNavigate('/sales');
  };

  const getToken = async () => {
    const { token } = await getCRMToken();
    if (token) {
      setToken(token);
    }
  };

  useEffect(() => {
    getToken();
  }, []);


  const enterId = useWatch('enterId', form) || '';
  const id = enterId.split('-')[0];

  const onCancel = () => {
    history.back();
  };

  const renderAction = () => {
    return (
      <Space>
        <Button onClick={onCancel}>取消</Button>
        <Button type='primary' onClick={onSubmit}>确认</Button>
      </Space>
    );
  };

  useEffect(() => {
    form.setFieldsValue({ contactId: undefined });
  }, [enterId]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <PageContainer noMargin>
          <Layout actions={renderAction()} bodyStyle={{ height: 'calc(100vh - 215px)' }}>
            <div className={styles.formContainer}>
              <Form labelWrap form={form} className={styles.form}>
                <Title style={{ margin: 0, paddingLeft: 32 }} level={4}>新增销售单</Title>
                <PageContainer title='基础信息'>
                  <Row gutter={36}>
                    <Col {...reactiveColSpan} >
                      <Item name='enterId' rules={[{ required: true, message: '商家名称必填' }]} label={renderLabel('商家')}>
                        <Supplier token={token}/>
                      </Item>
                    </Col>
                    <Col {...reactiveColSpan} >
                      <Item
                        name='contactId'
                        label={renderLabel('商家联系人')}
                        rules={[{ required: true, message: '联系人必填' }]}>
                        <SupplierContact enterId={id} token={token}/>
                      </Item>
                    </Col>
                    <Col {...reactiveColSpan}>
                      <FormInput name='title' label={renderLabel('活动名称')}
                        rules={[{ required: true, message: '活动名称必填' }]}
                        placeholder='请输入活动名称'/>
                    </Col>
                    <Col {...reactiveColSpan}>
                      <Item label={renderLabel('所属行业')} name='industryIds' rules={[{ required: true, message: '所属行业必填' }]}>
                        <IndustrySelect multiple={true}/>
                      </Item>
                    </Col>
                    <Col {...reactiveColSpan}>
                      <FormInput name='product' label={renderLabel('产品名称')} placeholder='请输入产品名称' />
                    </Col>
                    <Col {...reactiveColSpan}>
                      <FormResourceBrand
                        name='brandIds'
                        label={renderLabel('品牌名称')}
                        config={{ mode: 'multiple' }}
                        rules={[{ required: true, message: '品牌名称必选' }]}
                      />
                    </Col>
                    <Col {...reactiveColSpan} >
                      <Item name='promotionWayIds' label={renderLabel('推广形式')}
                        rules={[{ required: true, message: '推广形式必选' }]} >
                        <DictionarySelect type='promotionWay' placeholder='请选择推广形式'/>
                      </Item>
                    </Col>
                    <Col {...reactiveColSpan} >
                      <Item name='promotionPurposeIds' label={renderLabel('推广目的')}
                        rules={[{ required: true, message: '推广目的必选' }]}>
                        <DictionarySelect type='promotionPurpose' placeholder='请选择推广目的'/>
                      </Item>
                    </Col>
                    <Col {...reactiveColSpan} >
                      <Item
                        name='materialIds'
                        label={renderLabel('物料类型')}
                      >
                        <DictionarySelect type='material' placeholder='请选择物料类型'/>
                      </Item>
                    </Col>
                    <Col span={24} >
                      <FormUpload name='licenses'
                        label={renderLabel('经营许可证品牌授权书')}
                        formItemConfig={{ help: '仅可上传 .png/.jpg/.jpeg/.bmp/.gif 文件， 不超过 50 MB， 最多上传 10 个文件' }}
                        config={{ size: 50, maxCount: 10 }}/>
                    </Col>
                    <Col span={24} >
                      <FormTextArea
                        name='mark'
                        config={{ maxLength: 200, showCount: true }}
                        label={renderLabel('备注')}
                        placeholder='请输入备注'/>
                    </Col>
                  </Row>

                </PageContainer>
                <PageContainer >
                  <Item name='spots' rules={[{ validator(_: any, value = []) {
                    if (value.length === 0) {
                      return Promise.reject('请添加点位');
                    }
                    const isPass = value.every(item => item.isOK);
                    if (isPass) {
                      return Promise.resolve();
                    }
                    const firstSpot = value.filter(item => !item.isOK)[0];
                    const { spotName, placeName } = firstSpot;
                    return Promise.reject(`请完善点位【${placeName}-${spotName}】的点位信息`);
                  } }]}>
                    <AddPoint/>
                  </Item>
                </PageContainer>
              </Form>
            </div>
          </Layout>
        </PageContainer>
      </div>
      <AssignModal data={assignModalData} setData={setAssignModalData} onClose={onCloseAssign} />
    </div>
  );
};

export default Add;
