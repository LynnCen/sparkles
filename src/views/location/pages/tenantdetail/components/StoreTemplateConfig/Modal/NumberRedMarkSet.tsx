/**
 * @Description 数字输入型的标红设置
 *
 * 设置后，向数字输入型的property的 templateRestriction 的json中添加 redMark字段，值为对象
 * {"redMark":{"isRedMark":true,"isItemTip":true,"isPageTip":false,"itemTip":"这是提示文字","firstValue":10,"firstComapre":">","secondValue":100,"secondComapre":"<=","joinType":"&&"}}
 *
 */
import { useMethods } from '@lhb/hook';
import { post } from '@/common/request';
import { Form, message, Modal, Row, Col } from 'antd';
import React, { useEffect, useState, useMemo } from 'react';
import { isArray, isNotEmpty, isNotEmptyAny } from '@lhb/func';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2Form from '@/common/components/Form/V2Form';
import V2FormInputNumber from '@/common/components/Form/V2FormInputNumber/V2FormInputNumber';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormCheckbox from '@/common/components/Form/V2FormCheckbox/V2FormCheckbox';
import styles from '../entry.module.less';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 19 },
};

// 勾选项中每项值
const enum CHECKBOX_VALUE {
  RedMark = 1,
  ItemTip = 2,
  PageTip = 3,
}

// 数字比较关系、条件结合类型的值定义
const enum NUMBER_CHECK {
  Larger = '>',
  Less = '<',
  Equal = '=',
  LargerOrEqual = '>=',
  LessOrEqual = '<=',
  And = '&&',
  Or = '||'
};

// 数字比较关系选项
const compareOptions = [
  { label: '大于', value: NUMBER_CHECK.Larger },
  { label: '小于', value: NUMBER_CHECK.Less },
  { label: '等于', value: NUMBER_CHECK.Equal },
  { label: '大于等于', value: NUMBER_CHECK.LargerOrEqual },
  { label: '小于等于', value: NUMBER_CHECK.LessOrEqual },
];

// 多条件结合类型选项
const joinTypeOptions = [
  { label: '并且', value: NUMBER_CHECK.And },
  { label: '或者', value: NUMBER_CHECK.Or },
];

