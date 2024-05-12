
/*
 * @Author: chenyu chenyu@linhuiba.com
 */
import { FC, ReactElement, useEffect, useState } from 'react';
import cs from 'classnames';
import styles from './entry.module.less';
import Search from './components/Search';
import AdaptiveCards from './components/AdaptiveCards';
import StoreStatusChart from './components/StoreStatusChart';
import ConversionsChart from './components/ConversionsChart';
import { Col, Row } from 'antd';
import ProjectTable from './components/ProjectTable';
import { useMethods } from '@lhb/hook';
import { post } from '@/common/request';
import { HomeConfigParentModuleEnum } from './ts-config';
import dayjs from 'dayjs';
import StoreMap from './components/StoreMap';

const NewEdition: FC<any> = () => {
  const [homeConfig, setHomeConfig] = useState<any>([]);// 首页配置
  const [searchParams, setSearchParams] = useState<any>({
    start: dayjs().startOf('year').format('YYYY-MM-DD'), // 统计时间类型-开始时间
    end: dayjs().endOf('year').format('YYYY-MM-DD'), // 统计时间类型-结束时间
    userIds: [], // 用户id列表
    departmentIds: [] // 部门id列表
  });


  const methods = useMethods({
    getHomeConfig() {
      // https://yapi.lanhanba.com/project/532/interface/api/70384
      post('/standard/home/config').then(({ tenantHomeConfig }) => {
        setHomeConfig(tenantHomeConfig);
      });
    }
  });

  /** 动态渲染首页模块 */
  const renderModules = () => {

    const modulesArr:ReactElement[] = [];

    homeConfig?.map(item => {
      switch (item.id) {
        case HomeConfigParentModuleEnum.DATA_BRIEFS:
          !!item.isShow && modulesArr.push(<Col span={24} key={item.id}><AdaptiveCards searchParams={searchParams}/></Col>);
          break;
        case HomeConfigParentModuleEnum.CONVERSION_FUNNEL:
          // 产品说目前 转换漏斗 门店状态 两个模块会人为控制同时显示与否
          !!item.isShow && modulesArr.push(<Col span={12} key={item.id}>
            <ConversionsChart searchParams={searchParams} modules={item.configs} title={item.name as string}/>
          </Col>);

          break;
        case HomeConfigParentModuleEnum.STORE_STATUS:
          // 产品说目前 转换漏斗 门店状态 两个模块会人为控制同时显示与否
          !!item.isShow && modulesArr.push(<Col span={12} key={item.id}>
            <StoreStatusChart title={item.name as string}/>
          </Col>);


          break;
        case HomeConfigParentModuleEnum.DATA_SHEET:
          !!item.isShow && modulesArr.push(<Col span={24} key={item.id}><div className={cs(styles.tablesCon)}>
            <ProjectTable modules={item.configs} searchParams={searchParams}/>
          </div></Col>);
          break;
        case HomeConfigParentModuleEnum.STORE_LOCATIONS:
          !!item.isShow && modulesArr.push(<Col span={24} key={item.id}>
            <StoreMap title={item.name as string}/>
          </Col>);
          break;

        default:
          break;
      }
    });

    return modulesArr;

  };


  useEffect(() => {
    methods.getHomeConfig();
  }, []);


  return (
    <div className={styles.container}>
      {/* 搜索栏 */}
      <Search
        searchParams={searchParams}
        setSearchParams={setSearchParams}/>
      <Row gutter={[12, 12]}>
        {renderModules()}
      </Row>
    </div>
  );
};

export default NewEdition;
