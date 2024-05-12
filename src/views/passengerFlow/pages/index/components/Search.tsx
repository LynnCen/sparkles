import { FC, useEffect, useState } from 'react';
import styles from '../entry.module.less';
import FormSearch from '@/common/components/Form/SearchForm';
import ShopModal from '@/views/passengerFlow/components/ShopModal';
import { Button } from 'antd';
import { getStoreSelection } from '@/common/api/passenger-flow';
import { refactorSelection } from '@/common/utils/ways';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import FormTenant from '@/common/components/FormBusiness/FormTenant';

const PassengerFlowSearch: FC<any> = ({ onSearch, searchForm, permissions }) => {
  const [shopModalVisible, setShopModalVisible] = useState<boolean>(false);
  const [selection, setSelection] = useState<any>({
    status: [],
    deviceStatus: [],
  });
  useEffect(() => {
    getStoreSelection().then((res) => {
      setSelection(res);
    });
  }, []);
  return (
    <>
      <FormSearch
        form={searchForm}
        onSearch={onSearch}
        className={styles.flowForm}
        rightOperate={
          permissions.find(item => item.event === 'createUpdateStore') && <Button type='primary' onClick={() => setShopModalVisible(true)}>新增门店</Button>
        }>
        <FormTenant
          label='租户名称'
          name='tenantId'
          allowClear={true}
          placeholder='请输入租户名称搜索'
          enableNotFoundNode={false}
          config={{
            getPopupContainer: (node) => node.parentNode,
          }}
        />
        <V2FormInput label='搜索' name='name' placeholder='请输入门店名称/点位名称'/>
        <V2FormSelect label='当前状态' name='status' options={refactorSelection(selection.status)} />
        <V2FormSelect
          name='deviceStatus'
          label='设备状态'
          placeholder='请选择设备状态'
          options={refactorSelection(selection.deviceStatus)} />
      </FormSearch>
      <ShopModal visible={shopModalVisible} setVisible={setShopModalVisible} onSearch={onSearch}></ShopModal>
    </>
  );
};

export default PassengerFlowSearch;
