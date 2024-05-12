
import { PageContainer } from '@/common/components';
import FormDatePicker from '@/common/components/Form/FormDatePicker';
import FormInputNumber from '@/common/components/Form/FormInputNumber';
import FormMultipleDatePicker from '@/common/components/Form/FormMultipleDatePicker/FormMultipleDatePicker';
import FormUpload from '@/common/components/Form/FormUpload';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { floorKeep, isNotEmpty } from '@lhb/func';
import { Button, Card, Col, DatePicker, Drawer, Form, Radio, Row, Space, Tooltip, Typography } from 'antd';
import { FC, useEffect } from 'react';
import AddpriceGroup from '../AddPriceGroup';
import SpotArea from './SpotArea';
import styles from './index.module.less';

interface EditPointProps {
  visible?: boolean;
  onClose?: () => void;
  onOK?: (recoder: any) => void;
  spotName?: string;
  info?: any;
}

const { Title } = Typography;
const { Item, useForm, useWatch } = Form;
const { Group } = Radio;

const EditPoint: FC<EditPointProps> = ({ visible, onClose, onOK, spotName, info }) => {
  const [baseForm] = useForm();
  const [priceForm] = useForm();

  const { spotArea, specLW } = info;

  const onBaseFormSubmit = async () => {
    const values = await baseForm.validateFields();
    return values;
  };

  const onPriceFormSubmit = async () => {
    const values = await priceForm.validateFields();
    return values;
  };

  const onSubmit = async () => {
    try {
      const [baseInfo, priceInfo] = await Promise.all([onBaseFormSubmit(), onPriceFormSubmit()]);
      if (result !== price) {
        return;
      }
      onOK?.({ baseInfo, priceInfo });
    } catch (e) {
      const a = setTimeout(() => {
        const errorList = (document.getElementById('spotForm') as any).querySelectorAll('.ant-form-item-has-error');
        errorList[0]?.scrollIntoView({
          block: 'center',
          behavior: 'smooth',
        });
        clearTimeout(a);
      }, 0);
    }
  };

  const placeFee = useWatch('placeFee', priceForm);
  const serviceFee = useWatch('serviceFee', priceForm);
  const otherFee = useWatch('otherFee', priceForm);
  const depositFee = useWatch('depositFee', priceForm);
  const price = (placeFee || 0) + (otherFee || 0) + (serviceFee || 0);
  // const depositPeriods = useWatch('depositPeriods', priceForm);
  const salePeriods = useWatch('salePeriods', priceForm);

  const result = Array.isArray(salePeriods) ? salePeriods.reduce((result, item) => {
    return floorKeep(result, item.amount, 2);
  }, 0) : 0;

  const validator = () => {
    if (result !== price) {
      return <span style={{ color: '#ff4d4f' }}>总金额与分期总金额不一致，请检查</span>;
    }
    return null;
  };

  useEffect(() => {
    if (!visible) {
      priceForm.resetFields();
      baseForm.resetFields();
    }
  }, [visible]);

  useEffect(() => {
    if (visible) {
      const { priceInfo, baseInfo } = info;
      priceForm.setFieldsValue(priceInfo);
      baseForm.setFieldsValue(baseInfo);
      // setIsPass(true);
    }
  }, [info, visible]);



  return (
    <Drawer
      width={800}
      title='点位信息'
      open={visible}
      destroyOnClose
      onClose={onClose}
      footer={<Space align='center' style={{ width: '100%', justifyContent: 'center' }}>
        <Button onClick={onClose}>
        取消
        </Button>
        <Button type='primary'
          onClick={onSubmit}>
          保存</Button>
      </Space>}
    >
      <Title level={4}>{spotName}</Title>
      <Title level={5}>1.点位信息</Title>
      <div id='spotForm'>
        <Form wrapperCol={{ span: 18 }} labelCol={{ span: 6 }} form={baseForm} className={styles.form}>
          <Row>
            <Col span={12}>
              <FormMultipleDatePicker config={{ maxTagCount: 'responsive' }} label='活动日期' name='dates' rules={[{ message: '活动日期不能为空', required: true }]}/>
            </Col>
            <Col span={12}>
              <FormDatePicker label='进场日期' name='entranceDate' />
            </Col>
            <Col span={12}>
              <FormDatePicker label='撤场日期' name='withdrawDate' />
            </Col>
            <Col span={24}>
              <FormUpload
                formItemConfig={{
                  wrapperCol: { span: 21 },
                  labelCol: { span: 3 },
                  help: '仅可上传 .png/.jpg/.jpeg/.bmp/.gif 文件， 不超过 50 MB， 最多上传 10 个文件'
                }}
                label='效果图'
                name='graph'
                config={{ size: 50, maxCount: 10 }}/>
            </Col>
            <Col>
              <Item label='点位面积' wrapperCol={{ span: 21 }} labelCol={{ span: 3 }}>
                <PageContainer noMargin noPadding>
                  <Card bodyStyle={{ background: 'rgba(250, 250, 250, 1)', padding: '0 16px' }}>
                    <Row>
                      <Col span={24}>
                        <Item>
                          <span>
                            {spotArea}m²
                            <span style={{ color: '#D8DBE1', fontSize: 12 }}>
                              （{specLW?.length ? `${specLW[0].l}m * ${specLW[0].w}m` : ''}）</span>
                          </span>
                        </Item>
                      </Col>
                      <Col span={24}>
                        <Item label='活动面积'
                          name='area'>
                          <SpotArea/>
                        </Item>
                      </Col>
                      <Col span={24}>
                        <Item label='展具尺寸' name='size'
                        >
                          <SpotArea/>
                        </Item>
                      </Col>
                    </Row>
                  </Card>
                </PageContainer>
              </Item>
            </Col>
          </Row>
        </Form>
        <Title level={5}>2.价格信息</Title>
        <Form wrapperCol={{ span: 21 }} labelCol={{ span: 3 }} form={priceForm} className={styles.form}>
          <Row>
            <Col span={24}>
              <Item label='计费方式' name='billingType' rules={[{ required: true, message: '计费方式必选' }]}>
                <Group>
                  <Radio value={1}>按场地日期</Radio>
                  <Radio value={2}>
                    按销售额分成
                    <Tooltip title='销售额在活动结束后录入'>
                      <QuestionCircleOutlined style={{ color: 'rgba(164, 177, 205, 1)' }} />
                    </Tooltip>
                  </Radio>
                </Group>
              </Item>
            </Col>
            <Col span={24}>
              <Item label='收入' name='totalAmount'
              >
                <PageContainer noMargin noPadding>
                  <Card bodyStyle={{ padding: '0 16px', background: 'rgba(250, 250, 250, 1)' }}>
                    <Row gutter={24}>
                      <Col span={24}>
                        <Item>
                          <span>{price.toFixed(2)}元（不含押金）</span>
                          {validator()}
                        </Item>
                      </Col>
                      <Col span={12}>
                        <FormInputNumber name='placeFee'
                          formItemConfig={{ wrapperCol: { span: 18 }, labelCol: { span: 6 } }}
                          config={{ addonAfter: '元', precision: 2, max: 9999999999.99, min: 0 }}
                          label='场地费'/>
                      </Col>
                      <Col span={12}>
                        <FormInputNumber
                          name='serviceFee'
                          formItemConfig={{ wrapperCol: { span: 18 }, labelCol: { span: 6 } }}
                          config={{ addonAfter: '元', precision: 2, max: 9999999999.99, min: 0 }}
                          label='服务费'/>
                      </Col>
                      {/* <Col span={12}>
                        <FormInputNumber
                          name='depositFee'
                          rules={[{ required: true, message: '押金必填' }]}
                          formItemConfig={{ wrapperCol: { span: 18 }, labelCol: { span: 6 } }}
                          config={{ addonAfter: '元' }}
                          label='押金'/>
                      </Col> */}
                      <Col span={12}>
                        <FormInputNumber name='otherFee'
                          formItemConfig={{ wrapperCol: { span: 18 }, labelCol: { span: 6 } }}
                          config={{ addonAfter: '元', precision: 2, max: 9999999999.99, min: 0 }}
                          label='其他费用'/>
                      </Col>
                      <Col span={24}>
                        <Item label='收款日期' name='salePeriods'
                          rules={
                            price > 0 ? [{ required: true, message: '收款日期必填' }, { validator(_, value = []) {
                              const isPass = value.every(item => (item.date && item.amount));
                              if (isPass) {
                                return Promise.resolve();
                              }
                              return Promise.reject('收款日期存在未填项');
                            }, }, { validator: (rule, value) => {
                              const result = Array.isArray(value) ? value.reduce((result, item) => {
                                return floorKeep(result, item.amount, 2);
                              }, 0) : 0;
                              if (result !== price) {
                                return Promise.reject(new Error('总金额与分期总金额不一致，请检查'));
                              }
                              return Promise.resolve();
                            }, }] : []}
                        >
                          <AddpriceGroup/>
                        </Item>
                      </Col>
                    </Row>
                  </Card>
                </PageContainer>
              </Item>
            </Col>
            <Col span={24}>
              <Item label='押金收入'>
                <PageContainer noMargin noPadding>
                  <Card bodyStyle={{ padding: 16, background: 'rgba(250, 250, 250, 1)' }}>
                    <Row >
                      <Col span={12}>
                        <FormInputNumber
                          name='depositFee'
                          config={{ addonAfter: '元' }}
                          formItemConfig={{ wrapperCol: { span: 18 }, labelCol: { span: 6 } }}
                          label='押金'
                          // rules={[{ validator: (rule, value) => {
                          //   const result = Array.isArray(depositPeriods) ? depositPeriods.reduce((result, item) => {
                          //     return floorKeep(result, item.amount, 2);
                          //   }, 0) : 0;
                          //   if (typeof result === 'number' && typeof value === 'number') {
                          //     if (result !== value) {
                          //       return Promise.reject(new Error('总金额与分期总金额不一致，请检查'));
                          //     }
                          //   }
                          //   return Promise.resolve();
                          // }, }]}
                        />
                      </Col>
                      <Col span={24}>
                        <Item label='收款日期'
                          name='depositPeriods'
                          dependencies={['depositFee']}
                          rules={[{
                            required: depositFee > 0,
                            validator(_, value = []) {
                              const result = Array.isArray(value) ? value.reduce((result, item) => {
                                return floorKeep(result, item.amount, 2);
                              }, 0) : 0;
                              if (value.length !== 0 &&
                                !(value.length === 1 && !isNotEmpty(value[0].amount) && !isNotEmpty(depositFee)) &&
                                result !== depositFee) {
                                return Promise.reject(new Error('总金额与分期总金额不一致，请检查'));
                              }
                              if (depositFee > 0) {
                                const isPass = value.every(item => (item.date && item.amount));
                                if (!isPass) {
                                  return Promise.reject('应收款日期模块存在未填项或部分金额为0');
                                }
                              }
                              return Promise.resolve();
                            }
                          }]}
                          // rules={depositFee > 0
                          //   ? [{ required: true, message: '收款日期必填' }, { validator(_, value = []) {
                          //     const isPass = value.every(item => (item.date && item.amount));
                          //     if (isPass) {
                          //       return Promise.resolve();
                          //     }
                          //     return Promise.reject('应收款日期存在未填项');
                          //   }, }, { validator: (rule, value) => {
                          //     const result = Array.isArray(value) ? value.reduce((result, item) => {
                          //       return floorKeep(result, item.amount, 2);
                          //     }, 0) : 0;
                          //     if (result !== depositFee) {
                          //       return Promise.reject(new Error('总金额与分期总金额不一致，请检查'));
                          //     }
                          //     return Promise.resolve();
                          //   }, }] : []}
                        >
                          <AddpriceGroup/>
                        </Item>
                      </Col>
                      <Col span={12} >
                        <Item
                          labelCol={{ span: 6 }}
                          wrapperCol={{ span: 18 }}
                          label='退回时间'
                          name='depositWithdrawDate'>
                          <DatePicker style={{ width: '100%' }}/>
                        </Item>
                      </Col>
                    </Row>
                  </Card>
                </PageContainer>
              </Item>
            </Col>
          </Row>
        </Form>
      </div>
    </Drawer>
  );

};

export default EditPoint;
