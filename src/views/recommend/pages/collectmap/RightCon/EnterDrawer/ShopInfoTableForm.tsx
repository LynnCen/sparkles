/**
 * @Description 店铺信息
 */

import V2Table, { V2TableHandles } from '@/common/components/Data/V2Table';
import V2Title from '@/common/components/Feedback/V2Title';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import { useMethods } from '@lhb/hook';
import { Button } from 'antd';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import styles from './index.module.less';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { TEL_REG } from '@lhb/regexp';

const defaultData = {
  number: '',
  name: '',
  dailyExpect: '',
  index: '0'
};

const CompareTableForm = ({ keyName, tableFormLength, setTableFormLength }) => {
  const tableRef: MutableRefObject<V2TableHandles | null> = useRef(null);
  const [tableFormData, setTableFormData] = useState<any>([defaultData]);
  const [filters, setFilters] = useState<any>({});
  const tableFormKey = useRef<number>(0);
  const [isInit, setInit] = useState(false);

  useEffect(() => {
    if (!isInit && tableFormLength[keyName]?.landlords) {
      methods.setDefaultData();
    }
  }, [tableFormLength[keyName]?.landlords, isInit]);

  const defaultColumns = [
    { key: 'number', title: '店铺数', width: 100, render(_, __, index) {
      return <span>店铺{ index + 1 }</span>;
    } },
    { key: 'landlordShopName', title: <div><span className='c-f53'>*</span>店铺名称</div>, render(_, record) {
      return <V2FormInput
        className={styles.formInputStyle}
        rules={[{ required: true, message: '请输入店铺名称' }]}
        name={[keyName, 'landlords', record.index, 'landlordShopName']} maxLength={32}
      />;
    } },
    { key: 'landlordName', title: <div><span className='c-f53'>*</span>房东姓名</div>, render(_, record) {
      return <V2FormInput
        className={styles.formInputStyle}
        rules={[{ required: true, message: '请输入房东姓名' }]}
        name={[keyName, 'landlords', record.index, 'landlordName']}
        maxLength={16}
      />;
    } },
    { key: 'landlordMobile', title: <div><span className='c-f53'>*</span>房东电话</div>, render(_, record) {
      return <V2FormInput
        className={styles.formInputStyle}
        name={[keyName, 'landlords', record.index, 'landlordMobile']}
        maxLength={16}
        rules={[{ required: true, message: '请输入房东电话' }, { pattern: TEL_REG, message: '电话号码格式错误' }]}
      />;
    } },
    { key: 'operate', title: '操作', width: 100, render(_, __, index) {
      return <Button type='link' className={styles.deleteBtn} onClick={() => methods.deleteFormItem(index)}>删除</Button>;
    } },
  ];

  const methods = useMethods({
    /**
     * @description 初始化tab中表格的长度数据
     */
    setDefaultData() {
      const newTableFormData: any = [];
      for (let i = 0; i < tableFormLength[keyName]?.landlords || 0; i++) {
        const newKey = `${tableFormKey.current++}`;
        newTableFormData.push({ ...defaultData, index: newKey });
      }
      setTableFormData(newTableFormData);
      setFilters({ ...filters });
      setInit(true);
    },
    loadData() {
      return {
        dataSource: [...tableFormData],
        count: tableFormData.length,
      };
    },
    addFormItem() {
      if (tableFormData?.length >= 10) {
        V2Message.warning('最多添加10个店铺');
        return;
      }
      if (tableFormKey.current === 0) {
        tableFormKey.current++;
      }
      setInit(true);
      const newKey = `${tableFormKey.current++}`;
      setTableFormData([...tableFormData, { ...defaultData, index: newKey }]);
      setTableFormLength({ ...tableFormLength, [keyName]: { ...tableFormLength[keyName], landlords: tableFormLength[keyName]?.landlords + 1 } });
      setFilters({ ...filters });
    },
    deleteFormItem(index) {
      if (tableFormData.length === 1) {
        V2Message.warning('最少需要保留一个店铺');
        return;
      }
      setInit(true);
      tableFormData.splice(index, 1);
      setTableFormData([...tableFormData]);
      setTableFormLength({ ...tableFormLength, [keyName]: { ...tableFormLength[keyName], landlords: tableFormLength[keyName]?.landlords - 1 } });
      setFilters({ ...filters });
    },
  });

  return (
    <div className={styles.shopInfoTableFormWrap}>
      <V2Title type='H2' className='mt-16 mb-12' divider text='店铺信息' extra={<Button type='link' onClick={methods.addFormItem}>添加</Button>} />
      <V2Table
        rowKey='index'
        defaultColumns={defaultColumns}
        filters={filters}
        onFetch={methods.loadData}
        pagination={false}
        inv2form
        hideColumnPlaceholder
        ref={tableRef}
      />
    </div>
  );
};


export default CompareTableForm;
