import { FC, useEffect, useMemo } from 'react';
import styles from './index.module.less';
import cs from 'classnames';
import { Form, message, Space } from 'antd';
import { FormInModal } from '@/common/components';
import FormDatePicker from '@/common/components/Form/FormDatePicker';
import FormInputNumber from '@/common/components/Form/FormInputNumber';
import FormRadio from '@/common/components/Form/FormRadio';
import FormTextArea from '@/common/components/Form/FormTextArea';
import IconFont from '@/common/components/IconFont';
import { useMethods } from '@lhb/hook';
import { contrast, deepCopy, floorKeep } from '@lhb/func';
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
  info,
  priceVisible,
  onPriceHidden,
  cb
}) => {
  const [form] = Form.useForm();
  const placeFee = Form.useWatch('placeFee', form);
  const serviceFee = Form.useWatch('serviceFee', form);
  const otherFee = Form.useWatch('otherFee', form);
  const depositFee = Form.useWatch('depositFee', form);
  const incomeTotal = (placeFee || 0) + (otherFee || 0) + (serviceFee || 0);
  const salePeriods = Form.useWatch('salePeriods', form); // 收入分期日期列表
  const depositPeriods = Form.useWatch('depositPeriods', form); // 押金分期日期列表
  const methods = useMethods({
    onSubmit() {
      if (showDepositError?.has || showIncomeError?.has) {
        return; // 还有报错未解决
      }
      form.validateFields().then((_params) => {
        const params = deepCopy(_params);
        // 收入分期数据计算
        if (incomeTotal <= 0) {
          params.salePeriods = [];
        } else if (params.salePeriods.length === 1) {
          params.salePeriods[0].amount = incomeTotal;
        }
        params.salePeriods = params.salePeriods.map(item => {
          item.date = dayjs(item.date).format('YYYY-MM-DD');
          return item;
        });
        // 押金分期数据计算
        if (depositFee <= 0) {
          params.depositPeriods = [];
          delete params.depositWithdrawDate;
        } else if (params.depositPeriods.length === 1) {
          params.depositPeriods[0].amount = depositFee;
        }
        if (params.depositWithdrawDate) {
          params.depositWithdrawDate = dayjs(params.depositWithdrawDate).format('YYYY-MM-DD');
        }
        params.depositPeriods = params.depositPeriods.map(item => {
          item.date = dayjs(item.date).format('YYYY-MM-DD');
          return item;
        });
        params.id = id;
        // 销售单改价
        // https://yapi.lanhanba.com/project/420/interface/api/39591
        post('/order/saleOrder/changePrice', params, {
          needHint: true,
          proxyApi: '/order-center'
        }).then(() => {
          cb?.();
          onPriceHidden();
          message.success('操作成功');
        });
      });
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
    }
  });
  // Form.ErrorList 是否需要显示
  // antd这个组件比较low，不会监听到数组内，item对象参数的变化
  const showIncomeError = useMemo(() => {
    if (salePeriods) {
      return methods.hasError(salePeriods, incomeTotal, '请确保金额累计和收入总额一致');
    }
  }, [salePeriods, incomeTotal]);
  const showDepositError = useMemo(() => {
    if (depositPeriods) {
      return methods.hasError(depositPeriods, depositFee, '请确保金额累计和押金总额一致');
    }
    return false;
  }, [depositPeriods, depositFee]);
  useEffect(() => {
    if (priceVisible) {
      // console.log(5555, info);
      // XS167116176260246438001
      const { price = {} } = info || {};
      const salePeriods = info.salePeriods?.length ? info.salePeriods : [{ date: undefined, amount: undefined }];
      const depositPeriods = info.depositPeriods?.length ? info.depositPeriods : [{ date: undefined, amount: undefined }];
      form.setFieldsValue({
        placeFee: contrast(price, 'placeFee'), // 场地费（元）
        serviceFee: contrast(price, 'serviceFee'), // 服务费（元）
        otherFee: contrast(price, 'otherFee'), // 其他费用（元）
        depositFee: contrast(price, 'depositFee'), // 押金（元）
        mark: undefined,
        // 新增字段
        billingType: contrast(price, 'billingType', 1), // 计费方式  1：安场地日期  2：按销售分成
        salePeriods: salePeriods.map(item => { // 销售额付款周期
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
        depositWithdrawDate: price.depositWithdrawDate ? dayjs(price.depositWithdrawDate) : undefined // 押金预计退回时间
      });
    }
  }, [priceVisible]);
  return (
    <FormInModal
      title='改价'
      visible={priceVisible}
      onCancelSubmit={onPriceHidden}
      onSubmit={methods.onSubmit}
      form={form}
      width={746}
    >
      <Form
        className={styles.formChangePrice}
        wrapperCol={{ span: 20 }}
        labelCol={{ span: 4 }}
        colon={false}>
        <FormRadio
          rules={[{ required: true, message: '请选择发放原因' }]}
          label='计费方式'
          name='billingType'
          formItemConfig={{
            tooltip: '销售额在活动结束后录入'
          }}
          options={[
            { label: '按场地日期计费', value: 1 },
            { label: '按销售额分成', value: 2 },
          ]}
        />
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
            <FormInputNumber formItemConfig={{
              labelCol: { span: 4 }
            }} name='serviceFee' placeholder='请输入服务费' label='服务费' config={config}/>
            <FormInputNumber formItemConfig={{
              labelCol: { span: 4 }
            }} name='otherFee' placeholder='请输入其他费' label='其他费' config={config}/>
            {
              incomeTotal > 0 ? <Form.List
                name='salePeriods'>
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
            <FormInputNumber name='depositFee' formItemConfig={{
              labelCol: { span: 4 }
            }} placeholder='请输入押金' label='金额' config={config}/>
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
                }} label='预计退回日期' name='depositWithdrawDate' />
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
  );
};

export default ChangePrice;
