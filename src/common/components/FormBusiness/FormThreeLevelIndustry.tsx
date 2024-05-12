/*
  支持三级行业选择
  参照组件FormCascaderIndustry实现，替换了请求接口
*/
import { FC, useEffect, useState } from 'react';
import cs from 'classnames';
import styles from '@/common/components/Form/V2FormCascader/index.module.less';
import { Cascader, Form } from 'antd';
import { DefaultFormItemProps } from '@/common/components/Form/ts-config';
import { industryList } from '@/common/api/brand-center';

export interface FormThreeLevelIndustryProps {
  form?: any;
  placeholder?: string;
  allowClear?: boolean;
  config?: any;
  finallyData?: Function; // 取出获取到数据
  onChange?: Function;
  className?: string;
  popupClassName?: string;
  twoLevel?:boolean;// 是否只显示二级
}

const FormThreeLevelIndustry: FC<FormThreeLevelIndustryProps & DefaultFormItemProps> = ({
  name,
  label,
  rules,
  placeholder,
  allowClear = false,
  formItemConfig = {},
  config = {},
  finallyData,
  onChange,
  className,
  popupClassName,
  twoLevel = false,
}) => {
  const [industryOptions, setIndustryOptions] = useState<any[]>([]);

  const industriesList = async () => {
    const data = await industryList();
    if (Array.isArray(data)) {
      finallyData && finallyData(data);
      let _data = data;
      if (twoLevel) {
        _data = data?.map((item) => {
          return {
            ...item,
            children: item.children.map((child) => {
              return {
                ...child,
                children: [],
              };
            })
          };
        });
      }
      setIndustryOptions(_data);
    }
  };

  useEffect(() => {
    industriesList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Form.Item
        name={name}
        label={label}
        rules={rules}
        {...formItemConfig}
        className={cs(styles.V2FormCascader, 'v2FormCascader', className)}>
        <Cascader
          allowClear={allowClear}
          placeholder={placeholder}
          options={industryOptions}
          fieldNames={{
            label: 'name',
            value: 'id'
          }}
          onChange={onChange}
          popupClassName={cs(styles.V2FormCascaderPopup, 'v2FormCascaderPopup', [
            config?.multiple ? styles.V2FormCascaderMultiple : styles.V2FormCascaderSingle
          ], popupClassName)}
          {...config}/>
      </Form.Item>
    </>
  );
};

export default FormThreeLevelIndustry;
