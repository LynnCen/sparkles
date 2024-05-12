import { FC, useEffect, useState } from 'react';
import styles from 'src/views/locxx/pages/auditManagement/entry.module.less';
import FormSearch from '@/common/components/Form/SearchForm';
import V2FormRadio from '@/common/components/Form/V2FormRadio/V2FormRadio';
import FormContacts from '@/common/components/FormBusiness/FormContacts';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormCascader from '@/common/components/Form/V2FormCascader/V2FormCascader';
import { Cascader } from 'antd';
import { getRequirementSelection, getplaceCategory } from '@/common/api/demand-management';
import { refactorSelectionNew } from '@/common/utils/ways';
import { useMethods } from '@lhb/hook';
import { contrast } from '@lhb/func';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';

const { SHOW_CHILD } = Cascader;

// 审核管理-搜索
const AuditManagementSearch: FC<{
  onSearch: any,
  searchForm: any,
  tabOptions?: Array<any>,
  status: number,
  setStatus: any,
  openStatusOptions: Array<any>
}> = ({ onSearch, searchForm, status, setStatus, openStatusOptions }) => {
  const AUDIT_STATUS_AUDITED = 4;// 已审核

  const [selection, setSelection] = useState({
    auditStatus: [{ value: 2, label: '通过' }, { value: 3, label: '拒绝' }],
    tabOptions: [{ value: 1, label: '待审核' }, { value: 4, label: '已审核' }],
    commercials: [],
    placeCategoryIdList: []
  });

  const radioChange = (val) => {
    setStatus(val);
    onSearch?.();
  };
  useEffect(() => {
    methods.getSelection();
  }, []);
  const methods = useMethods({
    getSelection() {
      getRequirementSelection({ modules: 'commercial' }).then((response) => {
        setSelection(val => ({ ...val,
          commercials: refactorSelectionNew({ selection: contrast(response, 'commercials', []) }),
        }));
      });
      getplaceCategory().then((response) => {
        const newList:any = [];
        console.log(response);

        response.shopCategory
          .forEach(item => {
            newList.push({ value: item.id, label: item.name });
          });
        setSelection(val => ({ ...val,
          placeCategoryIdList: newList,
        }));
      });
    },
  });

  return (
    <>
      <FormSearch
        form={searchForm}
        onSearch={onSearch}
        labelLength={4}
        initialValues={{ tab: 1 }}>
        <div className={styles.searchRadioGroup}>
          <V2FormRadio
            options={selection.tabOptions}
            name='tab'
            optionType='button'
            onChange={(e) => radioChange(e.target.value)}
          />
        </div>
        <V2FormInput
          label='项目'
          name='placeName'
        />
        <FormContacts
          label='联系人'
          name='employeeIdList'
          placeholder='输入手机号'
          allowClear={true}
          config={{
            getPopupContainer: (node) => node.parentNode,
            mode: 'multiple',
            needCacheSelect: true,
            showArrow: true,
            maxTagCount: 'responsive'
          }}
        />
        {status === AUDIT_STATUS_AUDITED ? <V2FormSelect
          mode='multiple'
          label='审核状态'
          name='statuses'
          options={selection.auditStatus}
        /> : ''}
        <V2FormCascader
          label='业态'
          name='commercialIdList'
          options={selection.commercials}
          config={{
            showSearch: true,
            showArrow: true,
            allowClear: true,
            changeOnSelect: true,
            multiple: true,
            maxTagCount: 'responsive',
            showCheckedStrategy: SHOW_CHILD,
          }}
          placeholder='请选择业态'
        />
        <V2FormSelect
          name='openStatus'
          label='项目状态'
          options={openStatusOptions}
        />
        <V2FormSelect
          mode='multiple'
          name='placeCategoryIdList'
          label='铺位类型'
          options={selection.placeCategoryIdList}
        />
      </FormSearch>
    </>
  );
};

export default AuditManagementSearch;
