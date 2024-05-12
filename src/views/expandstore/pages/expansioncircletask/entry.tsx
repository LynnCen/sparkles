/**
 * @Description 标准版拓店任务
 */
import { FC, useEffect, useMemo, useState } from 'react';
import { downloadFile, isWxWorkBrowser, matchQuery, refactorPermissions, urlParams } from '@lhb/func';
import V2Tabs from '@/common/components/Data/V2Tabs';
import V2Container from '@/common/components/Data/V2Container';
import V2Operate from '@/common/components/Others/V2Operate';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import styles from './entry.module.less';
import { useMethods } from '@lhb/hook';
import { TaskTab } from '@/common/components/business/ExpandStore/ts-config';
import { circleTaskListExport, getExpansionCircleTaskList } from '@/common/api/expandStore/expansionCircleTask';
import CircleTaskCreateDrawer from '@/common/components/business/ExpandStore/CircleTaskCreateDrawer';
import CircleTaskDetailDrawer from '@/common/components/business/ExpandStore/CircleTaskDetailDrawer';
import Filter from './components/Filter';
import List from './components/List';
import { initialTab } from './page.config';
import CircleWaitAsignDetailDrawer from '@/common/components/business/ExpandStore/CircleWaitAsignDetailDrawer';


type Tab = Parameters<typeof V2Tabs>[0]['items'];

const ExpansionCircleTask: FC<any> = ({ location }) => {
  const query_Id: number | string = urlParams(location.search)?.id; // 外部链接跳转传递的拓店任务链接
  const [mainHeight, setMainHeight] = useState<number>(0);
  const [filters, setFilters] = useState<any>({}); // 参数变化的时候会触发请求更新table表格
  const [exportFilters, setExportFilters] = useState<any>({}); // 筛选项输入实时变化时，同步给导出参数
  const [operateList, setOperateList] = useState<any>([]);
  const [showCreateDrawer, setShowCreateDrawer] = useState<boolean>(false); // 创建拓店任务是否可见
  const [showDetailDrawer, setShowDetailDrawer] = useState<boolean>(false); // 拓店任务详情是否可见
  const [taskId, setTaskId] = useState<any>(0);
  const [tabActiveKey, setTabActiveKey] = useState<string>(TaskTab.Created); // 当前tab值
  const [deletePermission, setDeletePermission] = useState<boolean>(false); // 删除权限
  const [loading, setLoading] = useState<boolean>(true);
  const [tabList, setTabList] = useState<Tab>(initialTab);
  const [circleWaitAsignDetail, setCircleWaitAsignDetail] = useState<boolean>(false);

  const isWaitAsign = useMemo(() => {
    return String(filters?.tab) === TaskTab.WaitAssign;
  }, [filters]);


  useEffect(() => {
    if (location?.search && isWxWorkBrowser()) {
      const id = matchQuery(location.search, 'id');
      if (id) {
        setTaskId(id);
        setShowDetailDrawer(true);
      }
    }
    getStatisticsTabs();
  }, [location]);

  useEffect(() => {
    if (!query_Id) return;
    // 当外部传递id的时候打开详情信息
    setTaskId(query_Id);
    setShowDetailDrawer(true);
  }, [query_Id]);


  // 统计各tabs数据
  const getStatisticsTabs = async() => {

    const filterTabs:typeof initialTab = [];
    for (const item of initialTab) {
      const data = await getExpansionCircleTaskList({
        tab: +item.key, // table第一次请求时不依赖于外部filters参数，为了确保带上tab参数这里再次赋值
      });
      if (data?.totalNum > 0) {
        filterTabs.push({
          ...item,
          label: item.label + ' ' + data?.totalNum
        });
      }
    }
    if (filterTabs.length <= 1) return setTabList([]);
    setTabList(filterTabs);
  };

  /**
   * @description 操作后刷新列表
   */
  const onRefresh = () => {
    setFilters({
      tab: +tabActiveKey,
    });
  };

  /**
   * @description 点击搜索框模糊查询
   * @param fields 搜索框参数
   */
  const onSearch = (value: any) => {
    setFilters({
      ...value,
      tab: +tabActiveKey,
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
      tab: +tabKey,
    });
  };

  /**
   * @description 点击名称查看拓店任务详情
   * @param record 当前选中点击某一行的数据
   */
  const onClickDetail = (record: any, tabType:string) => {
    console.log('onClickDetail', record, tabType);
    if (tabType && String(tabType) === TaskTab.WaitAssign) {
      setCircleWaitAsignDetail(true);
    } else {
      setShowDetailDrawer(true);
    }
    setTaskId(record.id);
  };

  /**
   * @description 设置顶部操作按钮
   * @return
   */
  const handlePermissions = (perms: any[]) => {
    const allPerms = perms || [];
    // 手动插入创建权限
    // if (!allPerms.find(itm => itm.event === 'standardTask:create')) {
    //   allPerms.unshift({
    //     event: 'standardTask:create',
    //     name: '创建拓店任务'
    //   });
    // }
    const deleteIndex = allPerms.findIndex((itm) => itm.event === 'standardTask:delete');
    if (deleteIndex > -1) {
      allPerms.splice(deleteIndex, 1);
      setDeletePermission(true);
    }
    const list = refactorPermissions(allPerms);
    const opList = list.map((item, idx) => ({
      name: item.text,
      event: item.event,
      func: item.func,
      type: idx < list.length - 1 ? 'default' : 'primary',
      useLoadingWidthAsync: item.event === 'export', // 导出按钮点击后启用loading
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
        tab: +tabActiveKey,
      };
      return new Promise((res) => {
        circleTaskListExport(params)
          .then(({ url, name }: any) => {
            if (url) {
              downloadFile({
                name,
                downloadUrl: url,
              });
            } else {
              V2Message.warning('表格数据异常或无数据');
            }
          })
          .finally(() => {
            res(true);
          });
      });
    },
  });

  // 在这里编写组件的逻辑和渲染
  return (
    <div>
      <V2Container
        className={styles.expansionTaskContainer}
        // 上下padding各16px  标题height 48px
        style={{ height: 'calc(100vh - 32px - 48px)', overflowY: loading ? 'hidden' : 'visible' }}
        emitMainHeight={(h) => setMainHeight(h)}
        extraContent={{
          top: (
            <div className={styles.topWrapper}>
              <V2Tabs
                items={tabList}
                activeKey={tabActiveKey}
                onChange={onTabChange}
                tabBarExtraContent={<V2Operate operateList={operateList} onClick={(btn) => methods[btn.func]()} />}
              />
              <Filter isWaitAsign={isWaitAsign} onSearch={onSearch} onFilterChanged={(val) => setExportFilters(val)} />
            </div>
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
          setLoading={setLoading}
        />
      </V2Container>
      {showCreateDrawer && (
        <CircleTaskCreateDrawer showDrawer={showCreateDrawer} setShowDrawer={setShowCreateDrawer} refresh={onRefresh} />
      )}
      {circleWaitAsignDetail && <CircleWaitAsignDetailDrawer
        id={taskId}
        open={circleWaitAsignDetail}
        setOpen={setCircleWaitAsignDetail}
        outterRefresh={onRefresh}
      />}
      {
        showDetailDrawer &&
  <CircleTaskDetailDrawer
    id={taskId}
    open={showDetailDrawer}
    setOpen={setShowDetailDrawer}
    outterRefresh={onRefresh}
  />
      }
    </div>
  );
};

export default ExpansionCircleTask;
