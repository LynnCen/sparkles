import { FC, useEffect, useState } from 'react';
import styles from '../entry.module.less';
import { Button } from 'antd';
import SearchForm from '@/common/components/Form/SearchForm';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import { useMethods } from '@lhb/hook';
import { tenantSelectionByKey } from '@/common/api/location';
import { refactorSelection } from '@/common/utils/ways';

const Filter: FC<any> = ({ onSearch, onImport }) => {
  const [selection, setSelection] = useState<any>({
    certificateStatus: [],
    status: [],
  });
  const methods = useMethods({
    getSelection: async() => {
      const res = await tenantSelectionByKey({ keys: ['status', 'certificateStatus'] });
      setSelection(res);
    }
  });
  useEffect(() => {
    methods.getSelection();
  }, []);
  return (
    <div className={styles.searchBox}>
      <SearchForm
        onSearch={onSearch}
        labelLength={4}
        rightOperate={(
          <Button onClick={() => onImport()} type='primary' className='ml-10'>
            正铺供给导入
          </Button>
        )}>
        <V2FormInput label='租户名称/团队名称' name='keyword' />
        <V2FormInput label='管理员' name='manager' placeholder='请输入姓名/手机号' />
        <V2FormSelect options={refactorSelection(selection.status)} label='状态' name='status'/>
        <V2FormSelect options={refactorSelection(selection.certificateStatus)} label='认证状态' name='certificateStatus'/>
      </SearchForm>
    </div>
  );
};

export default Filter;
