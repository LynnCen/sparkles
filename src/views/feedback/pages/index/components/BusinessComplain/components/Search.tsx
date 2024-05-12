import { FC } from 'react';
import styles from '../../../entry.module.less';
import FormSearch from '@/common/components/Form/SearchForm';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormRangePicker from '@/common/components/Form/V2FormRangePicker/V2FormRangePicker';
import V2FormRadio from '@/common/components/Form/V2FormRadio/V2FormRadio';
import FormUserList from '@/common/components/FormBusiness/FormUserList';

// 业务投诉 搜索
const DemandManagementSearch: FC<{
  onSearch: any,
  searchForm: any,
  tabOptions: Array<any>,
}> = ({ onSearch, searchForm, tabOptions }) => {
  return (
    <>
      <FormSearch
        form={searchForm}
        onSearch={onSearch}
        initialValues={{ tab: 1 }}
      >
        <div className={styles.searchRadioGroup}>
          {Array.isArray(tabOptions) && tabOptions.length ? <V2FormRadio
            options={tabOptions}
            name='tab'
            optionType='button'
            onChange={() => onSearch()}
          /> : ''}
        </div>
        <V2FormInput
          label='编号'
          name='number'
          placeholder='请输入编号'
          maxLength={30}
        />
        <FormUserList
          label='被投诉对象'
          name='targetId'
          placeholder='请选择被投诉对象'
          allowClear={true}
          form={searchForm}
        />
        <FormUserList
          name='creator'
          label='投诉人'
          placeholder='请选择投诉人'
          allowClear={true}
          form={searchForm}
        />
        <FormUserList
          name='handlePerson'
          label='处理人'
          placeholder='请输入处理人'
          allowClear={true}
          form={searchForm}
        />
        <V2FormRangePicker
          label='提交日期'
          name='dates'
          config={{
            allowEmpty: [true, true],
          }}/>
      </FormSearch>
    </>
  );
};

export default DemandManagementSearch;
