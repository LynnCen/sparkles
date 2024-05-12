
import { FC } from 'react';
// 创建/编辑表单抽屉
import FormDrawer from './components/FormDrawer';
// 详情抽屉
import ChancePointDteailDrawer from './components/Deatil';

const PointDetail: FC<any> = ({
  // 点位详情所用字段
  pointId, // 机会点id/点位id
  detailVisible,
  setDetailVisible,
  setFormDrawerData, // 设置编辑表单状态
  onSearch, // 触发列表搜索逻辑
  refreshDetail, // 触发详情更新的逻辑
  formDrawerData, // 表单抽屉所需数据
  updateHandle, // 更新详情的处理
  refreshOuter, // 引入该组件的时候需要更新外部内容
}) => {

  return (
    <>
      {/* 机会点详情组件 */}
      <ChancePointDteailDrawer
        id={pointId}
        open={detailVisible}
        setOpen={setDetailVisible}
        setFormDrawerData={setFormDrawerData}
        onSearch={onSearch}
        updateHandle={updateHandle}
        refreshDetail={refreshDetail}
        refreshOuter={refreshOuter}
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
