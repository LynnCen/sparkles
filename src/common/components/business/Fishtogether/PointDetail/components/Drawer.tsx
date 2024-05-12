import { FC, useRef, useEffect, useState } from 'react';
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import Detail from './Detail';
import styles from '../index.module.less';
import ImportChancePointHistoryModal from './Modal/ImportChancePointHistoryModal';
import AssociatedExtensionTasksModal from './Modal/AssociatedExtensionTasksModal';
import { ImportModalValuesProps } from '@/views/fishtogether/pages/chancepointmanage/ts-config';

/*
  机会点详情抽屉
*/
interface DrawerProps {
  id: number; // 机会点id/点位评估id
  isPoint?: boolean; // 是否点位，true则id代表点位评估id，false则id代表机会点id
  open: boolean; // 是否打开抽屉
  setOpen: Function; // 设置是否打开抽屉
  setFormDrawerData: Function; // 设置是否打开编辑Drawer
  onSearch: Function; // 刷新列表
  // setImportChancePointId: Function;
  refreshDetail: Number; // 监听编辑机会点表单时时的刷新机会点详情
  // setCloseHandle: Function;
  // updateHandle: Function;
  // 导入审批表所用字段
  importChancePointId; // 机会点id
  updateHandle: Function; // 更新详情页
}

const Drawer: FC<DrawerProps> = ({
  id,
  isPoint = false, // 是否点位，true则id代表点位评估id，false则id代表机会点id
  open,
  setOpen,
  setFormDrawerData,
  onSearch,
  refreshDetail,
  importChancePointId,
  updateHandle,
  // setImportChancePointId
}) => {
  const detailRef: any = useRef();
  const [importModalProps, setImportModalProps] = useState<ImportModalValuesProps>({ visible: false });
  const [associatedTaskModal, setAssociatedTaskModal] = useState<boolean>(false);
  useEffect(() => {
    if (open) {
      detailRef.current.onload();
    }
  }, [open, refreshDetail]);

  return (
    <div>
      <V2Drawer
        open={open}
        onClose={() => setOpen(false)}
        className={styles.chancepointDrawer}
        destroyOnClose
      >
        <Detail
          ref={detailRef}
          id={id}
          isPoint={isPoint}
          setImportInfo={setImportModalProps}
          setFormDrawerData={setFormDrawerData}
          setAssociatedTaskModal={setAssociatedTaskModal}
          onSearch={onSearch}
          // setImportChancePointId={setImportChancePointId}
        />
      </V2Drawer>
      {/* 导入审批表弹窗 */}
      <ImportChancePointHistoryModal
        visible={importModalProps.visible}
        importChancePointId={importChancePointId}
        closeHandle={() => {
          setImportModalProps({ visible: false });
        }}
        confirmHandle={() => {
          setImportModalProps({ visible: false });
          onSearch({});
          updateHandle();
        }}
      />
      {/* 关联拓店任务弹窗 */}
      <AssociatedExtensionTasksModal
        id={id}
        visible={associatedTaskModal}
        updateList={() => onSearch({})} // 刷新列表
        setVisible={setAssociatedTaskModal}
        updateHandle={updateHandle}
      />
    </div>
  );
};

export default Drawer;
