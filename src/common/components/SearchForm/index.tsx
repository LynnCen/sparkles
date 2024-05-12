/* 内置搜索和重置的form */
import React, { ReactNode, useImperativeHandle, useState } from 'react';
import { Form, Button } from 'antd';
import styles from './index.module.less';
import { DownOutlined, ReloadOutlined, UpOutlined } from '@ant-design/icons';
import cs from 'classnames';
import { FormProps } from 'antd/es/form/Form';

// 带搜索和重置按钮的form
export interface SearchFormProps extends FormProps {
  onSearch?: Function; // 确定
  className?: string;
  moreBtn?: boolean; // 是否显示更多筛选按钮
  labelLength?: number;
  showSearchNum?: number; // 显示搜索框数量
  extra?: ReactNode; // 可传入额外的操作
  rightOperate?: ReactNode; // 可传入右侧按钮组
  rightOperatePlace?:string; // 可传入右侧按钮位置
  onRef?: any;
  onOkText?: string; // 查询按钮的问题-默认为查询
  needSelfOperate?: boolean; // 是否需要查询和重置按钮
  children?: ReactNode;
}

const SearchForm: React.FC<SearchFormProps> = ({
  onSearch,
  children,
  layout = 'inline',
  className,
  labelAlign = 'right',
  labelLength = 4,
  showSearchNum = 6,
  moreBtn = true,
  extra,
  rightOperate,
  rightOperatePlace = 'top',
  onRef,
  onOkText,
  needSelfOperate = true,
  form, // 如果外部传入form则由外部传入form控制
  onFinish, // 如果需要对参数进行处理，则可通过传入onFinish函数来自行处理
  ...props
}) => {
  const [searchForm] = Form.useForm();
  const [toggleBtnData, setToggleBtnData] = useState<any>({
    open: false
  });

  // 外部组件清空form
  useImperativeHandle(onRef, () => ({
    resetFormFields: (isEmit: boolean) => {
      onReset(isEmit);
    },
    getFieldsValue() {
      return (form || searchForm).getFieldsValue();
    },
    setFieldsValue(value) {
      (form || searchForm).setFieldsValue(value);
    }
  }));

  // 查询
  const onFinishSearch = () => {
    doSearch();
  };

  // 重置
  const onReset = (isEmit = true) => {
    (form || searchForm).resetFields();
    if (!isEmit) return;
    doSearch();
  };

  // 查询添加防抖
  const doSearch = () => {
    const values = (form || searchForm).getFieldsValue();
    onSearch && onSearch(values);
  };

  // 更多塞选切换
  const toggleBtn = () => {
    setToggleBtnData({
      open: !toggleBtnData.open
    });
  };

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
        {
          React.Children.map(children, (child, index) => {
            if (index < showSearchNum || toggleBtnData.open) {
              return React.cloneElement(child as React.ReactElement, {
                form: form || searchForm,
                key: index,
              });
            } else {
              return;
            }
          })
        }
        {
          needSelfOperate && <Form.Item noStyle>
            <div>
              {moreBtn && <Button type='link' onClick={toggleBtn}>{toggleBtnData.open
                ? <span className='color-primary fs-14'>收起 <UpOutlined className='fs-12'/></span> : <span className='color-primary fs-14'>更多筛选 <DownOutlined className='fs-12'/></span> }
              </Button>}
              <Button type='primary' htmlType='submit' className={styles.okBtn}>
                {onOkText || '查询'}
              </Button>
              <Button
                className={styles.resetBtn}
                type='link'
                icon={<ReloadOutlined />}
                onClick={() => { onReset(); (props as any).onReset?.(); }}
              >重置</Button>
              {extra}
            </div>
          </Form.Item>
        }
      </Form>
      <div className={cs(styles[`rightOperate-${rightOperatePlace}`])}>
        {rightOperate}
      </div>
    </div>
  );
};

export default SearchForm;
