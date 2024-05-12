/**
 * @Description 拓店任务详情Drawer
 */
import { FC, useEffect, useState } from 'react';
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import V2Title from '@/common/components/Feedback/V2Title';
import PointDetail from '@/common/components/business/Fishtogether/PointDetail';
import Evaluations from './components/Evaluations';
import Meet from './components/Meet';
import styles from './index.module.less';
import { taskDetail } from '@/common/api/fishtogether';

const TaskDrawer: FC<any> = ({
  open,
  setOpen,
  taskId,
  taskName,
}) => {
  const [detail, setDetail] = useState<any>({});
  const [communicationInfo, setCommunicationInfo] = useState<any>([]);
  const [evaluations, setEvaluations] = useState<any>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 机会点详情
  const [currentId, setCurrentId] = useState<any>(); // 机会点id
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false); // 是否显示机会点详情页
  const [refreshDetail, setRefreshDetail] = useState<number>(0); // 更新详情页
  const [formDrawerData, setFormDrawerData] = useState<any>({
    open: false,
    templateId: '', // 模板id
    id: '', // 编辑时的id
  });
  const [importModalProps, setImportModalProps] = useState<any>({ visible: false });

  useEffect(() => {
    if (taskId && open) {
      loadDetail();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId, open]);

  const loadDetail = async () => {
    const result: any = await taskDetail({ id: taskId });
    result && setDetail(result);
    setCommunicationInfo(Array.isArray(result.meets) ? result.meets : []);
    setEvaluations(Array.isArray(result.evaluations) ? result.evaluations : []);
    setIsLoaded(true);
  };

  const onClose = () => {
    setOpen(false);
    setIsLoaded(false);
  };

  // 查看点位详情
  const onPointDetail = (record) => {
    const { id } = record;
    setCurrentId(id);
    setDrawerVisible(true);
  };
  // 打开详情页时的编辑表单的刷新详情页
  const updateHandle = () => {
    const curVal = refreshDetail + 1;
    setRefreshDetail(curVal);
  };
  const onSearch = () => {
    loadDetail();
  };

  return (
    <V2Drawer open={open} onClose={onClose} destroyOnClose>
      <>
        <V2Title>
          <div className={styles.top}>
            <span className={styles.topText}>{detail.name || taskName}</span>
          </div>
        </V2Title>

        {/* 匹配点位列表，点击后查看点位详情 */}
        <Evaluations evaluations={evaluations} isLoaded={isLoaded} onPointDetail={onPointDetail}/>

        {/* 沟通记录 */}
        <Meet meetList={communicationInfo}/>

        {/* 机会点详情页相关组件，包含机会点详情、编辑机会点、导入审批表 */}
        <PointDetail
          currentId={currentId}
          isPoint={true}
          refreshDetail={refreshDetail}
          importChancePointId={currentId}
          formDrawerData={formDrawerData}
          importModalProps={importModalProps}
          setDrawerVisible={setDrawerVisible}
          drawerVisible={drawerVisible}
          setImportModalProps={setImportModalProps}
          setFormDrawerData={setFormDrawerData}
          updateHandle={updateHandle}
          onSearch={onSearch}/>
      </>
    </V2Drawer>
  );
};
export default TaskDrawer;
