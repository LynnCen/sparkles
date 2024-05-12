/**
 * @Description 各区域完成情况模块
 */
import V2Tabs from '@/common/components/Data/V2Tabs';
import { FC, useEffect, useMemo, useState } from 'react';
import DevDptKPIReportTable from '../../../devdptkpireport/components/DevDptKPIReportTable';
import IndividualKPIReportTable from '../../../individualkpireport/components/IndividualKPIReportTable';
import {  Space } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import styles from './index.module.less';
import { useMethods } from '@lhb/hook';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import { HomeConfigChildrenModuleEnum } from '../../ts-config';


const ProjectTable:FC<any> = ({
  modules = [],
  searchParams = {}
}) => {
  const [activeKey, setActiveKey] = useState<string>(String(HomeConfigChildrenModuleEnum.DEVELOPMENT_DEPARTMENT_REPORT));
  const items = useMemo(() => {
    return modules.filter(item => !!item.isShow).map(item => {
      return {
        ...item,
        key: String(item.id),
        label: item.name
      };
    });
  }, [modules]);

  const methods = useMethods({
    handleMore() {
      const params = {
        start: searchParams.start,
        end: searchParams.end,
      };
      const url = activeKey === String(HomeConfigChildrenModuleEnum.DEVELOPMENT_DEPARTMENT_REPORT) ? `/home/devdptkpireport?params=${decodeURIComponent(JSON.stringify(params))}` : `/home/individualkpireport?params=${decodeURIComponent(JSON.stringify(params))}`;
      dispatchNavigate(url);
    }
  });
  const tabBarExtraContent = {
    right: <Space>
      <div  onClick={methods.handleMore} className={styles.moreBtn}>更多<RightOutlined /></div>
    </Space>
  };

  useEffect(() => {
    // 默认选中第一个 tabs
    if (modules && modules.length) {
      const showModules = modules.filter(item => item.isShow);
      setActiveKey(String(showModules[0].id));
    }
  }, []);


  return (<div className={styles.projectTableCon}>
    <V2Tabs
      items={items}
      activeKey={activeKey}
      onChange={(key) => setActiveKey(key)}
      type='fullCard'
      animated={false}
      tabBarExtraContent={tabBarExtraContent}/>
    <div className='mt-12'>
      {
        activeKey === String(HomeConfigChildrenModuleEnum.DEVELOPMENT_DEPARTMENT_REPORT) ? <DevDptKPIReportTable
          filters={searchParams}
          mainHeight={440}
          tableConfig={{ pagination: false }}
        /> : <IndividualKPIReportTable
          filters={searchParams}
          mainHeight={440}
          tableConfig={{ pagination: false }}
        />
      }
    </div>
  </div>);
};

export default ProjectTable;
