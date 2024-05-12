import { FC, useEffect, useState } from 'react';
import { Divider, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { isArray } from '@lhb/func';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import { getPermission, updatePlan } from '@/common/api/networkplan';
import styles from './entry.module.less';
import V2Container from '@/common/components/Data/V2Container';
import PlanningManageSimpleTable from './components/NetworkPlanMain/components/PlanningManageSimpleTable';
import V2Title from '@/common/components/Feedback/V2Title';
import IconFont from '@/common/components/IconFont';
import V2Message from '@/common/components/Others/V2Hint/V2Message';

const NetworkPlan: FC<any> = () => {
  const [mainHeight, setMainHeight] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false); // 是否显示提示语（更新数据来源）

  useEffect(() => {
    loadPermission(); // 获取权限
  }, []);
  // 获取权限
  const loadPermission = () => {
    getPermission().then((res: any) => {
      const { permissions } = res;
      if (!isArray(permissions)) return;
      const target = permissions.find((item: any) => item.event === 'planCluster:update');
      target && setShowHint(true);
    });
  };

  const updateHandle = () => {
    V2Confirm({
      content: `是否立即更新数据来源？`,
      onSure() {
        setIsLoading(true);
        updatePlan().then((res: any) => {
          const { status } = res;
          switch (status) {
            case 0: // 未匹配
              V2Message.info('未匹配');
              break;
            case 1: // 匹配中
              V2Message.warning('正在更新中，请稍后...');
              break;
            case 2: // 匹配成功
              V2Message.success('更新成功！');
              setShowHint(false);
              break;
            case 3: // 匹配失败
              V2Message.error('更新失败');
              break;
          }
        }).finally(() => {
          setIsLoading(false);
        });
      }
    });

  };

  return (
    <Spin
      spinning={isLoading}
      size='large'
      tip='更新中，请稍后...'
      indicator={<LoadingOutlined className='fs-28'/>}>
      <V2Container
        className={styles.container}
        emitMainHeight={(h) => setMainHeight(h)}
        style={{ height: 'calc(100vh - 88px)' }}
        extraContent={{
          top: <>
            <V2Title type='H1' text='规划管理' style={{ marginTop: 20, color: '#222', }}/>
            <Divider />
            {
              showHint ? <div className={styles.hintCon}>
                <div className={styles.hintContent}>
                  <div>
                    <IconFont iconHref='iconwarning-circle1' className='c-faa fn-14'/>
                  </div>
                  <div className='pl-4'>
                    数据库已更新，是否需要更新数据来源
                  </div>
                  <div
                    className='pl-8 c-006 pointer'
                    onClick={updateHandle}>
                    立即更新
                  </div>
                </div>
                <div className='rt'>
                  <IconFont
                    iconHref='iconic-closexhdpi'
                    className='fn-12 pointer'
                    onClick={() => setShowHint(false)}/>
                </div>
              </div> : <></>
            }
          </>
        }}>
        <PlanningManageSimpleTable
          mainHeight={mainHeight}
        />
      </V2Container>
    </Spin>
  );
};

export default NetworkPlan;
