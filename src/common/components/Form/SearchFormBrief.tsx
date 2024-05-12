/* 内置搜索和重置的form */
import React, { useEffect, useImperativeHandle, useRef } from 'react';
import { Form, Button } from 'antd';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { SearchFormProps } from './ts-config';
import cs from 'classnames';
import { debounce, isArray } from '@lhb/func';
import styles from './index.module.less';
import FormUpload from './FormUpload';
import FormRadio from './FormRadio';
import FormCheckbox from './FormCheckbox';
import FormInput from './FormInput';
import FormProvinceList from '../FormBusiness/FormProvinceList';
import { useMethods } from '@lhb/hook';

const SearchFormBrief: React.FC<SearchFormProps> = ({
  onSearch,
  layout = 'inline',
  className,
  labelAlign = 'left',
  labelLength = 4,
  extra,
  onRef,
  onOkText,
  isFooterButtonLine = false,
  form, // 如果外部传入form则由外部传入form控制
  onFinish, // 如果需要对参数进行处理，则可通过传入onFinish函数来自行处理
  columns,
  onResetFn,
  actionRef: propsActionRef,
  setFilterData,
  otherSearchForm,
  ...props
}) => {
  const [searchForm] = Form.useForm();
  const actionRef = useRef<any>();

  const methods = useMethods({
    searchFormValuesChange(changedValues) {
      if (changedValues) { // 如果基础查询有变化，则重置高级查询
        setFilterData({ checkedList: [] });
      };
    }
  });
  // 外部组件清空form
  useImperativeHandle(onRef, () => ({
    resetFormFields: (isEmit: boolean) => {
      onReset(isEmit);
    },
  }));

  // 查询
  const onFinishSearch = () => {

    debounceSearch();
  };

  // 重置
  const onReset = (isEmit = true) => {
    if (!isEmit) return;
    onResetFn && onResetFn();
    (form || searchForm).resetFields();
  };

  /**
   * 获取表单的值
   * @returns 表单值数组
   */
  const getFieldsValue = () => (form || searchForm).getFieldsValue();

  // 查询添加防抖
  const debounceSearch = debounce(() => {
    const values = getFieldsValue();
    onSearch && onSearch(values);
  }, 600);

  // 组件渲染
  const componentRender = () => {
    return isArray(columns) && columns.map((item, index) => {
      if (item.custom) {
        return item.custom(index);
      } else {
        switch (item.type) {
          case 'input':
            return <FormInput key={index} {...item} />;
          case 'image':
            return <FormUpload key={index} {...item} />;
          case 'radio':
            return <FormRadio key={index} {...item}/>;
          case 'city':
            return <FormProvinceList key={index} {...item} type={1} />;
          case 'checkbox':
            return <FormCheckbox key={index} {...item} />;
          default:
            return '';
        }
      }

    });

  };

  useEffect(() => {
    if (typeof propsActionRef === 'function' && actionRef.current) {
      propsActionRef(actionRef.current);
    }
  }, [propsActionRef]);

  /** 绑定 action */
  actionRef.current = {
    getFieldsValue,
  };
  if (propsActionRef) {
    propsActionRef.current = actionRef.current;
  }

  return (
    <Form
      {...props}
      className={cs(styles.formSearch, labelLength ? styles[`searchLabel${labelLength}`] : null, className)}
      form={form || searchForm}
      layout={layout}
      labelAlign={labelAlign}
      onFinish={onFinish || onFinishSearch}
      onValuesChange={methods.searchFormValuesChange}
    >
      {componentRender()}
      {/* 产品说放在这里，虚拟项目与其他标签不同，需要单独处理 */}
      {otherSearchForm?.()}
      {/* { props.status === 0 && <FormCheckbox name={'independentSpot'} label='虚拟项目' config={{ options: [{ value: 1, label: '显示' }] }}/>} */}
      <Form.Item noStyle={!isFooterButtonLine} style={{ width: '100%' }}>
        <div>
          <Button type='primary' icon={<SearchOutlined />} htmlType='submit'>
            {onOkText || '查询'}
          </Button>
          <Button style={{ marginLeft: '10px' }} icon={<ReloadOutlined />} onClick={() => onReset()}>
            重置
          </Button>
          {extra}
        </div>
      </Form.Item>
    </Form>
  );
};

export default SearchFormBrief;
