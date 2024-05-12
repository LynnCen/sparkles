/**
 * @Description 竞品分析
 */

import V2Table, { V2TableHandles } from '@/common/components/Data/V2Table';
import V2Title from '@/common/components/Feedback/V2Title';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormInputNumber from '@/common/components/Form/V2FormInputNumber/V2FormInputNumber';
import { useMethods } from '@lhb/hook';
import { Button } from 'antd';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import styles from './index.module.less';
import V2Message from '@/common/components/Others/V2Hint/V2Message';

const defaultData = {
  number: '',
  competitorName: '',
  aveEstimatedSale: '',
  index: '0'
};

const CompareTableForm = ({ keyName, tableFormLength, setTableFormLength }) => {
  const tableRef: MutableRefObject<V2TableHandles | null> = useRef(null);
  const [tableFormData, setTableFormData] = useState<any>([defaultData]);
  const [filters, setFilters] = useState<any>({});
  const tableFormKey = useRef<number>(0);
  const [isInit, setInit] = useState(false);

  useEffect(() => {
    if (!isInit && tableFormLength[keyName]?.competitors) {
      methods.setDefaultData();
    }
  }, [tableFormLength[keyName]?.competitors, isInit]);

  const defaultColumns = [
    { key: 'number', title: '竞品数', width: 100, render(_, __, index) {
      return <span>竞品{ index + 1 }</span>;
    } },
    { key: 'competitorName', title: <div><span className='c-f53'>*</span>竞品名称</div>, render(_, record) {
      return <V2FormInput
        className={styles.formInputStyle}
        rules={[{ required: true, message: '请输入竞品名称' }]}
        name={[keyName, 'competitors', record.index, 'competitorName']} maxLength={32}
      />;
    } },
    { key: 'aveEstimatedSale', title: <div><span className='c-f53'>*</span>日均预估</div>, render(_, record) {
      return <V2FormInputNumber
        className={styles.formInputStyle}
        rules={[{ required: true, message: '请输入日均预估' }]}
        name={[keyName, 'competitors', record.index, 'aveEstimatedSale']} config={{ addonAfter: '元' }}
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
      for (let i = 0; i < tableFormLength[keyName]?.competitors || 0; i++) {
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
        V2Message.warning('最多添加10个竞品');
        return;
      }
      if (tableFormKey.current === 0) {
        tableFormKey.current++;
      }
      setInit(true);
      const newKey = `${tableFormKey.current++}`;
      setTableFormData([...tableFormData, { ...defaultData, index: newKey }]);
      setTableFormLength({ ...tableFormLength, [keyName]: { ...tableFormLength[keyName], competitors: tableFormLength[keyName]?.competitors + 1 } });
      setFilters({ ...filters });
    },
    deleteFormItem(index) {
      if (tableFormData.length === 1) {
        V2Message.warning('最少需要保留一个竞品');
        return;
      }
      setInit(true);
      tableFormData.splice(index, 1);
      setTableFormData([...tableFormData]);
      setTableFormLength({ ...tableFormLength, [keyName]: { ...tableFormLength[keyName], competitors: tableFormLength[keyName]?.competitors - 1 } });
      setFilters({ ...filters });
    },
  });

  return (
    <div className={styles.compareTableFormWrap}>
      <V2Title type='H2' className='mt-16 mb-12' divider text='竞品分析' extra={<Button type='link' onClick={methods.addFormItem}>添加</Button>} />
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
