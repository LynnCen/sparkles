/* 内置搜索和重置的form */
import React, { useImperativeHandle } from 'react';
import { Form, Button } from 'antd';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { SearchFormProps } from './ts-config';
import cs from 'classnames';
import { debounce } from '@lhb/func';
import styles from './index.module.less';

export interface SearchFormHandles {
  /**
   * @description 重置
   */
  resetFormFields: (isEmit: boolean) => void;
}
const SearchForm: React.FC<SearchFormProps> = ({
  onSearch,
  children,
  layout = 'inline',
  className,
  labelAlign = 'left',
  labelLength = 4,
  extra,
  onRef,
  rightOperate,
  onOkText,
  isFooterButtonLine = false,
  form, // 如果外部传入form则由外部传入form控制
  onFinish, // 如果需要对参数进行处理，则可通过传入onFinish函数来自行处理
  needResetButton = true,
  ...props
}) => {
  const [searchForm] = Form.useForm();

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
    (form || searchForm).resetFields();
    debounceSearch();
  };

  // 查询添加防抖
  const debounceSearch = debounce(() => {
    const values = (form || searchForm).getFieldsValue();
    onSearch && onSearch(values);
  }, 600);

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Form
        {...props}
        className={cs(styles.formSearch, styles[`searchLabel${labelLength}`], className)}
        form={form || searchForm}
        layout={layout}
        labelAlign={labelAlign}
        onFinish={onFinish || onFinishSearch}
      >
        {children}
        <Form.Item noStyle={!isFooterButtonLine} style={{ width: '100%' }}>
          <div className='buttonWrapper'>
            <Button type='primary' icon={<SearchOutlined />} htmlType='submit'>
              {onOkText || '查询'}
            </Button>
            {
              needResetButton ? <Button style={{ marginLeft: '10px' }} icon={<ReloadOutlined />} onClick={() => onReset()}>
              重置
              </Button> : <></>
            }
            {extra}
          </div>
        </Form.Item>
      </Form>
      <div>
        {rightOperate}
      </div>
    </div>
  );
};

export default SearchForm;
