import V2Title from '@/common/components/Feedback/V2Title';
import styles from './index.module.less';
import cs from 'classnames';
import { TaskMap } from './ts-config';
import CircleTaskDetailMap from '../CircleTaskDetailMap';
import { useMemo, useState } from 'react';
import { isNotEmptyAny } from '@lhb/func';
import AreaDetailDrawer from '@/views/iterate/pages/siteselectionmap/components/AreaDetailDrawer';

interface CircleBasicInfoProps{
  taskDetail:any;
  title?: string; // 自定义标题
  className?: string;
}
interface DrawerData{
  open:boolean;
  id:string
}
const CircleBasicInfo = (props:CircleBasicInfoProps) => {

  const { taskDetail, title, className } = props;
  const [drawerData, setDrawerData] = useState<DrawerData>({ // 选址地图详情抽屉
    open: false,
    id: ''
  });

  const basicTaskInfo = useMemo(() => {
    if (!isNotEmptyAny(taskDetail)) return {};
    const { modelClusterInfo, manager, emergencyDegreeName, targetProvinceName, targetCityName, targetDistrictName, signShopCount, expectDropInDate } = taskDetail;
    return {
      modelClusterName: modelClusterInfo?.modelClusterName,
      manager,
      emergencyDegreeName,
      targetAdress: `${targetProvinceName ? targetProvinceName + '/' : ''}${targetCityName ? targetCityName + '/' : ''}${targetDistrictName ?? ''}`,
      signShopCount,
      expectDropInDate
    };
  }, [taskDetail]);

  const handleClickClusterName = () => {
    setDrawerData({
      open: true,
      id: taskDetail?.modelClusterInfo?.modelClusterId
    });
  };
  return <div className={cs(styles.basicWrapper, className || '')}>
    <div className={styles.basicInfo}>
      <V2Title
        type='H2'
        divider
        text={title || '任务基本信息'}
      />
      {
        Object.entries(TaskMap).map(([key, label], index) => {
          return <div key={index}>
            <div className={styles.label}>{label}</div>
            <div className={styles.value}>{key === 'modelClusterName' ? <a onClick={handleClickClusterName}>{basicTaskInfo[key] || '-'}</a> : (basicTaskInfo[key] || '-')}</div>
          </div>;
        })
      }
    </div>
    <div className={styles.basicMap}>
      <CircleTaskDetailMap
        businessDetail={taskDetail}
      />
    </div>
    {drawerData.open && <AreaDetailDrawer
      drawerData={drawerData}
      setDrawerData={setDrawerData}
      viewChanceDetail={false}
    />
    }
  </div>;

};

export default CircleBasicInfo;
