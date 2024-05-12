import React, { MutableRefObject, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import Fuzzy, { FuzzyHandles } from 'src/common/components/Form/Fuzzy/Fuzzy';
import { post } from '@/common/request/index';
import { Form } from 'antd';

export interface ModuleDemo1Handles {
  /**
   * @description options源数据
   */
  getData: () => any[] | undefined;
  /**
   * @description 往当前options插入一个option
   */
  addOption: ((item: any) => void) | undefined;
  /**
   * @description 插入一组默认的options
   */
  setOptions: ((options: any[], setInSelect?: boolean) => void) | undefined;
  /**
   * @description 底层ant-select的dom节点
   */
  selectRef: any;
  /**
   * @description 提供给父级，根据传入 id/ids 获取选中项；父级使用 getItem: (data) => fuzzyRef.current.getItem(data)
   */
  getItem: (data: any) => any;
  /**
   * @description label 标签的文本
   */
  label?: React.ReactNode;
  placeholder?: string;
}

// 跟进人模糊搜索
const FollowerList: React.FC<any> = forwardRef(({
  name,
  extraParams = {}, // 额外的传参
  label,
  placeholder = `请选择${label || ''}`,
  width = '100%',
  formItemConfig = {},
  ...props
}, ref) => {
  const fuzzyRef: MutableRefObject<FuzzyHandles | null> = useRef(null);
  const [data, setData] = useState();

  const loadData = async (keyword?: string) => {
    const params = {
      keyword,
      size: 20,
      ...extraParams
    };
    const data = await post('/employee/search', params, {
      needCancel: false,
      needHint: true,
      proxyApi: '/mirage'
    });
    setData(data);
    return Promise.resolve(data || []);
  };

  useImperativeHandle(ref, () => ({
    // 用来对外抛出完整的原始数据，当外部需要的不仅是id，而是更多item内的数据时使用
    // 场景示例：外部包了一层FormCom 组件，在onCHange时，通过getData拿到数据，然后包装好后，可以传出 {id: 1, name: xx, mobile: yy, ...} 等完整item数据。
    getData() {
      return data;
    },
    // 用来插入额外的option
    // 场景示例：点位弹窗，点击新增点位后，为了不让fuzzy重新loadData数据，可以直接 add一条新添加的数据进去即可。下次查询操作后就会被重置。
    addOption: fuzzyRef.current?.addOption,
    // 用来插入默认的options，此时需要设置props.immediateOnce 为 false
    // 场景示例：在编辑弹窗反向填充
    setOptions: fuzzyRef.current?.setOptions,
    selectRef: fuzzyRef.current?.selectRef,
    getItem: (data) => fuzzyRef.current?.getItem(data)
  }));

  return (
    <Form.Item name={name} label={label} {...formItemConfig}>
      <Fuzzy
        ref={fuzzyRef}
        loadData={loadData}
        fieldNames={{
          label: 'name',
          value: 'id',
        }}
        style={{ width: width }}
        placeholder={placeholder}
        {...props}
      />
    </Form.Item>
  );
});

export default FollowerList;
