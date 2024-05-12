/**
 * @Description 员工模糊查询
 */

import { FC, useState, useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Form } from 'antd';
import V2Fuzzy from '@/common/components/Form/V2Fuzzy';
import { userPermissionList } from '@/common/api/brief';

const FormSearchUser: FC<any> = forwardRef(
  (
    {
      name,
      label,
      extraParams = {
        // 接口入参
        page: 1,
        size: 50,
      },
      formItemConfig,
      departmentIds,
      ...props
    },
    ref
  ) => {
    const fuzzyRef: any = useRef(null);
    const [data, setData] = useState();
    const [immediateOnce, setImmediateOnce] = useState<boolean>(true);

    const loadData = async (keyword?: string) => {
      const params = {
        name: keyword,
        ...extraParams,
      };
      if (departmentIds?.length) {
        params.departmentIds = departmentIds;
      }
      // 该接口目前不分页
      const { objectList } = await userPermissionList(params);
      setData(objectList);
      return Promise.resolve(objectList);
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
      getItem: (data) => fuzzyRef.current?.getItem(data),
    }));

    const customerProps = {
      customOptionItem: (item: Record<string, any>) => {
        const { name, uniqueId } = item;
        return (
          <>
            {<span>{name || ''}</span>}
            <span> {uniqueId ? ` | ${uniqueId}` : ''}</span>
          </>
        );
      },
      optionLabelProp: 'label', // ant select的参数，请参考 https://ant.design/components/select-cn#select-props
    };

    useEffect(() => {
      setImmediateOnce(false);
      setTimeout(() => { // 防止react合并setImmediateOnce操作
        setImmediateOnce(true);
      }, 0);
    }, [departmentIds]);

    return (
      <>
        <Form.Item name={name} label={label} {...formItemConfig}>
          <V2Fuzzy
            ref={fuzzyRef}
            loadData={loadData}
            fieldNames={{
              label: 'name',
              value: 'id',
            }}
            immediateOnce={immediateOnce}
            {...customerProps}
            {...props}
          />
        </Form.Item>
      </>
    );
  }
);

export default FormSearchUser;
