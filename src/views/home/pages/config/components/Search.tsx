/**
 * @Description 搜索部分
 */
import { FC, useEffect, useState } from 'react';
import { Affix, Form } from 'antd';
import styles from '../entry.module.less';
import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import SearchForm from '@/common/components/Form/SearchForm';
import { useMethods } from '@lhb/hook';
import TimeSelect from './TimeSelect';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import { userPermissionList } from '@/common/api/brief';
import { DepartMentResult } from '@/views/organization/pages/department/ts-config';
import { departmentPermissionList } from '@/common/api/department';
import V2FormTreeSelect from '@/common/components/Form/V2FormTreeSelect/V2FormTreeSelect';
import { gatherMethods, getKeysFromObjectArray } from '@lhb/func';
// 引入季度插件
dayjs.extend(quarterOfYear);

const Search: FC<any> = ({
  searchParams,
  setSearchParams
}) => {
  const [searchForm] = Form.useForm();
  const [userListOpt, setUserListOpt] = useState<any[]>([]);
  const [departmentListOpt, setDepartmentListOpt] = useState<any[]>([]);

  const methods = useMethods({
    // 筛选项变化
    onValuesChange(changedValues: any, allValues:any) {
      setSearchParams({
        ...allValues,
        start: dayjs(allValues.time[0]).format('YYYY-MM-DD'),
        end: dayjs(allValues.time[1]).endOf('month').format('YYYY-MM-DD'),
      });
    },
    onRadioChange(changedValues: any) {
      setSearchParams({
        ...searchParams,
        ...changedValues,
        start: dayjs(changedValues.time[0]).format('YYYY-MM-DD'),
        end: dayjs(changedValues.time[1]).format('YYYY-MM-DD'),
      });
    },
    getUserList(departmentIds?:string[]|number[]) {
      userPermissionList({ departmentIds }).then((data) => {
        const res = data.objectList.map((item) => {
          return {
            label: `${item.name || null}`,
            value: item.id,
          };
        });
        setUserListOpt(res);

        const _userIds = searchForm.getFieldValue('userIds');
        // 如果选中了部门并且选中了人员
        if (departmentIds?.length && _userIds?.length) {
          // 当部门被删除时，需要删除对应部门下的人员
          const filterUserId = gatherMethods(_userIds, getKeysFromObjectArray(res, 'value'), 1);
          searchForm.setFieldValue('userIds', filterUserId);
        }
      });
    },
    async getDepartmentList() {
      const { objectList = [] }: DepartMentResult = await departmentPermissionList();
      setDepartmentListOpt(objectList);
    }
  });

  useEffect(() => {
    methods.getDepartmentList();
    methods.getUserList();
  }, []);

  return (
    <Affix offsetTop={0}>
      <SearchForm
        form={searchForm}
        onValuesChange={methods.onValuesChange}
        className={styles.searchCon}
        labelLength={5}
        hiddenOkBtn
        showResetBtn={false}
        wrapperCol={{ span: 24 }}
      >
        <V2FormTreeSelect
          name='departmentIds'
          treeData={departmentListOpt}
          onChange={(value) => methods.getUserList(value)}
          placeholder='选择部门'
          config={{
            multiple: true,
            fieldNames: { label: 'name', value: 'id', children: 'children' },
            treeDefaultExpandAll: true,
            showSearch: true,
            treeNodeFilterProp: 'name',
          }}
        />
        <V2FormSelect
          name='userIds'
          options={userListOpt}
          placeholder='选择人员'
          config={{ mode: 'multiple' }} />
        <TimeSelect
          form={searchForm}
          name='time'
          rangePickerConfig={{
            clearIcon: false
          }}
          onRadioChange={methods.onRadioChange}
        />
      </SearchForm>
    </Affix>
  );
};

export default Search;

