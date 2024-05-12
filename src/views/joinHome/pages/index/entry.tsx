// 加盟首页
import { FC, useState } from 'react';
import { Form } from 'antd';
import styles from './entry.module.less';
import FilterFields from './components/FilterFields';
import DataPanel from './components/DataPanel';
import Analyse from './components/Analyse';
import HeadAlert from '@/common/components/business/HeadAlert';
import { useMethods } from '@lhb/hook';
import { completionList } from './components/mock';
import { useTenantType } from '@/common/hook/business/useTenantType';

// 加盟首页
const JoinHome: FC<any> = () => {
  const [form] = Form.useForm();
  // tenantStatus 0:试用企业，1：正式企业； 默认1
  const { tenantStatus } = useTenantType(); // 租户类型
  const [searchParams] = useState<any>({
    devDpt: 0,
    start: '',
    end: ''
  });
  const [funnelTitle, setFunnelTitle] = useState<string>('全国');
  const [funnelData, setfunnelData] = useState<any>(completionList[0]);

  const methods = useMethods({
    onSearch(params) {
      const funnelListItem = completionList[params.devDpt] || {};
      setfunnelData(funnelListItem);
      setFunnelTitle(funnelListItem.devDpt);
    }
  });

  return (
    <>
      {
        tenantStatus === 0 && <HeadAlert />
      }
      <div className={styles.container}>
        {/* 筛选项 */}
        <FilterFields
          form={form}
          onSearch={methods.onSearch}
        />
        {/* 漏斗图+地图展示 */}
        <DataPanel
          funnelTitle={funnelTitle}
          searchParams={searchParams}
          funnelData={funnelData}/>
        {/* 转化及成本分析 */}
        <Analyse searchParams={searchParams}/>
      </div>
    </>

  );
};

export default JoinHome;
