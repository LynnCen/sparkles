import { FC, useEffect, useMemo, useRef } from 'react';
import styles from './index.module.less';
import cs from 'classnames';
import { Button, Form, message, Space } from 'antd';
import { FormInModal } from '@/common/components';
import IconFont from '@/common/components/IconFont';
import FormInputNumber from '@/common/components/Form/FormInputNumber';
import FormTextArea from '@/common/components/Form/FormTextArea';
import FormDatePicker from '@/common/components/Form/FormDatePicker';
import AdditionalCostEditor from '../AdditionalCostEditor';
import { accumulation, beautifyThePrice, contrast, deepCopy, floorKeep } from '@lhb/func';
import { useMethods } from '@lhb/hook';

import dayjs from 'dayjs';
import { post } from '@/common/request';
const config = {
  addonAfter: '元',
  precision: 2,
  max: 9999999999.99,
  min: 0
};
const paymentConfig = {
  ...config,
  min: 0.01
};
const ChangePrice: FC<any> = ({
  id,
  cb,
  priceDetailData,
  priceVisible,
  onPriceHidden,
  info
}) => {
  const additionalCostEditor = useRef(null);
  const [form] = Form.useForm();
  const placeFee = Form.useWatch('placeFee', form);
  const serviceFee = Form.useWatch('serviceFee', form);
  const otherFee = Form.useWatch('otherFee', form);
  const priceDetail = Form.useWatch('priceDetail', form); // 额外成本
  const depositFee = Form.useWatch('depositFee', form);
  const purchasePeriods = Form.useWatch('purchasePeriods', form); // 收入分期日期列表
  const depositPeriods = Form.useWatch('depositPeriods', form); // 押金分期日期列表
  // 额外成本总计
  const totalExtraAmount = useMemo(() => {
    let amounts:any = [];
    if (Array.isArray(priceDetail)) {
      amounts = priceDetail.reduce((result, item) => result.concat(item.amount), amounts);
    }
    return accumulation(amounts);
  }, [priceDetail]);
  const incomeTotal = (placeFee || 0) + (otherFee || 0) + (serviceFee || 0) + (totalExtraAmount || 0);
  const methods = useMethods({
    editExtraAmounts() {
      console.log('编辑额外成本');

      const data = form.getFieldValue('priceDetail');
      console.log('data', data);

      (additionalCostEditor as any).current.init(form.getFieldValue('priceDetail'));
    },
    // 编辑额外成本-保存回调
    additionalCostEditorConfirm({ items }) {
      form.setFieldValue('priceDetail', items);
    },
    hasError(arr, amount, errors) {
      const res = {
        has: false, // 没有错误
        errors: '收款日期列每项都必填',
      };
      if (amount > 0) {
        if (arr.length === 1) {
          res.has = !arr[0]?.date;
        } else {
          const _amount = arr?.reduce((total, item) => {
            if (!item || !item.date || !item.amount) {
              res.has = true;
            }
            return floorKeep(total, item?.amount, 2);
          }, 0);
          if (+_amount !== +amount) {
            res.errors = errors;
            res.has = true;
          }
        }
      }
      return res;
    },
    onSubmit() {
      if (showDepositError?.has || showIncomeError?.has) {
        return; // 还有报错未解决
      }
      form.validateFields().then(_params => {
        const params = deepCopy(_params);
        params.id = id;
        params.priceDetail = params.priceDetail.map(item => {
          return {
            field: item.type,
            value: item.amount
          };
        });
        // 收入分期数据计算
        if (incomeTotal <= 0) {
          params.purchasePeriods = [];
        } else if (params.purchasePeriods.length === 1) {
          params.purchasePeriods[0].amount = incomeTotal;
        }
        params.purchasePeriods = params.purchasePeriods.map(item => {
          item.date = dayjs(item.date).format('YYYY-MM-DD');
          return item;
        });
        // 押金分期数据计算
        if (depositFee <= 0) {
          params.depositPeriods = [];
          delete params.depositRecoveryDate;
        } else if (params.depositPeriods.length === 1) {
          params.depositPeriods[0].amount = depositFee;
        }
        if (params.depositRecoveryDate) {
          params.depositRecoveryDate = dayjs(params.depositRecoveryDate).format('YYYY-MM-DD');
        }
        params.depositPeriods = params.depositPeriods.map(item => {
          item.date = dayjs(item.date).format('YYYY-MM-DD');
          return item;
        });
        // 采购单改价
        // https://yapi.lanhanba.com/project/420/interface/api/40746
        post('/order/purchaseOrder/changePrice', params, {
          needHint: true,
          proxyApi: '/order-center'
        }).then(() => {
          cb?.();
          onPriceHidden();
          message.success('操作成功');
        });
      });
    },
  });
  // Form.ErrorList 是否需要显示
  // antd这个组件比较low，不会监听到数组内，item对象参数的变化
  const showIncomeError = useMemo(() => {
    if (purchasePeriods) {
      return methods.hasError(purchasePeriods, incomeTotal, '请确保金额累计和收入总额一致');
    }
  }, [purchasePeriods, incomeTotal]);
  const showDepositError = useMemo(() => {
    if (depositPeriods) {
      return methods.hasError(depositPeriods, depositFee, '请确保金额累计和押金总额一致');
    }
    return false;
  }, [depositPeriods, depositFee]);
  useEffect(() => {
    if (priceVisible) {
      // console.log(2111, info);
      // CG167108393782495185001
      const purchasePeriods = info.purchasePeriods?.length ? info.purchasePeriods : [{ date: undefined, amount: undefined }];
      const depositPeriods = info.depositPeriods?.length ? info.depositPeriods : [{ date: undefined, amount: undefined }];
      form.setFieldsValue({
        priceDetail: priceDetailData!.map(item => {
          item['type'] = item.field;
          item['label'] = item.name;
          item['amount'] = item.value;
          return item;
        }),
        depositFee: contrast(info, 'depositFee'),
        placeFee: contrast(info, 'placeFee'),
        serviceFee: contrast(info, 'serviceFee'),
        otherFee: contrast(info, 'otherFee'),
        mark: undefined,
        // 新增字段
        purchasePeriods: purchasePeriods.map(item => { // 收入付款周期
          if (item.date) {
            item.date = dayjs(item.date);
          }
          return item;
        }),
        depositPeriods: depositPeriods.map(item => { // 押金付款周期
          if (item.date) {
            item.date = dayjs(item.date);
          }
          return item;
        }),
        depositRecoveryDate: info.depositRecoveryDate ? dayjs(info.depositRecoveryDate) : undefined // 押金预计退回时间
      });
    }
  }, [priceVisible]);
  return (
    <>
      <FormInModal
        title='改价'
        visible={priceVisible}
        onCancelSubmit={onPriceHidden}
        onSubmit={methods.onSubmit}
        form={form}
        width={746}
        // url='/order/purchaseOrder/changePrice'
        // proxyApi='/order-center'
        // transForm={(values) => {
        //   const _priceDetail = values.priceDetail.map(item => {
        //     return {
        //       field: item.type,
        //       value: item.amount
        //     };
        //   });
        //   return {
        //     ...values,
        //     priceDetail: _priceDetail
        //   };
        // }}
      >
        <Form
          className={styles.formChangePrice}
          wrapperCol={{ span: 20 }}
          labelCol={{ span: 4 }}
          colon={false}>
          <Form.Item className={styles.diffLabel} label='收入'>
            <div className={styles.formModule}>
              <Form.Item className={styles.incomeTotal}>
                <>
                  {incomeTotal.toFixed(2)}元 (不含押金)
                </>
              </Form.Item>
              <FormInputNumber formItemConfig={{
                labelCol: { span: 4 }
              }} name='placeFee' placeholder='请输入场地费' label='场地费' config={config}/>
              <Form.Item labelCol={{ span: 4 }} name='priceDetail' label='额外成本' className='mb-0'>
                <div className={styles['extra-amounts']}>
                  {Array.isArray(priceDetail) && priceDetail.map((item, index) => (
                    <div key={index} className={styles['extra-amount-item']}>
                      <span className={styles['extra-amount-item__label']}>{item.label}：</span>
                      <span className={styles['extra-amount-item__amount']}>{beautifyThePrice(item.amount)}元</span>
                    </div>
                  ))}
                  <div className={cs(styles['extra-amount-item'], styles['extra-amount-total'], !Array.isArray(priceDetail) || !priceDetail.length ? styles['no-amount'] : '')}>
                    <span className={styles['extra-amount-item__label']}>总计：</span>
                    <span className={styles['extra-amount-item__amount']}>{beautifyThePrice(totalExtraAmount)}元</span>
                    <Button type='link' className={styles['extra-amount-total__edit']} onClick={methods.editExtraAmounts}>编辑</Button>
                  </div>
                </div>
              </Form.Item>
              {
                incomeTotal > 0 ? <Form.List
                  name='purchasePeriods'>
                  {(fields, { add, remove }) =>
                    fields.map((field, index) => (
                      <Form.Item
                        label={index ? ' ' : '收款日期'}
                        labelCol={{ span: 4 }}
                        className={cs(index ? styles.noColon : null)}
                        key={index}
                        required>
                        <Space>
                          <FormDatePicker name={[field.name, 'date']} />
                          { fields.length !== 1
                            ? <FormInputNumber
                              name={[field.name, 'amount']}
                              placeholder='请输入金额'
                              config={paymentConfig}
                              formItemConfig={{
                                className: styles.diffItem
                              }}
                            />
                            : null }
                          { fields.length > 1
                            ? <span className={cs(styles.iconBtn, styles.iconDelete)} onClick={() => remove(field.name)}>
                              <IconFont className={styles.icon} iconHref='icon-ic_delete_normal'/>
                            删除
                            </span>
                            : null }
                          <span className={cs(styles.iconBtn)} onClick={() => add()}>
                            <IconFont className={styles.icon} iconHref='icon-ic_add'/>添加
                          </span>
                        </Space>
                        {
                          fields.length - 1 === index && showIncomeError?.has ? <Form.ErrorList errors={[<>{showIncomeError.errors}</>]} /> : null
                        }
                      </Form.Item>
                    ))
                  }
                </Form.List> : null
              }
            </div>
          </Form.Item>
          <Form.Item className={styles.diffLabel} label='押金'>
            <div className={styles.formModule}>
              <FormInputNumber formItemConfig={{
                labelCol: { span: 4 }
              }} name='depositFee' placeholder='请输入押金' label='金额' config={config}/>
              {
                depositFee > 0 ? <>
                  <Form.List name='depositPeriods'>
                    {(fields, { add, remove }) =>
                      fields.map((field, index) => (
                        <Form.Item
                          label={index ? ' ' : '收款日期'}
                          labelCol={{ span: 4 }}
                          className={cs(index ? styles.noColon : null)}
                          key={index}
                          required>
                          <Space>
                            <FormDatePicker name={[field.name, 'date']} />
                            { fields.length !== 1
                              ? <FormInputNumber
                                name={[field.name, 'amount']}
                                placeholder='请输入金额'
                                config={paymentConfig}
                                formItemConfig={{
                                  className: styles.diffItem
                                }}
                              /> : null }
                            { fields.length > 1
                              ? <span className={cs(styles.iconBtn, styles.iconDelete)} onClick={() => remove(field.name)}>
                                <IconFont className={styles.icon} iconHref='icon-ic_delete_normal'/>
                            删除
                              </span>
                              : null }
                            <span className={cs(styles.iconBtn)} onClick={() => add()}>
                              <IconFont className={styles.icon} iconHref='icon-ic_add'/>添加
                            </span>
                          </Space>
                          {
                            fields.length - 1 === index && showDepositError?.has ? <Form.ErrorList errors={[<>{showDepositError.errors}</>]} /> : null
                          }
                        </Form.Item>
                      ))
                    }
                  </Form.List>
                  <FormDatePicker formItemConfig={{
                    labelCol: { span: 4 }
                  }} label='预计回收日期' name='depositRecoveryDate' />
                </> : null
              }
            </div>
          </Form.Item>
          <FormTextArea
            name='mark'
            label='修改原因'
            rules={[{ required: true, message: '修改原因必填' }]}
            placeholder='请填写修改原因，最多可输入200字'
            config={{ maxLength: 200, showCount: true }}/>
        </Form>
      </FormInModal>
      <AdditionalCostEditor
        ref={additionalCostEditor}
        onConfirm={methods.additionalCostEditorConfirm}
      />
    </>
  );
};

export default ChangePrice;
