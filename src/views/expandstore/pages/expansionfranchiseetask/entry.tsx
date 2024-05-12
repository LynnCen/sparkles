/**
 * @Description 标准版拓店任务
 */
import { FC, useEffect, useState } from 'react';
import { downloadFile, isWxWorkBrowser, matchQuery, refactorPermissions, urlParams } from '@lhb/func';
import V2Tabs from '@/common/components/Data/V2Tabs';
import V2Container from '@/common/components/Data/V2Container';
import V2Operate from '@/common/components/Others/V2Operate';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import PageTitle from '@/common/components/business/PageTitle';
import styles from './entry.module.less';
import Filter from './components/Filter';
import List from './components/List';
import TaskCreateDrawer from '@/common/components/business/ExpandStore/TaskCreateDrawer';
import TaskDetailDrawer from '@/common/components/business/ExpandStore/TaskDetailDrawer';
import { useMethods } from '@lhb/hook';
import { taskListExport } from '@/common/api/expandStore/expansiontask';
import { TaskTab } from '@/common/components/business/ExpandStore/ts-config';

const ExpansionFranchiseeTask: FC<any> = ({ location }) => {
  const queryId: number | string = urlParams(location.search)?.id; // 外部链接跳转传递的拓店任务链接
  const [mainHeight, setMainHeight] = useState<number>(0);
  const [filters, setFilters] = useState<any>({}); // 参数变化的时候会触发请求更新table表格
  const [exportFilters, setExportFilters] = useState<any>({}); // 筛选项输入实时变化时，同步给导出参数
  const [operateList, setOperateList] = useState<any>([]);
  const [showCreateDrawer, setShowCreateDrawer] = useState<boolean>(false); // 创建拓店任务是否可见
  const [showDetailDrawer, setShowDetailDrawer] = useState<boolean>(false); // 拓店任务详情是否可见
  const [taskId, setTaskId] = useState<any>(0);
  const [tabActiveKey, setTabActiveKey] = useState<string>(TaskTab.Created); // 当前tab值
  const [deletePermission, setDeletePermission] = useState<boolean>(false); // 删除权限

  useEffect(() => {
    if (location?.search && isWxWorkBrowser()) {
      const id = matchQuery(location.search, 'id');
      if (id) {
        setTaskId(id);
        setShowDetailDrawer(true);
      }
    }
  }, [location]);

  useEffect(() => {
    if (!queryId) return;
    // 当外部传递id的时候打开详情信息
    setTaskId(queryId);
    setShowDetailDrawer(true);
  }, [queryId]);

  /**
   * @description 操作后刷新列表
   */
  const onRefresh = () => {
    setFilters({
      tab: +tabActiveKey
    });
  };

  /**
   * @description 点击搜索框模糊查询
   * @param fields 搜索框参数
   */
  const onSearch = (value: any) => {
    setFilters({
      ...value,
      tab: +tabActiveKey
    });
  };

  /**
   * @description tab切换
   * @param tabKey
   */
  const onTabChange = (tabKey: string) => {
    setTabActiveKey(tabKey);
    setFilters({
      ...filters,
      tab: +tabKey
    });
  };

  /**
   * @description 点击名称查看拓店任务详情
   * @param record 当前选中点击某一行的数据
   */
  const onClickDetail = (record: any) => {
    setShowDetailDrawer(true);
    setTaskId(record.id);
  };

  /**
   * @description 设置顶部操作按钮
   * @return
   */
  const handlePermissions = (perms: any[]) => {
    const allPerms = perms || [];
    // 手动插入创建权限
    if (!allPerms.find(itm => itm.event === 'standardTask:create')) {
      allPerms.unshift({
        event: 'standardTask:create',
        name: '创建拓店任务'
      });
    }
    const deleteIndex = allPerms.findIndex(itm => itm.event === 'standardTask:delete');
    if (deleteIndex > -1) {
      allPerms.splice(deleteIndex, 1);
      setDeletePermission(true);
    }
    const list = refactorPermissions(allPerms);
    const opList = list.map((item) => ({
      name: item.text,
      event: item.event,
      func: item.func,
      type: item.isBatch ? 'default' : 'primary',
      useLoadingWidthAsync: item.event === 'export'// 导出按钮点击后启用loading
    }));
    setOperateList(opList);
  };

  const methods = useMethods({
    handleCreate() {
      setShowCreateDrawer(true);
    },
    handleExport() {
      // 为了使用按钮loading必须按这种promise写法
      const params = {
        ...exportFilters,
        tab: +tabActiveKey
      };
      return new Promise((res) => {
        taskListExport(params).then(({ url, name }: any) => {
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

  // 在这里编写组件的逻辑和渲染
  return (
    <div>
      <V2Container
        className={styles.expansionTaskContainer}
        // 上下padding各16px  标题height 48px
        style={{ height: 'calc(100vh - 32px - 48px)' }}
        emitMainHeight={h => setMainHeight(h)}
        extraContent={{
          top: (
            <>
              <PageTitle
                tabs={<V2Tabs
                  items={[
                    { label: '我发起的', key: TaskTab.Created },
                    { label: '指派给我的', key: TaskTab.AssignMe },
                  ]}
                  activeKey={tabActiveKey}
                  onChange={onTabChange}
                />}
                extra={<V2Operate operateList={operateList} onClick={(btn) => methods[btn.func]()}/>}
              />
              <Filter
                onSearch={onSearch}
                onFilterChanged = {(val) => setExportFilters(val)}
              />
            </>
          ),
        }}
      >
        <List
          mainHeight={mainHeight}
          filters={filters}
          setFilters={setFilters}
          tabActiveKey={tabActiveKey}
          onClickDetail={onClickDetail}
          handlePermissions={handlePermissions}
          deletePermission={deletePermission}
        />
      </V2Container>

      <TaskCreateDrawer
        showDrawer={showCreateDrawer}
        setShowDrawer={setShowCreateDrawer}
        refresh={onRefresh}
      />
      <TaskDetailDrawer
        id={taskId}
        open={showDetailDrawer}
        setOpen={setShowDetailDrawer}
        outterRefresh={onRefresh}
      />
    </div>
  );
};

export default ExpansionFranchiseeTask;
