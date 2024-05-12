/**
 * @Description 单选/多选型的标红设置
 *
 * 设置后，向单选/多选类型的property的 templateRestriction 的json中添加 redMark字段，值为对象数组
 * {"redMark":[{"optionId":1960,"isRedMark":true,"isItemTip":true,"isPageTip":true,"itemTip":"aa"},{"optionId":1961,"isRedMark":false,"isItemTip":true,"isPageTip":false,"itemTip":"bb"}]}
 *
 */
import { useMethods } from '@lhb/hook';
import { post } from '@/common/request';
import { Form, message, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { isArray, isNotEmptyAny } from '@lhb/func';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2Form from '@/common/components/Form/V2Form';
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

const SelectRedMarkSet: React.FC<any> = ({
  propertyConfig,
  setPropertyConfig,
  onSearch,
  templateId
}) => {
  const { templateRestriction } = propertyConfig;
  const [form] = Form.useForm();
  const [tipOptionIds, setTipOptionIds] = useState<number[]>([]); // 显示字段提示语的所有option的ids

  const { onCancel, onOk } = useMethods({
    onCancel() {
      setPropertyConfig({ ...propertyConfig, visible: false });
    },
    onOk() {
      form.validateFields().then((values: any) => {
        console.log('validated values', values);

        // 格式化配置，form数据转约定格式
        const postValues: any[] = [];
        if (isArray(propertyConfig.propertyConfigOptionVOList)) {
          propertyConfig.propertyConfigOptionVOList.forEach((opt: any) => {
            const checkboxVal = form.getFieldValue(`${opt.id}`);
            const itemTip = form.getFieldValue(`${opt.id}-tip`);

            const isRedMark = isArray(checkboxVal) && checkboxVal.includes(CHECKBOX_VALUE.RedMark);
            const isItemTip = isArray(checkboxVal) && checkboxVal.includes(CHECKBOX_VALUE.ItemTip);
            const isPageTip = isArray(checkboxVal) && checkboxVal.includes(CHECKBOX_VALUE.PageTip);
            const optConfig = {
              optionId: opt.id,
              isRedMark,
              isItemTip,
              isPageTip,
              itemTip: isItemTip ? itemTip : null,
            };
            postValues.push(optConfig);
          });
        }
        // console.log('postValues', postValues);

        const params = {
          templateId,
          propertyConfigRequestList: [{
            ...propertyConfig,
            templateRestriction: isNotEmptyAny(values) ? JSON.stringify({ ...JSON.parse(templateRestriction || '{}'), redMark: postValues }) : JSON.stringify({})
          }]
        };
        // console.log('post params', templateRestriction, params);
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
      setTipOptionIds([]);
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
      // console.log('restObj', restObj);
      if (isArray(restObj.redMark) && isArray(propertyConfig.propertyConfigOptionVOList)) {
        // 格式化配置，form数据转约定格式
        const redMark = restObj.redMark;
        const formValues: any = {};

        const optionIds: number[] = [];
        propertyConfig.propertyConfigOptionVOList.forEach(option => {
          const tmpConfg = redMark.find(itm => itm.optionId === option.id);
          if (tmpConfg) {
            const configArr: any[] = [];
            tmpConfg.isRedMark && configArr.push(CHECKBOX_VALUE.RedMark);
            tmpConfg.isItemTip && configArr.push(CHECKBOX_VALUE.ItemTip);
            tmpConfg.isPageTip && configArr.push(CHECKBOX_VALUE.PageTip);

            formValues[`${option.id}`] = configArr;
            formValues[`${option.id}-tip`] = tmpConfg.itemTip;

            tmpConfg.isItemTip && optionIds.push(option.id);
          }
        });
        // console.log('formValues', formValues);
        form.setFieldsValue(formValues);
        setTipOptionIds(optionIds);
      }
    }

    // eslint-disable-next-line
  }, [propertyConfig.visible]);

  /**
   * @description 是否展示字段提示输入框
   * @param useMemo
   * @return 勾选了
   */
  const onValuesChange = (changedValues: any, allValues: any) => {
    const ids: number[] = [];
    propertyConfig.propertyConfigOptionVOList.forEach(option => {
      const checkVal = allValues[option.id];
      if (isArray(checkVal) && checkVal.includes(CHECKBOX_VALUE.ItemTip)) {
        ids.push(option.id);
      }
    });
    setTipOptionIds(ids);
  };

  return (
    <Modal title='标红设置' open={propertyConfig.visible} onOk={onOk} onCancel={onCancel} width={600}>
      <V2Form form={form} {...layout} layout='horizontal' className={styles.redMarkList} onValuesChange={onValuesChange}>
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
        <Form.Item label='选项配置'/>
        {
          isArray(propertyConfig.propertyConfigOptionVOList)
            ? propertyConfig.propertyConfigOptionVOList.map(option => (
              <div key={option.id}>
                <V2FormCheckbox
                  label={option.name}
                  name={`${option.id}`}
                  options={[
                    { label: '红色标记', value: CHECKBOX_VALUE.RedMark },
                    { label: '显示字段提示语', value: CHECKBOX_VALUE.ItemTip },
                    { label: '触发页面提示语', value: CHECKBOX_VALUE.PageTip },
                  ]}
                  formItemConfig={{
                    colon: false
                  }}
                />
                { isArray(tipOptionIds) && tipOptionIds.includes(option.id) ? <V2FormInput
                  label=' '
                  name={`${option.id}-tip`}
                  placeholder='请输入字段提示语'
                  maxLength={30}
                  formItemConfig={{
                    colon: false
                  }}/> : <></> }
              </div>
            )) : <></>
        }
      </V2Form>
    </Modal>
  );
};
export default SelectRedMarkSet;
