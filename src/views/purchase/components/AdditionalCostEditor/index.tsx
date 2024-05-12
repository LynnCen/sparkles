// 编辑额外成本明细
// 调用：(additionalCostEditor as any).current.init([{ type: 'electricFee', label: '电费', amount: 10 }, { type: 'approvalFee', label: '报批费', amount: 20 }, { type: 'doorFee', label: '拆门费', amount: 30 }]);
import { contrast, isUndef, deepCopy } from '@lhb/func';
import styles from './index.module.less';
import { FC, forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { Form, Modal } from 'antd';
import { TWO_DECIMAL_NUMBER_WITHOUT_0_REG } from '@lhb/regexp';
import { getOrderSelectionExtPrice } from '@/common/api/purchase';
import FormCheckbox from '@/common/components/Form/FormCheckbox';
import FormInputNumber from '@/common/components/Form/FormInputNumber';

const layout = {
  // labelCol: { span: 6 },
  // wrapperCol: { span: 16 },
};

const AdditionalCostEditor:FC<{ onConfirm?: Function } & { ref?: any;}> = forwardRef(({ onConfirm }, ref) => {
  // 抛出给 ref 事件
  useImperativeHandle(ref, () => ({
    init
  }));

  // 费用类型
  const [additionalTypes, setAdditionalTypes] = useState<Array<{type: string, label: string, seq: number, disabled?: boolean}>>([]);

  const [visible, setVisible] = useState(false);

  const [form] = Form.useForm();

  // 额外成本明细
  const formDataItems = Form.useWatch('items', form);

  // 额外成本类型
  const curTypes = useMemo(() => {
    return additionalTypes.map(item => ({ ...item, value: item.type })).sort((a, b) => a.seq - b.seq);
  }, [additionalTypes]);

  // 费用类型Map
  const amountTypesMap = (() => {
    const amountTypesMap = new Map();
    curTypes.forEach(item => {
      amountTypesMap.set(item.type, item);
    });
    return amountTypesMap;
  })();

  // 获取初始化表单数据
  const getOriFormData = () => {
    return {
      types: [], // 额外成本类型
      /* 各项额外成本
      [{ type: 1, label: '电费', amount: 20, seq: 1, disabled: false }] */
      items: [],
    };
  };

  // 获取初始化额外成本项数据
  const getOriItem = () => {
    return { type: null, label: null, amount: null, seq: 0, disabled: false };
  };

  // 选择类型，更新明细
  const changeTypes = (checkedValue) => {
    const data = checkedValue.map(item => {
      const temp = formDataItems?.find(val => val.type === item);
      return temp || { ...getOriItem(), ...amountTypesMap.get(item) };
    }).sort((a, b) => a.seq - b.seq);

    form.setFieldValue('items', data);
  };

  /**
   * @description: 初始化
   * @param {*} data 回显数据，如
   * [
    { type: 6, label: '电费', amount: 10 },
    { type: 7, label: '水费', amount: 20 },
    { type: 8, label: '网费', amount: 30 }
  ]
   * @return {*}
   */
  const init = (data) => {
    getSelection();

    setVisible(true);

    form.resetFields(); // 先重置表单

    const curItems = data?.map(item => ({
      type: contrast(item, 'type'),
      label: contrast(item, 'label'),
      amount: contrast(item, 'amount'),
      disabled: contrast(item, 'disabled', false),
      seq: amountTypesMap.has(item.type) ? amountTypesMap.get(item.type).seq : 0, // （编辑时，设置排序）
    }));
    const result = Object.assign({}, getOriFormData(), {
      types: Array.isArray(data) ? data.map(item => item.type) : [], // 类型
      items: curItems.sort((a, b) => a.seq - b.seq), // 类型金额明细
    });

    // 表单赋值
    form.setFieldsValue(result);
  };

  // 获取选项数据
  const getSelection = () => {

    getOrderSelectionExtPrice().then((response) => {
      setAdditionalTypes(response.map((item, index) => ({ type: item.field, label: item.name, seq: index })));
    });

    // getSelection = noop; // 如果需要只执行一次，那么取消注释
  };

  // 提交表单数据
  const onSubmit = () => {
    form.validateFields().then((values: any) => {
      values = deepCopy(values);

      const params = {
        types: contrast(values, 'types', []), // 类型
        items: contrast(values, 'items', []), // 类型金额明细
      };

      onConfirm && onConfirm(deepCopy(params));
      onCancel();
    });
  };

  // 关闭弹窗
  const onCancel = () => {
    // 触发父级的回调
    // onClose && onClose();
    setVisible(false);
  };

  return (<Modal
    title='额外成本明细'
    open={visible}
    width={550}
    maskClosable={false}
    onOk={onSubmit}
    onCancel={onCancel}
    forceRender
  >
    <Form {...layout} labelAlign='left' form={form} colon={false} className={styles.form}>

      <FormCheckbox
        name='types'
        label='选择明细'
        config={{ options: curTypes, onChange: changeTypes }}
        formItemConfig={{ className: styles.types }}
      />

      <Form.List name='items'>
        {(fields) => (
          <>
            {Array.isArray(fields) && fields.map((item: any, index) => {
              const data = form.getFieldValue('items')[item.name];
              return (
                <div key={index}>
                  <FormInputNumber
                    key={index}
                    name={[item.name, 'amount']}
                    label={data.label}
                    min={0}
                    max={9999999999.99}
                    config={{ addonAfter: '元' }}
                    rules={ isUndef(data.disabled) || !data.disabled ? [{ required: true, pattern: TWO_DECIMAL_NUMBER_WITHOUT_0_REG, message: '请输入大于0的两位小数点小数', }] : []}
                    placeholder='请输入大于0的金额'
                  />
                </div>
              );
            })}
          </>
        )}
      </Form.List>

    </Form>
  </Modal>);
});

export default AdditionalCostEditor;
