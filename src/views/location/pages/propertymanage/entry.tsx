import Filter from './components/Filter';
import CategoryList from './components/CategoryList';
import cs from 'classnames';
import styles from './entry.module.less';
import { useState } from 'react';
import Operate from '@/common/components/Operate';
import { useMethods } from '@lhb/hook';
import { CategoryModalValuesProps, PropertyModalValuesProps } from './ts-config';
import CategoryOperate from './components/Modal/CategoryOperate';
import PropertyOperate from './components/Modal/PropertyOperate';
import { Form } from 'antd';
const PropertyManage = () => {
  const [searchForm] = Form.useForm();
  const [operateCategory, setOperateCategory] = useState<CategoryModalValuesProps>({
    visible: false,
  });
  const [operateProperty, setOperateProperty] = useState<PropertyModalValuesProps>({
    visible: false,
  });
  const [filter, setFilter] = useState<any>({});
  const onSearch = (values) => {
    // 为了让查询动态化
    const _params = searchForm.getFieldsValue();
    setFilter({
      ..._params,
      ...values,
    });
  };

  const [operateList, setOperateList] = useState<any>([]);

  const { ...methods } = useMethods({
    handleCreate() {
      setOperateCategory({ visible: true });
    },
  });

  return (
    <div className={cs(styles.container)}>
      <Filter onSearch={onSearch} searchForm={searchForm}/>
      <div style={{ marginBottom: '10px' }}>
        <Operate operateList={operateList} onClick={(btn) => methods[btn.func]()} />
      </div>
      <CategoryList
        filters={filter}
        setOperateList={setOperateList}
        setOperateCategory={setOperateCategory}
        setOperateProperty={setOperateProperty}
        onSearch={onSearch}
      />
      <CategoryOperate setOperateCategory={setOperateCategory} operateCategory={operateCategory} onSearch={onSearch} />
      <PropertyOperate setOperateProperty={setOperateProperty} operateProperty={operateProperty} onSearch={onSearch} />
    </div>
  );
};

export default PropertyManage;
