/**
 * @Description 鱼你机会点详情相关
 * 代码是从原本的fishtogether/chancepointmanage页面迁移过来的
 * 机会点表单部分代码责任人 - 疯子、丹哥
 * 机会点详情部分代码责任人 - 夏奇、丹哥
 * 导入审批表部分代码责任人 - 夏奇
 */

import { FC } from 'react';
// import cs from 'classnames';
// import styles from './entry.module.less';
import DetailDrawer from './components/Drawer';
import FormDrawer from './components/FormDrawer';

const PointDetail: FC<any> = ({
  // 点位详情所用字段
  currentId, // 机会点id/点位id
  isPoint = false, // 是否点位，true则id代表点位评估id，false则id代表机会点id
  setDrawerVisible,
  drawerVisible, // 是否展示详情抽屉
  setFormDrawerData, // 设置编辑表单状态
  onSearch, // 触发列表搜索逻辑
  refreshDetail, // 触发详情更新的逻辑
  // setImportChancePointId, // 设置机会点id
  // 机会点表单所用字段
  formDrawerData, // 表单抽屉所需数据
  updateHandle, // 更新详情的处理
  // 导入审批表所用字段
  importChancePointId, // 机会点id
}) => {

  return (
    <>
      {/* 点位详情 */}
      <DetailDrawer
        id={currentId}
        isPoint={isPoint}
        open={drawerVisible}
        setOpen={setDrawerVisible}
        importChancePointId={importChancePointId}
        setFormDrawerData={setFormDrawerData}
        onSearch={onSearch}
        refreshDetail={refreshDetail}
        updateHandle={updateHandle}
        // setImportChancePointId={setImportChancePointId}
      />
      {/* 创建/编辑机会点 */}
      <FormDrawer
        drawerData={formDrawerData}
        onSearch={onSearch}
        update={updateHandle}
        closeHandle={() =>
          setFormDrawerData({
            open: false,
            templateId: '', // 模板id
            id: '', // 编辑时的id
          })
        }
      />
    </>
  );
};

export default PointDetail;
