/**
 * @Description 机会点管理
 */

import { useState, useMemo } from 'react';
import V2Container from '@/common/components/Data/V2Container';
import V2Operate from '@/common/components/Others/V2Operate';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import PointDetail from '@/common/components/business/ExpandStore/ChancePointDetail';
import PageTitle from '@/common/components/business/PageTitle';
import Filter from './components/Filter';
import List from './components/List';
import SelectTemplateModal from './components/SelectTemplateModal';
import { isArray, refactorPermissions, downloadFile } from '@lhb/func';
import { useMethods } from '@lhb/hook';
import { getTemplateLists, chancepointExport } from '@/common/api/expandStore/chancepoint';
import styles from './entry.module.less';


/** 机会点管理 */
const ChancePointManage = () => {

  const [filters, setFilters] = useState<any>({}); // 参数变化的时候会触发请求更新table表格
  const [exportFilters, setExportFilters] = useState<any>({}); // 筛选项输入实时变化时，同步给导出参数
  const [detailVisible, setDetailVisible] = useState<boolean>(false); // 详情抽屉是否可见
  const [permissions, setPermissions] = useState<any>([]);
  const [selectTemplateVisible, setSelectTemplateVisible] = useState<boolean>(false);
  const [formDrawerData, setFormDrawerData] = useState<any>({
    open: false,
    templateId: '', // 模板id
    id: '', // 编辑时的id
  });
  const [refreshDetail, setRefreshDetail] = useState<number>(0);
  const [pointId, setPointId] = useState<number>(0);
  const [mainHeight, setMainHeight] = useState<number>(0);

  const operateList: any = useMemo(() => {
    const list = refactorPermissions(permissions);
    return list.map((item) => ({
      name: item.text,
      event: item.event,
      func: item.func,
      type: item.isBatch ? 'default' : 'primary',
      useLoadingWidthAsync: item.event === 'export' // 导出按钮点击后启用loading
    }));
  }, [permissions]);

  // 打开详情页时的编辑表单的刷新详情页
  const updateHandle = () => {
    const curVal = refreshDetail + 1;
    setRefreshDetail(curVal);
  };

  /**
   * @description 点击名称查看机会点详情,获取机会点详情数据
   * @param record 当前选中点击某一行的数据
   */
  const onClickDetail = async (record, index) => {
    if (index !== 0) return;
    setPointId(record.id);
    setDetailVisible(true);
  };

  const methods = useMethods({
    async handleCreate() {
      // 多条模板时需要选择，只有一条时直接使用
      const result: any = await getTemplateLists();
      if (isArray(result) && result.length === 1) {
        setFormDrawerData({
          templateId: result[0].id,
          open: true,
        });
      } else {
        setSelectTemplateVisible(true);
      }
    },
    handleExport() {
      // 为了使用按钮loading必须按这种promise写法
      return new Promise((res) => {
        chancepointExport(exportFilters).then(({ url, name }: any) => {
          if (url) {
            downloadFile({
              name,
              downloadUrl: url
            });
          } else {
            V2Message.warning('表格数据异常或无数据');
          }
        }).finally(() => {
          res(true);
        });
      });
    }
  });

  return (
    <div>
      <V2Container
        className={styles.chancepointContainer}
        // 上下padding  标题height 48px
        style={{ height: 'calc(100vh - 32px - 48px)' }}
        emitMainHeight={(h) => setMainHeight(h)}
        extraContent={{
          top: (
            <>
              <PageTitle content='机会点' extra={<V2Operate operateList={operateList} onClick={(btn) => methods[btn.func]()} />}/>
              <Filter
                onSearch={(val) => setFilters(val)}
                onFilterChanged = {(val) => setExportFilters(val)}
              />
            </>
          ),
        }}
      >
        <List
          mainHeight={mainHeight}
          filters={filters}
          onClickDetail={onClickDetail}
          setPermissions={setPermissions}
        />
      </V2Container>

      {/* 模版选择框  */}
      <SelectTemplateModal
        setVisible={setSelectTemplateVisible}
        visible={selectTemplateVisible}
        setFormDrawerData={setFormDrawerData}
      />

      <PointDetail
        pointId={pointId}
        detailVisible={detailVisible}
        setFormDrawerData={setFormDrawerData}
        setDetailVisible={setDetailVisible}
        refreshDetail={refreshDetail}
        formDrawerData={formDrawerData}
        onSearch={() => setFilters({})}
        updateHandle={updateHandle}
      />
    </div>);
};

export default ChancePointManage;
