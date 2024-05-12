// 采购单编辑-添加点位
import { TWO_DECIMAL_NUMBER_REG } from '@lhb/regexp';
import { accumulation, beautifyThePrice, contrast, deepCopy, floorKeep, isNotEmpty } from '@lhb/func';
import dayjs from 'dayjs';
import cs from 'classnames';
import styles from './index.module.less';
import { FC, forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Form, Button, Drawer } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import FormMultipleDatePicker from '@/common/components/Form/FormMultipleDatePicker/FormMultipleDatePicker';
import FormDatePicker from 'src/common/components/Form/FormDatePicker';
import FormInputNumber from 'src/common/components/Form/FormInputNumber';
import Group from 'src/common/components/Group/index';
import AdditionalCostEditor from '@/views/purchase/components/AdditionalCostEditor';


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

const PointEditor:FC<any> = forwardRef(({ onConfirm }, ref) => {
  // 抛出给 ref 事件
  useImperativeHandle(ref, () => ({
    init
  }));

  const [visible, setVisible] = useState(false);

  const [form] = Form.useForm();
  const [fieldName, setFieldName] = useState(''); // 显示的场地名称字段

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
      if (result !== +totalAmount) {
        return Promise.reject(new Error('总金额与分期总金额不一致，请检查'));
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
      console.log(result, deposit);
      if (result !== +deposit) {
        return Promise.reject(new Error('总金额与分期总金额不一致，请检查'));
      }
      return Promise.resolve();
    },
  }];
  // 触发校验押金付款计划
  const validateDepositPlans = () => {
    form.validateFields(['deposit_plans']);
  };

  // 初始化
  const init = (data) => {
    console.log('init', data);
    setVisible(true);

    form.resetFields(); // 先重置表单

    setFieldName(data.name); // 显示的场地名称字段

    const dates = contrast(data, 'dates', []).map(item => isNotEmpty(item) ? dayjs(item).valueOf() : null);

    const result = {
      name: contrast(data, 'placeName'), // 场地名称
      size: contrast(data, 'specification'), // 面积
      dates, // 活动日期
      enter_time: encodeDate(contrast(data, 'entranceDate')), // 进场时间
      exit_time: encodeDate(contrast(data, 'withdrawDate')), // 撤场时间
      actual_fee: contrast(data, 'placeFee'), // 场地成本
      extra_amounts: contrast(data, 'extPrices', []).map(item => ({ type: item.field, label: item.name, amount: item.value })), // 额外成本
      amount_plans: contrast(data, 'purchasePeriods', []).map(item => ({ date: encodeDate(item.date), amount: item.amount })), // 付款日期
      deposit: contrast(data, 'depositFee'), // 押金
      deposit_plans: contrast(data, 'depositPeriods', []).map(item => ({ date: encodeDate(item.date), amount: item.amount })), // 押金付款日期
      recovery_time: encodeDate(contrast(data, 'depositRecoveryDate')), // 预计收回时间
    };

    // 表单赋值
    form.setFieldsValue(result);
  };

  const size = Form.useWatch('size', form);

  // 提交表单数据
  const onSubmit = () => {
    form.validateFields().then((values: any) => {
      console.log('values', values);

      values = deepCopy(values);

      const params = {
        dates: contrast(values, 'dates', []).map(item => parseDate(item)), // 活动日期
        entranceDate: parseDate(contrast(values, 'enter_time')), // 进场时间
        withdrawDate: parseDate(contrast(values, 'exit_time')), // 撤场时间
        purchaseFee: totalAmount, // 采购总金额（元）
        placeFee: contrast(values, 'actual_fee'), // 场地成本
        extPrices: contrast(values, 'extra_amounts', []).map(item => ({ field: item.type, name: item.label, value: item.amount })), // 额外成本
        purchasePeriods: contrast(values, 'amount_plans', []).map(item => ({ date: parseDate(item.date), amount: item.amount })), // 付款日期
        depositFee: contrast(values, 'deposit'), // 押金
        depositPeriods: contrast(values, 'deposit_plans', []).map(item => ({ date: parseDate(item.date), amount: item.amount })), // 押金付款日期
        depositRecoveryDate: parseDate(contrast(values, 'recovery_time')), // 预计收回时间
      };

      onConfirm && onConfirm(params);
      onCancel();
    });
  };

  // 关闭弹窗
  const onCancel = () => {
    // 触发父级的回调
    // onClose && onClose({ ...operateTenant, visible: false });
    setVisible(false);
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
    (additionalCostEditor as any).current.init(form.getFieldValue('extra_amounts'));
  };

  // 编辑额外成本-保存回调
  const additionalCostEditorConfirm = ({ items }) => {
    form.setFieldValue('extra_amounts', items);
    validateAmountPlans();
  };

  return (<Drawer
    title='编辑点位价格信息'
    open={visible}
    width={720}
    getContainer='body'
    maskClosable={false}
    onClose={onCancel}
    forceRender
    closable={false}
    extra={
      <button type='button' className='ant-drawer-close' onClick={onCancel}>
        <CloseOutlined className='anticon anticon-close'/>
      </button>
    }
    footer={
      <div className='ct mt-6 mb-6'>
        <Button className='mr-20' onClick={onCancel}>取消</Button>
        <Button type='primary' onClick={onSubmit}>提交</Button>
      </div>
    }
  >
    <Form {...layout} labelAlign='left' form={form} colon={false} className={styles.form}>

      <div className='fn-16 lh-22 font-weight-500 mb-20'>{fieldName}</div>

      <div className='fn-14 lh-20 font-weight-500 mb-16'>1.点位信息</div>
      <div className='flex-row'>
        <FormMultipleDatePicker
          label='活动日期'
          name='dates'
          config={{ index: 1 }}
          rules={[{ required: true, message: '请选择活动日期' }]}
          formItemConfig={{ className: 'mr-20' }}
        />
        <FormDatePicker label='进场时间' name='enter_time' placeholder='请选择进场时间' />
      </div>
      <div className='flex-row'>
        <FormDatePicker label='撤场时间' name='exit_time' formItemConfig={{ className: 'mr-20' }} placeholder='请选择撤场时间' />
        <Form.Item label='场地面积' name='size'><div className={styles.size}>{size}</div></Form.Item>
      </div>

      <div className='fn-14 lh-20 font-weight-500 mb-16 mt-8'>2.价格信息</div>

      <div className={cs(styles.price, 'mb-12')}>
        <div className={styles['price__title']}>成本</div>

        <div className={styles['price__content']}>
          <div className='mb-12'>{beautifyThePrice(totalAmount)}元（不含押金）</div>
          <FormInputNumber
            label='场地成本'
            name='actual_fee'
            min={0}
            max={9999999999.99}
            config={{ addonAfter: '元', onChange: validateAmountPlans }}
            rules={[{ pattern: TWO_DECIMAL_NUMBER_REG, message: '请输入两位小数点小数', }]}
            placeholder='请输入场地成本'
          />
          <Form.Item name='extra_amounts' label='额外成本' className='mb-0'>
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
                  placeholder='请选择收款日期'
                />
                <FormInputNumber
                  name={['amount_plans', index, 'amount']}
                  min={0}
                  max={9999999999.99}
                  config={{ addonAfter: '元', onChange: validateAmountPlans }}
                  formItemConfig={{ className: cs('mr-12', 'mb-0', styles['plans__amount']) }}
                  placeholder='请输入收款金额'
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
            placeholder='请输入押金'
          />

          <Form.Item name='deposit_plans' label='付款日期' className={cs(styles['plans'])} rules={depositPlansRules} >
            <Group value={deposit_plans} setValue={(data) => form.setFieldValue('deposit_plans', data)} getOriData={getOriPlan}>
              {(item, index) => <>
                <FormDatePicker
                  name={['deposit_plans', index, 'date']}
                  formItemConfig={{ className: cs('mr-12', 'mb-0', styles['plans__date']) }}
                  placeholder='请选择收款日期'
                />
                <FormInputNumber
                  name={['deposit_plans', index, 'amount']}
                  min={0}
                  max={9999999999.99}
                  config={{ addonAfter: '元', onChange: validateDepositPlans }}
                  formItemConfig={{ className: cs('mr-12', 'mb-0', styles['plans__amount']) }}
                  placeholder='请输入收款金额'
                />
              </>}
            </Group>
          </Form.Item>

          <FormDatePicker label='预计收回时间' name='recovery_time' placeholder='请选择押金收款日期' />
        </div>
      </div>
    </Form>

    {/* 编辑额外成本 */}
    <AdditionalCostEditor
      ref={additionalCostEditor}
      onConfirm={additionalCostEditorConfirm}
    />

  </Drawer>);
});

export default PointEditor;
