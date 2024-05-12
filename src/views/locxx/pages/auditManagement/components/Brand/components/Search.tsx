import { FC } from 'react';
import styles from 'src/views/locxx/pages/auditManagement/entry.module.less';
import FormSearch from '@/common/components/Form/SearchForm';
import FormContacts from '@/common/components/FormBusiness/FormContacts';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import { useMethods } from '@lhb/hook';
import { Button, Radio } from 'antd';

// 审核管理-搜索
const AuditManagementSearch: FC<{
  onSearch: any,
  searchForm: any,
  topStatus: number,
  setTopStatus: any,
  setVisible?: any
}> = ({ onSearch, searchForm, topStatus, setTopStatus, setVisible }) => {
  const AUDIT_STATUS_AUDITED = 2;// 已审核

  const selection = {
    auditstatus: [{ value: 2, label: '通过' }, { value: 3, label: '拒绝' }],
    tabOptions: [{ value: 1, label: '待审核' }, { value: 2, label: '已审核' }],
  };

  const radioChange = (val) => {
    setTopStatus(val);
    onSearch?.({ topStatus: val });
  };

  const methods = useMethods({
    handleReplace() {
      setVisible(true);
    }
  });

  return (
    <>
      <div className={styles['radio-group']}>
        <Radio.Group
          options={selection.tabOptions}
          optionType='button'
          defaultValue={1}
          onChange={(e) => radioChange(e.target.value)}
        />
      </div>
      <FormSearch
        form={searchForm}
        onSearch={onSearch}
        rightOperate={
          topStatus !== AUDIT_STATUS_AUDITED
            ? <Button onClick={methods.handleReplace}>代认证</Button>
            : <></>
        }>
        {/* <div className={styles.searchRadioGroup}>
          <V2FormRadio
            options={selection.tabOptions}
            name='topStatus'
            optionType='button'
            config={{ defaultValue: 1 }}
            onChange={(e) => radioChange(e.target.value)}
          />
        </div> */}
        <V2FormInput
          label='品牌'
          name='brandName'
          placeholder='请输入品牌名称'
        />
        <FormContacts
          label='联系人'
          name='employeeId'
          placeholder='请输入手机号搜索并选择联系人'
          allowClear={true}
          config={{ getPopupContainer: (node) => node.parentNode }}
        />
        {topStatus === AUDIT_STATUS_AUDITED ? <V2FormSelect
          label='审核状态'
          name='status'
          options={selection.auditstatus}
        /> : ''}
      </FormSearch>
    </>
  );
};

export default AuditManagementSearch;