const NumberRedMarkSet: React.FC<any> = ({
  propertyConfig,
  setPropertyConfig,
  onSearch,
  templateId
}) => {
  const { templateRestriction } = propertyConfig;
  const [form] = Form.useForm();
  const curFirstVal = Form.useWatch('firstValue', form);
  const curFirstComp = Form.useWatch('firstComapre', form);
  const curSecondVal = Form.useWatch('secondValue', form);
  const curSecondComp = Form.useWatch('secondComapre', form);
  const curJoinType = Form.useWatch('joinType', form);
  const curCheckbox = Form.useWatch('checkbox', form);

  const [conflict, setConflict] = useState<boolean>(false); // 值范围是否逻辑冲突

  useEffect(() => {
    // 输入值范围条件1、条件2、条件结合类型都输入完整时，检查逻辑是否冲突
    // console.log('watch', curFirstVal, curFirstComp, curSecondVal, curSecondComp, curJoinType);
    if (curFirstVal && curFirstComp && curSecondVal && curSecondComp && curJoinType === NUMBER_CHECK.And) {
      let isConf = false;
      // 大于、小于的表达计算式的校验
      if ((curFirstComp === NUMBER_CHECK.Larger && curSecondComp === NUMBER_CHECK.Less && curFirstVal >= curSecondVal) ||
        (curSecondComp === NUMBER_CHECK.Larger && curFirstComp === NUMBER_CHECK.Less && curSecondVal >= curFirstVal)) {
        isConf = true;
        // 等于、小于的表达计算式的校验
      } else if ((curFirstComp === NUMBER_CHECK.Equal && curSecondComp === NUMBER_CHECK.Less && curFirstVal >= curSecondVal) ||
        (curSecondComp === NUMBER_CHECK.Equal && curFirstComp === NUMBER_CHECK.Less && curSecondVal >= curFirstVal)) {
        isConf = true;
        // 等于、大于的表达计算式的校验
      } else if ((curFirstComp === NUMBER_CHECK.Equal && curSecondComp === NUMBER_CHECK.Larger && curSecondVal >= curFirstVal) ||
      (curSecondComp === NUMBER_CHECK.Equal && curFirstComp === NUMBER_CHECK.Larger && curFirstVal >= curSecondVal)) {
        isConf = true;
        // 等于、等于的表达计算式的校验
      } else if (curFirstComp === NUMBER_CHECK.Equal && curSecondComp === NUMBER_CHECK.Equal && curSecondVal !== curFirstVal) {
        isConf = true;
        // 大于等于、小于的表达计算式的校验
      } else if ((curFirstComp === NUMBER_CHECK.LargerOrEqual && curSecondComp === NUMBER_CHECK.Less && curSecondVal <= curFirstVal) ||
      (curSecondComp === NUMBER_CHECK.LargerOrEqual && curFirstComp === NUMBER_CHECK.Less && curFirstVal <= curSecondVal)) {
        isConf = true;
        // 大于等于、等于的表达计算式的校验
      } else if ((curFirstComp === NUMBER_CHECK.LargerOrEqual && curSecondComp === NUMBER_CHECK.Equal && curSecondVal < curFirstVal) ||
      (curSecondComp === NUMBER_CHECK.LargerOrEqual && curFirstComp === NUMBER_CHECK.Equal && curFirstVal < curSecondVal)) {
        isConf = true;
        // 小于等于、大于的表达计算式的校验
      } else if ((curFirstComp === NUMBER_CHECK.LessOrEqual && curSecondComp === NUMBER_CHECK.Larger && curSecondVal >= curFirstVal) ||
      (curSecondComp === NUMBER_CHECK.LessOrEqual && curFirstComp === NUMBER_CHECK.Larger && curFirstVal >= curSecondVal)) {
        isConf = true;
        // 小于等于、等于的表达计算式的校验
      } else if ((curFirstComp === NUMBER_CHECK.LessOrEqual && curSecondComp === NUMBER_CHECK.Equal && curSecondVal > curFirstVal) ||
      (curSecondComp === NUMBER_CHECK.LessOrEqual && curFirstComp === NUMBER_CHECK.Equal && curFirstVal > curSecondVal)) {
        isConf = true;
        // 小于等于、大于等于的表达计算式的校验
      } else if ((curFirstComp === NUMBER_CHECK.LessOrEqual && curSecondComp === NUMBER_CHECK.LargerOrEqual && curSecondVal > curFirstVal) ||
      (curSecondComp === NUMBER_CHECK.LessOrEqual && curFirstComp === NUMBER_CHECK.LargerOrEqual && curFirstVal > curSecondVal)) {
        isConf = true;
      }
      setConflict(isConf);
    } else {
      setConflict(false);
    }
    form.validateFields();
  }, [curFirstVal, curFirstComp, curSecondVal, curSecondComp, curJoinType]);

  /**
   * @description 是否展示字段提示输入框
   * @param useMemo
   * @return 勾选了
   */
  const showTipInput = useMemo(() => {
    return isArray(curCheckbox) && curCheckbox.includes(CHECKBOX_VALUE.ItemTip);
  }, [curCheckbox]);

  const { onCancel, onOk } = useMethods({
    onCancel() {
      setPropertyConfig({ ...propertyConfig, visible: false });
    },
    onOk() {
      form.validateFields().then((values: any) => {
        // console.log('validate values', values);
        // 格式化配置，form数据转约定格式
        const {
          checkbox: checkboxVal,
          itemTip,
          joinType,
          firstValue,
          firstComapre,
          secondValue,
          secondComapre,
        } = values;
        const isRedMark = isArray(checkboxVal) && checkboxVal.includes(CHECKBOX_VALUE.RedMark);
        const isItemTip = isArray(checkboxVal) && checkboxVal.includes(CHECKBOX_VALUE.ItemTip);
        const isPageTip = isArray(checkboxVal) && checkboxVal.includes(CHECKBOX_VALUE.PageTip);
        let redMarkConfig: any = {
          isRedMark,
          isItemTip,
          isPageTip,
          itemTip: isItemTip ? itemTip : null,
          joinType,
        };

        // 第一个限制值
        const hasFirstCondition = isNotEmpty(firstValue) && firstComapre;
        if (hasFirstCondition) {
          redMarkConfig = {
            ...redMarkConfig,
            firstValue,
            firstComapre,
          };
        }
        // 第二个限制值
        const hasSecondCondition = isNotEmpty(secondValue) && secondComapre;
        if (hasSecondCondition) {
          redMarkConfig = {
            ...redMarkConfig,
            secondValue,
            secondComapre,
          };
        }

        const params = {
          templateId,
          propertyConfigRequestList: [{
            ...propertyConfig,
            templateRestriction: isNotEmptyAny(values) ? JSON.stringify({ ...JSON.parse(templateRestriction || '{}'), redMark: redMarkConfig }) : JSON.stringify({})
          }]
        };
        // console.log('post params', redMarkConfig, params);
        const url = '/dynamic/property/update';
        post(url, params, { proxyApi: '/blaster', needHint: true }).then((success) => {
          message.success('编辑配置成功');
          if (success) {
            onCancel();
            onSearch();
          }
        });
      });
    },
  });

  useEffect(() => {
    if (!propertyConfig.visible) {
      form.resetFields();
      return;
    }

    // 展示字段名、识别符
    const { propertyName, identification } = propertyConfig;
    form.setFieldsValue({
      propertyName,
      identification
    });

    // 限制设置使用模板限制
    if (templateRestriction) {
      const restObj = JSON.parse(templateRestriction);
      if (isNotEmptyAny(restObj.redMark)) {
        // 格式化配置，form数据转约定格式
        const redMark = restObj.redMark;
        const formValues: any = {};

        const configArr: any[] = [];
        redMark.isRedMark && configArr.push(CHECKBOX_VALUE.RedMark);
        redMark.isItemTip && configArr.push(CHECKBOX_VALUE.ItemTip);
        redMark.isPageTip && configArr.push(CHECKBOX_VALUE.PageTip);

        formValues['checkbox'] = configArr;
        formValues['itemTip'] = redMark.itemTip;
        formValues['joinType'] = redMark.joinType;
        formValues['firstComapre'] = redMark.firstComapre;
        formValues['firstValue'] = redMark.firstValue;
        formValues['secondComapre'] = redMark.secondComapre;
        formValues['secondValue'] = redMark.secondValue;

        form.setFieldsValue(formValues);
      }
    }

    // eslint-disable-next-line
  }, [propertyConfig.visible]);

  const checkConflict = (_rule: any) => {
    if (conflict) {
      _rule.message = `输入值范围与其他设置有冲突，请检查`;
      return Promise.reject();
    }
    return Promise.resolve();
  };

  const onChangeJoinType = () => {
    form.validateFields();
  };

  return (
    <Modal title='标红设置' open={propertyConfig.visible} onOk={onOk} onCancel={onCancel} width={600}>
      <V2Form form={form} {...layout} layout='horizontal' className={styles.redMarkList}>
        <V2FormInput
          label='字段名称'
          name='propertyName'
          placeholder=''
          disabled
        />
        <V2FormInput
          label='属性标识'
          name='identification'
          placeholder=''
          disabled
        />
        <Form.Item label='规则配置'>
          <Row gutter={16}>
            <Col span={12}>
              <V2FormSelect
                label='输入值'
                name='firstComapre'
                options={compareOptions}
                placeholder='请选择'
                formItemConfig={{ colon: false }}
              />
            </Col>
            <Col span={10}>
              <V2FormInputNumber
                name='firstValue'
                formItemConfig={{ colon: false }}
              />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <V2FormSelect
                label='条件类型'
                name='joinType'
                options={joinTypeOptions}
                placeholder='请选择结合关系'
                formItemConfig={{ colon: false }}
                required={curFirstVal && curFirstComp && curSecondVal && curSecondComp}
                onChange={onChangeJoinType}
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <V2FormSelect
                label='输入值'
                name='secondComapre'
                options={compareOptions}
                placeholder='请选择'
                formItemConfig={{ colon: false }}
              />
            </Col>
            <Col span={10}>
              <V2FormInputNumber
                name='secondValue'
                formItemConfig={{ colon: false }}
                rules={[{ validator: checkConflict }]}
              />
            </Col>
          </Row>
          <Form.Item label='当满足上方规则时' />
          <V2FormCheckbox
            name='checkbox'
            options={[
              { label: '红色标记', value: CHECKBOX_VALUE.RedMark },
              { label: '显示字段提示语', value: CHECKBOX_VALUE.ItemTip },
              { label: '触发页面提示语', value: CHECKBOX_VALUE.PageTip },
            ]}
            formItemConfig={{ colon: false }}
          />
          {showTipInput ? <V2FormInput
            name='itemTip'
            placeholder='请输入字段提示语'
            maxLength={30}
            formItemConfig={{ colon: false }}
          /> : <></>}
        </Form.Item>
      </V2Form>
    </Modal>
  );
};
export default NumberRedMarkSet;
