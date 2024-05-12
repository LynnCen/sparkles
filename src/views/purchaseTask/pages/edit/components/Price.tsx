import { FC, useImperativeHandle, useMemo, useRef, forwardRef, useEffect } from 'react';
import { accumulation, beautifyThePrice, contrast, deepCopy, floorKeep, isNotEmpty } from '@lhb/func';
import { Button, Form } from 'antd';
import dayjs from 'dayjs';
import FormDatePicker from 'src/common/components/Form/FormDatePicker';
import FormInputNumber from 'src/common/components/Form/FormInputNumber';
import FormInput from 'src/common/components/Form/FormInput';
import Group from 'src/common/components/Group/index';
import { TWO_DECIMAL_NUMBER_REG } from '@lhb/regexp';
import styles from '../entry.module.less';
import cs from 'classnames';
import AdditionalCostEditor from '@/views/purchase/components/AdditionalCostEditor';

// 处理日期为 年月日
const parseDate = (date) => {
  return isNotEmpty(date) ? dayjs(date).format('YYYY-MM-DD') : null;
};

const Price: FC<any> = forwardRef(({ form }, ref) => {
  // 抛出给 ref 事件
  useImperativeHandle(ref, () => ({
    getSubmitParams: (formData: any) => getSubmitParams(formData)
  }));

  const actual_fee = Form.useWatch('actual_fee', form); // 场地成本
  const extra_amounts = Form.useWatch('extra_amounts', form); // 额外成本
  const deposit = Form.useWatch('deposit', form); // 押金

  // 额外成本总计
  const totalExtraAmount = useMemo(() => {
    let amounts:any = [];
    if (Array.isArray(extra_amounts)) {
      amounts = extra_amounts.reduce((result, item) => result.concat(item.amount), amounts);
    }
    return accumulation(amounts);
  }, [extra_amounts]);

  // 成本 = 场地成本 + 额外成本
  const totalAmount = useMemo(() => {
    const amounts:any = [];
    actual_fee && amounts.push(actual_fee);
    totalExtraAmount && amounts.push(totalExtraAmount);
    return accumulation(amounts);
  }, [actual_fee, totalExtraAmount]);

  // 金额付款计划校验
  const amountPlansRules = [{
    validator: (rule, value) => {
      if (value.some(item => isNotEmpty(item.amount) && !TWO_DECIMAL_NUMBER_REG.test(item.amount))) {
        return Promise.reject(new Error('请输入两位小数点小数'));
      }
      return Promise.resolve();
    },
  }, {
    validator: (rule, value) => {
      const result = Array.isArray(value) ? value.reduce((result, item) => {
        return floorKeep(result, item.amount, 2);
      }, 0) : 0;
      if (!+totalAmount) {
        return Promise.reject(new Error('成本总计必须大于0，请检查'));
      }
      if (result !== +totalAmount) {
        return Promise.reject(new Error('总金额与分期总金额不一致，请检查'));
      }
      return Promise.resolve();
    },
  }, {
    validator: (rule, value) => {
      if (value.some(item => isNotEmpty(item.amount) && !isNotEmpty(item.date))) {
        return Promise.reject(new Error('请选择付款日期'));
      }
      return Promise.resolve();
    },
  }];

  // 触发校验金额付款计划
  const validateAmountPlans = () => {
    form.validateFields(['amount_plans']);
  };

  // 押金付款计划校验
  const depositPlansRules = [{
    validator: (rule, value) => {
      if (value.some(item => isNotEmpty(item.amount) && !TWO_DECIMAL_NUMBER_REG.test(item.amount))) {
        return Promise.reject(new Error('请输入两位小数点小数'));
      }
      return Promise.resolve();
    },
  }, {
    validator: (rule, value) => {
      const result = Array.isArray(value) ? value.reduce((result, item) => {
        return floorKeep(result, item.amount, 2);
      }, 0) : 0;
      if ((result || deposit) && result !== +deposit) {
        return Promise.reject(new Error('总金额与分期总金额不一致，请检查'));
      }
      return Promise.resolve();
    },
  }, {
    validator: (rule, value) => {
      if (value.some(item => isNotEmpty(item.amount) && !isNotEmpty(item.date))) {
        return Promise.reject(new Error('请选择付款日期'));
      }
      return Promise.resolve();
    },
  }];
  // 触发校验押金付款计划
  const validateDepositPlans = () => {
    form.validateFields(['deposit_plans']);
  };

  // 初始化
  const init = () => {
    const result = {
      actual_fee: undefined, // 场地成本
      extra_amounts: [], // 额外成本
      amount_plans: [], // 付款日期
      deposit: undefined, // 押金
      deposit_plans: [], // 押金付款日期
      recovery_time: undefined, // 预计收回时间
    };
    // 表单赋值
    form.setFieldsValue(result);
  };

  useEffect(() => {
    init();
  }, []);

  // 获取提交用表单数据
  const getSubmitParams = (formData: any) => {
    const values = deepCopy(formData);

    const params = {
      // purchaseFee: totalAmount, // 采购总金额（元）
      placeFee: contrast(values, 'actual_fee'), // 场地成本
      extPrices: contrast(values, 'extra_amounts', []).map(item => ({ field: item.type, name: item.label, value: item.amount })), // 额外成本
      purchasePeriods: contrast(values, 'amount_plans', []).filter(item => item.date && item.amount).map(item => ({ date: parseDate(item.date), amount: item.amount })), // 付款日期
      depositFee: contrast(values, 'deposit'), // 押金
      depositPeriods: contrast(values, 'deposit_plans', []).filter(item => item.date && item.amount).map(item => ({ date: parseDate(item.date), amount: item.amount })), // 押金付款日期
      depositRecoveryDate: parseDate(contrast(values, 'recovery_time')), // 预计收回时间
    };
    return params;
  };

  // 获取初始化表单
  const getOriPlan = () => {
    return {
      date: null, // 回款时间
      amount: null // 回款金额
    };
  };

  // 取值
  const amount_plans = Form.useWatch('amount_plans', form);
  const deposit_plans = Form.useWatch('deposit_plans', form);

  // 获取组件实例
  const additionalCostEditor = useRef(null);

  // 编辑额外成本
  const editExtraAmounts = () => {
    (additionalCostEditor as any).current.init(form.getFieldValue('extra_amounts') || []);
  };

  // 编辑额外成本-保存回调
  const additionalCostEditorConfirm = ({ items }) => {
    form.setFieldValue('extra_amounts', items);
    validateAmountPlans();
  };

  return (
    <>
      <div className='fn-14 lh-20 font-weight-500 mb-16 mt-8'>3.价格信息</div>

      <div className={cs(styles.price, 'mb-12')}>
        <div className={styles['price__title']}>成本</div>

        <div className={styles['price__content']}>
          <div className='mb-12 bold'>{beautifyThePrice(totalAmount)}元（不含押金）</div>
          <FormInputNumber
            label='场地成本'
            name='actual_fee'
            min={0}
            max={9999999999.99}
            config={{ addonAfter: '元', onChange: validateAmountPlans }}
            rules={[{ pattern: TWO_DECIMAL_NUMBER_REG, message: '请输入两位小数点小数', }]}
            placeholder='请输入场地成本'
            formItemConfig={{ className: styles['price__actual'] }}
          />
          <Form.Item name='extra_amounts' label='额外成本' className='mb-12'>
            <div className={styles['extra-amounts']}>
              {Array.isArray(extra_amounts) && extra_amounts.map((item, index) => (
                <div key={index} className={styles['extra-amount-item']}>
                  <span className={styles['extra-amount-item__label']}>{item.label}：</span>
                  <span className={styles['extra-amount-item__amount']}>{beautifyThePrice(item.amount)}元</span>
                </div>
              ))}
              <div className={cs(styles['extra-amount-item'], styles['extra-amount-total'], !Array.isArray(extra_amounts) || !extra_amounts.length ? styles['no-amount'] : '')}>
                <span className={styles['extra-amount-item__label']}>总计：</span>
                <span className={styles['extra-amount-item__amount']}>{beautifyThePrice(totalExtraAmount)}元</span>
                <Button type='link' className={styles['extra-amount-total__edit']} onClick={editExtraAmounts}>编辑</Button>
              </div>
            </div>
          </Form.Item>

          <Form.Item name='amount_plans' label='付款日期' className={cs(styles['plans'])} rules={amountPlansRules} >
            <Group value={amount_plans} setValue={(data) => form.setFieldValue('amount_plans', data)} getOriData={getOriPlan}>
              {(item, index) => <>
                <FormDatePicker
                  name={['amount_plans', index, 'date']}
                  formItemConfig={{ className: cs('mr-12', 'mb-0', styles['plans__date']) }}
                  config={{ onChange: validateAmountPlans }}
                  placeholder='请选择付款日期'
                />
                <FormInput
                  name={['amount_plans', index, 'amount']}
                  config={{ addonAfter: '元', onChange: validateAmountPlans }}
                  formItemConfig={{ className: cs('mr-12', 'mb-0', styles['plans__amount']) }}
                  placeholder='请填写金额'
                />
              </>}
            </Group>
          </Form.Item>

        </div>
      </div>

      <div className={styles.price}>
        <div className={styles['price__title']}>押金</div>

        <div className={styles['price__content']}>
          <FormInputNumber
            name='deposit'
            min={0}
            max={9999999999.99}
            config={{ addonAfter: '元', onChange: validateDepositPlans }}
            rules={[{ pattern: TWO_DECIMAL_NUMBER_REG, message: '请输入两位小数点小数', }]}
            placeholder='填写押金金额'
            formItemConfig={{ className: styles['price__deposit'] }}
          />

          <Form.Item name='deposit_plans' label='付款日期' className={cs(styles['plans'])} rules={depositPlansRules} >
            <Group value={deposit_plans} setValue={(data) => form.setFieldValue('deposit_plans', data)} getOriData={getOriPlan}>
              {(item, index) => <>
                <FormDatePicker
                  name={['deposit_plans', index, 'date']}
                  formItemConfig={{ className: cs('mr-12', 'mb-0', styles['plans__date']) }}
                  config={{ onChange: validateDepositPlans }}
                  placeholder='请选择付款日期'
                />
                <FormInputNumber
                  name={['deposit_plans', index, 'amount']}
                  min={0}
                  max={9999999999.99}
                  config={{ addonAfter: '元', onChange: validateDepositPlans }}
                  formItemConfig={{ className: cs('mr-12', 'mb-0', styles['plans__amount']) }}
                  placeholder='请填写金额'
                />
              </>}
            </Group>
          </Form.Item>

          <FormDatePicker label='预计收回时间' name='recovery_time' placeholder='请选择押金收款日期' formItemConfig={{ className: styles['price__deposit_recovery'] }} />
        </div>
      </div>

      <AdditionalCostEditor
        ref={additionalCostEditor}
        onConfirm={additionalCostEditorConfirm}
      />
    </>
  );
});

export default Price;
