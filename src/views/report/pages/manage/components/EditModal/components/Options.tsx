/* 数据项 */
import React, { useState, useEffect, useMemo } from 'react';
import FormCascader from '@/common/components/Form/FormCascader';
import { getReportTempOptions } from '@/common/api/report';
import { ChangeOptionsProps, OptionsInfoType } from '../../../ts-config';

const Options: React.FC<ChangeOptionsProps> = ({ onChange }) => {

  const [options, setOptions] = useState<any[]>([]);

  useEffect(() => {
    getReportTempOptions({}).then((data) => {
      if (Array.isArray(data)) {
        setOptions(data);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 选项名称信息
  // [
  //   {
  //     name:'一级名1',
  //     childrenNames:['1-1','1-2','1-3']
  //   },
  //   ...
  // ]
  const infos: OptionsInfoType[] = useMemo(() => {
    return options.map(itm => {
      return {
        name: itm.name,
        childrenNames: itm.children.map(child => child.name)
      };
    });
  }, [options]);

  // 一级选项的名称数组
  const levelOnes: string[] = useMemo(() => {
    return options.map(itm => itm.name);
  }, [options]);

  // 选择变动事件
  const handleChange = (value: any) => {
    // 整理出符合提交接口格式的选中列表
    const values: any[] = [];

    value.forEach(ele => {
      // 遍历选中结果
      if (Array.isArray(ele) && ele.length) {
        const parentName = ele[0];
        if (ele.length === 2) {
          // 选中的是子节点，直接添加子节点
          if (!values.includes(ele[1])) {
            values.push(ele[1]);
          }
        } else if (ele.length === 1 && levelOnes.includes(parentName)) {
          // 选中的是父节点
          const arr: OptionsInfoType[] = infos.filter(itm => itm.name === parentName);
          if (arr.length) {
            arr[0].childrenNames.forEach(itm => {
              // 逐个添加该父节点下的所有子节点
              if (!values.includes(itm)) {
                values.push(itm);
              }
            });
          }
        }
      }
    });
    onChange(values);
  };

  return (
    <FormCascader
      name='optionList'
      label='数据项'
      options={ options }
      placeholder='请选择数据项'
      rules={[
        { required: true, message: '请选择数据项' }
      ]}
      config={{
        multiple: true,
        maxTagCount: 'responsive',
        fieldNames: {
          label: 'name',
          value: 'name',
          children: 'children',
        },
        onChange: handleChange
      }}
    >
    </FormCascader>
  );
};

export default Options;
