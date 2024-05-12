import { SearchForm, Table } from '@/common/components';
import FormInput from '@/common/components/Form/FormInput';
import { useSearchForm, useSelctRowKeys } from '@/common/hook';
import { Form, Button, Space } from 'antd';
import { FC, useEffect, useState } from 'react';
import Modal from '@/common/components/Modal/Modal';
import CategorySelect from './CategorySelect';
import CitySelect from './CitySelect';
import { getResList } from '../api/place';

export const convertedArray = (arr: any[][]) => {
  if (!arr) {
    return [];
  }
  return Array.from(new Set(arr.map(item => item[item.length - 1]).filter(item => !!item)));
};

const { Item } = Form;

interface AddPointProps {
  visible?: boolean;
  onClose?: () => void;
  onOK?: (closeable?: boolean, selectedRows?: any[]) => void;
  data?: any[];
}


const columns = [
  { dataIndex: 'spotName',
    title: '点位名称',
    key: 'spotName',
    render(_:string, recoder: any) {
      const { spotName, placeName } = recoder;
      return `${placeName}-${spotName}`;
    }
  },
  { dataIndex: 'placeName', title: '场地地址', key: 'placeName' },
  { dataIndex: 'placeCategoryName', title: '场地类目', width: 120, key: 'placeCategoryName' },
  {
    dataIndex: 'spotArea',
    key: 'spotArea',
    title: '点位总面积（m²）',
    width: 140,
  },
];

const AddPoint: FC<AddPointProps> = ({ visible, onClose, ...props }) => {
  const [tableProps, { onReset, onSearch }] = useSearchForm<any>(getResList, (values) => {
    const { city, ...restValue } = values;
    return {
      ...restValue,
      administrativeCodeList: convertedArray(city)
    };
  });
  const { loading } = tableProps;
  const { selectedRowKeys, onChange, selectedRows } = useSelctRowKeys();
  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  const onResetSelectdRowKeys = () => {
    onChange([]);
  };

  const onDrawerSubmit = async (closeable?: boolean) => {
    if (!selectedRowKeys.length) {
      return;
    }
    setBtnLoading(true);
    onResetSelectdRowKeys();
    setBtnLoading(false);
    props.onOK?.(closeable, selectedRows);

  };

  const onOk = () => {
    onDrawerSubmit(false);
  };

  const onOKAndClose = () => {
    onDrawerSubmit(true);
  };



  useEffect(() => {
    if (loading) {
      onResetSelectdRowKeys();
    }
  }, [loading]);


  return (
    <>
      <Modal
        width={1040}
        title='选择点位'
        open={visible}
        onCancel={onClose}
        destroyOnClose
        zIndex={200}
        footer={
          <Space>
            {/* <Button onClick={onClose}>取消</Button> */}
            <Button disabled={!selectedRowKeys.length} type='primary' onClick={onOk}>
            保存
            </Button>
            <Button type='primary' loading={btnLoading} disabled={!selectedRowKeys.length} onClick={onOKAndClose}>保存并关闭</Button>
          </Space>
        }
      >
        <SearchForm
          onReset={onReset}
          labelLength={4}
          moreBtn={false}
          showSearchNum={7}
          onSearch={onSearch}>
          <FormInput label='场地名称' allowClear name='placeName' placeholder='请输入场地名称'/>
          <FormInput label='场地ID'allowClear name='tenantPlaceId' placeholder='请输入场地ID'/>
          <Item label='场地类目' name='placeCategoryIdList'>
            <CategorySelect/>
          </Item>
          <FormInput label='点位名称' name='spotName' placeholder='请输入点位名称'/>
          <FormInput label='点位ID' name='tenantSpotId' placeholder='请输入场地名称' />
          <Item label='点位类目' name='spotCategoryIdList'>
            <CategorySelect resoureType={1}/>
          </Item>
          <Item label='城市'name='city'>
            <CitySelect fieldValue='id'/>
          </Item>
        </SearchForm>
        <Table
          columnsControll={false}
          columns ={columns}
          {...tableProps}
          rowKey='tenantSpotId'
          rowSelection={{ selectedRowKeys, onChange, selectedRows }}
          scroll={{ x: 'max-content' }}
          wrapStyle={{
            maxHeight: 'calc(100vh - 480px)'
          }}
          message={
            <Space>
              已选择{selectedRowKeys.length}条
              <Button type='link' onClick={onResetSelectdRowKeys}>取消选择</Button>
            </Space>
          }
        />
      </Modal>
    </>
  );
};

export default AddPoint;
