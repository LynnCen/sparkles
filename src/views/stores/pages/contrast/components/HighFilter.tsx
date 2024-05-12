/** 高级筛选 */
import { FC, Key, useEffect, useState } from 'react';
import { Modal, Form, message, Button } from 'antd';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormProvinceList from '@/common/components/Form/V2FormProvinceList';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormDatePicker from '@/common/components/Form/V2FormDatePicker/V2FormDatePicker';
import SearchForm from '@/common/components/Form/SearchForm';
import Table from '@/common/components/FilterTable';
import { storesList } from '@/common/api/common';
import { storeSelection } from '@/common/api/store';
import { gatherMethods } from '@lhb/func';
import styles from './index.module.less';
import dayjs from 'dayjs';
import { refactorSelection } from '@/common/utils/ways';

interface IProps {
  visible: boolean;
  checkStoreIds: any[];
  onOk: (type?: string, list?: any[]) => void;
}

const columns = [
  { key: 'name', title: '店铺名称', width: 200, fixed: true },
  { key: 'number', title: '店铺编号', width: 100 },
  { key: 'statusName', title: '营运状态', width: 100 },
  { key: 'startDate', title: '开始日期', width: 120 },
  { key: 'endDate', title: '结束日期', width: 120, render: (value) => value || '-' },
  { key: 'boothAddress', title: '营运地址', width: 220, render: (value) => value || '-' },
];

const HighFilter: FC<IProps> = ({ visible, onOk, checkStoreIds }) => {
  const [form] = Form.useForm();
  const [filterParams, setFilterParams] = useState<{ [propname: string]: any }>({});
  const [checkStores, setCheckStores] = useState<{ ids: Key[]; stores: any[] }>({ ids: [], stores: [] });
  const [selectOptions, setSelectOptions] = useState<{ status: any[]; category: any[]; type: any[] }>({
    status: [],
    category: [],
    type: [],
  });

  useEffect(() => {
    const loadData = async () => {
      const result = await storeSelection();
      setSelectOptions({ status: result?.status || [], category: result?.category || [], type: result.type || [] });
    };
    loadData();
  }, []);

  useEffect(() => {
    if (visible) {
      const arr = checkStoreIds.map((item) => item.id);
      setCheckStores({ ids: arr, stores: checkStoreIds });
    }
  }, [checkStoreIds, visible]);

  const submitHandle = () => {
    if (checkStores.ids.length > 10) {
      message.error('最多选择10个门店进行对比');
      return;
    }
    onOk('ok', checkStores.stores);
  };

  const onClose = () => {
    onOk();
  };

  const loadData = async (params) => {
    const data = await storesList(params);
    return { dataSource: data };
  };

  // 多选
  const rowSelection = {
    onSelect: (record: any, selected: boolean) => {
      const ids = checkStores.ids.slice();
      const rows = checkStores.stores.slice();
      if (selected) {
        ids.push(record.id);
        rows.push(record);
      } else {
        const targetIndex = ids.findIndex((item) => item === record.id);
        ids.splice(targetIndex, 1);
        rows.splice(targetIndex, 1);
      }
      if (ids.length > 10) {
        message.warn('最多选择10个门店进行对比');
        return;
      }
      setCheckStores({ ids, stores: rows });
    },
    onSelectAll: (selected: boolean, selectedRows: any[], changeRows: any[]) => {
      let ids: number[] = [];
      let rows: any[] = [];
      const checkIds = checkStores.ids.slice();
      const stores = checkStores.stores.slice().concat(changeRows);
      const changeIds = changeRows.map((item) => item.id);
      if (selected) {
        ids = gatherMethods(checkIds, changeIds, 0);
        if (ids.length > 10) {
          message.warn('最多选择10个门店进行对比');
          return;
        }
      } else {
        ids = gatherMethods(checkIds, changeIds, 2);
      }
      rows = ids.map((item) => {
        const target = stores.find((store) => store.id === item);
        return { ...target };
      });
      setCheckStores({ ids, stores: rows });
    },
  };

  const onChangeFilter = (value: any) => {
    const params = {
      ...value,
      provinceId: value?.pcdIds ? value.pcdIds[0] : '',
      cityId: value?.pcdIds ? value.pcdIds[1] : '',
      districtId: value?.pcdIds ? value.pcdIds[2] : '',
      startDate: value.startDate && dayjs(value.startDate).format('YYYY-MM-DD'),
      endDate: value.endDate && dayjs(value.endDate).format('YYYY-MM-DD'),
    };
    delete params.pcdIds;
    setFilterParams(params);
  };

  return (
    <Modal
      className={styles.highSearch}
      width={800}
      title='高级筛选'
      open={visible}
      onOk={submitHandle}
      onCancel={onClose}
      centered
    >
      <SearchForm labelLength={5} form={form} onSearch={onChangeFilter}>
        <V2FormInput label='店铺名称' name='keyword' />
        <V2FormProvinceList label='省市区' name='pcdIds' />
        <V2FormSelect label='场地类型' name='categoryId' options={refactorSelection(selectOptions.category)}/>
        <V2FormSelect label='店铺类型' name='storeType' options={refactorSelection(selectOptions.type)}/>
        <V2FormSelect label='营运状态' name='status' options={refactorSelection(selectOptions.status)}/>
        <V2FormDatePicker label='开始日期' name='startDate' placeholder='客流宝开始营运日期' config={{ style: { width: '100%' } }}/>
        <V2FormDatePicker
          label='结束日期'
          name='endDate'
          placeholder='客流宝结束营运日期'
          config={{ style: { width: '100%' } }}
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (getFieldValue('startDate') > value) {
                  return Promise.reject('结束日期不得小于开始日期');
                }
                return Promise.resolve();
              },
            }),
          ]}
        />
      </SearchForm>
      <Table
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: checkStores.ids,
          ...rowSelection,
        }}
        filters={filterParams}
        rowKey='id'
        scroll={{ x: 'max-content', y: 300 }}
        columns={columns}
        pagination={false}
        onFetch={loadData}
      />
      <Button
        disabled={!checkStores.ids.length}
        type='primary'
        style={{ marginTop: '16px' }}
        onClick={() => setCheckStores({ ids: [], stores: [] })}
      >
        清除已选店铺
      </Button>
    </Modal>
  );
};

export default HighFilter;
