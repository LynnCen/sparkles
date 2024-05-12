/**
 * @Author : rachel
 * @LastEditors Please set LastEditors
 * @LastEditTime 2024-01-02 10:01
 * @Description :
 */
import React, { useEffect, useState } from 'react';
import FormSearch from '@/common/components/Form/SearchForm';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import { FilterProps } from '../ts-config';
import styles from './index.module.less';
import { getAppList } from '@/common/api/app';
import { AppListResult } from '@/views/application/pages/index/ts-config';
import { refactorSelection } from '@/common/utils/ways';
import { useMethods } from '@lhb/hook';
import { get } from '@/common/request';
import V2FormRangePicker from '@/common/components/Form/V2FormRangePicker/V2FormRangePicker';

const StatusList = [
  { label: '初始化', value: 0 },
  { label: '正常', value: 1 },
  { label: '停用', value: 2 },
];
const CertificateStatusList = [
  { label: '未认证', value: 0 },
  { label: '已认证', value: 1 },
];

const Filters: React.FC<FilterProps> = ({ onSearch }) => {

  // eslint-disable-next-line no-undef
  const [appList, setAppList] = useState<AppListResult[]>();
  const [appCodeList, setAppCodeList] = useState<any[]>([]); // 应用筛选项

  useEffect(() => {
    const getList = async(params:any) => {
      let result: any[] = await getAppList(params);
      result = refactorSelection(result);
      setAppList(result);
    };
    getList('');
    methods.getAppCodeList();
  }, []);

  /* methods */
  const methods = useMethods({
    getAppCodeList() {
      // https://yapi.lanhanba.com/mock/378/api/app/selectList
      get('/app/selectList', {}, { proxyApi: '/mirage' }).then((res: any) => {
        setAppCodeList([...res.map((item) => { return { value: item.code, label: item.name }; })]);
      });
    }
  });

  return (
    <FormSearch onSearch={onSearch} labelLength={4} className={styles.tenantForm}>
      <V2FormInput label='租户名称/团队名称' name='name' />
      {/* <FormInput label='企业名称' name='enterprise' /> */}
      <V2FormInput label='管理员' name='manager' placeholder='请输入姓名/手机号' />
      <V2FormSelect label='状态' name='status' options={StatusList} />
      {/* @ts-ignore */}
      <V2FormSelect label='创建渠道' name='channel' options={appList} />
      <V2FormSelect label='已授权应用' name='appCode' options={appCodeList} />
      <V2FormSelect label='认证状态' name='certificateStatus' options={CertificateStatusList} />
      <V2FormRangePicker label='创建时间' name='createTime' />
      <V2FormInput label='用户手机号' name='mobile' maxLength={11} placeholder='请输入用户手机号' />
    </FormSearch>
  );
};

export default Filters;
