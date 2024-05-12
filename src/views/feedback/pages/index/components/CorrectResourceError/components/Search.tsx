import { FC } from 'react';
import styles from '../../../entry.module.less';
import FormSearch from '@/common/components/Form/SearchForm';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormRangePicker from '@/common/components/Form/V2FormRangePicker/V2FormRangePicker';
import V2FormRadio from '@/common/components/Form/V2FormRadio/V2FormRadio';
import FormUserList from '@/common/components/FormBusiness/FormUserList';

// 资源纠错 搜索
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
          name='creator'
          label='提交人'
          placeholder='请选择提交人'
          allowClear={true}
          form={searchForm}
        />
        <FormUserList
          name='handlePerson'
          label='处理人'
          placeholder='请选择处理人'
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
