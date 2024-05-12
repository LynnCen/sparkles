/**
 * @Description 审批工作台
 * @Ques 1. 切换到消息重复的接口请求---原因：table重新渲染导致onFetch默认执行一次，fitles变化也会导致onFetch执行
 */

import { useEffect, useMemo, useState } from 'react';
import { Button, Form } from 'antd';

import styles from './entry.module.less';

import V2Container from '@/common/components/Data/V2Container';
import WorkbenchTabs from './components/WorkbenchTab';
import { isArray, isNotEmptyAny } from '@lhb/func';
import SelectType from './components/SelectType';
import SpotApproval from './components/SpotApproval';
import DesignApproval from './components/DesignApproval';
import ContractApproval from './components/ContractApproval';
import DetailDrawer from './components/DetailDrawer';
import V2Table from '@/common/components/Data/V2Table';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import V2Tabs from '@/common/components/Data/V2Tabs';

import {
  APPROVE_STATUS_ENUMS,
  APPROVE_TYPE_ENUMS,
  FiftersType,
  MSG_STATUS_ENUMS,
  MSG_TYPE_ENUMS,
  PermissionsType,
  TabCountType,
  WORKBENCH_TABS_ENUMS,
  YN_PROMISSION_ENUMS,
} from './ts-config';

import {
  getTabsApproveList,
  getTabsCount,
  getTabsMsgList,
  setMsgRead,
} from '@/common/api/approveworkbench';

/** 状态颜色值 */
const statusColor = {
  [APPROVE_STATUS_ENUMS.WAITING_DISPOSE]: '#006AFF',
  [APPROVE_STATUS_ENUMS.APPROVE_ACCESS]: '#009963',
  [APPROVE_STATUS_ENUMS.APPROVE_REFUSE]: '#F53F3F',
  [APPROVE_STATUS_ENUMS.APPROVE_REJECT]: '#FF861D',
};

/** 按钮权限判断hook */
const usePermissionCheck = (permission, event) => {
  return useMemo(() => {
    return permission.some((item) => item.event === event);
  }, [permission, event]);
};

/** 审批工作台 */
const ApproveWorkbench = () => {

  const [form] = Form.useForm();
  const [permission, setPermission] = useState<PermissionsType[]>([]); // 审批工作台权限列表
  const [tabCount, setTabCount] = useState<TabCountType>(); // 工作台tab的数量
  const [filters, setFilters] = useState<FiftersType>(); // 参数变化的时候会触发请求
  const [activeTabKey, setActiveTabKey] = useState<string>('1'); // tab的key值记录
  const [msgActivityKey, setMsgActivityKey] = useState<string>('0'); // 消息tab的key值记录
  const [typeVisible, setTypeVisible] = useState<boolean>(false); // '发起审批'组件是否可见
  const [spotVisible, setSpotVisible] = useState<boolean>(false); // 发起点位审批抽屉是否可见
  const [designVisible, setDesignVisible] = useState<boolean>(false); // 发起设计审批抽屉是否可见
  const [contractVisible, setContractVisible] = useState<boolean>(false); // 发起合同审批抽屉是否可见
  const [detailVisible, setDetailVisible] = useState<boolean>(false); // '审批详情'组件是否可见
  const [isMsgTab, setIsMsgTab] = useState<boolean>(false); // 是否为'消息'tab
  const [selDetail, setSelDetail] = useState<any>({});
  const [mainHeight, setMainHeight] = useState<number>(0);


  useEffect(() => {
    const filters: FiftersType = {
      tab: Number(activeTabKey),
      isRead: isMsgTab ? Number(msgActivityKey) : undefined,
      keyword: undefined, // tab切换的时候重置表单
    };

    setFilters(filters);
  }, [activeTabKey, msgActivityKey, isMsgTab]);

  /**
	 * @description 获取顶部tab各种消息数量
	 */
  const getCount = async () => {
    const data: TabCountType = await getTabsCount();
    const { permissions } = data;

    isArray(permissions) && setPermission(permissions);
    setTabCount(data);
  };

  /**
	 * @description 顶部tab项发生改变
	 * @param activeKey 当前点击活跃的tab的key值
	 */
  const onTabChange = (activeKey) => {
    setIsMsgTab(activeKey === '4');
    setActiveTabKey(activeKey);

    form.resetFields(); // 重置搜索表单
  };

  /**
	 * @description 消息tab项发生改变
	 * @param activeKey 当前点击活跃的消息tab的key值 '0'-待阅 '1'-已阅
	 */
  const onMsgTabChange = (activeKey) => {
    setMsgActivityKey(activeKey);

    form.resetFields(); // 重置搜索表单
  };

  /**
	 * @description 点击搜索框模糊查询
	 * @param fields 搜索框参数
	 */
  const onSearch = () => {
    const _params = form.getFieldsValue();
    const { keyword } = _params;

    const params: FiftersType = {
      tab: Number(activeTabKey),
      isRead: isMsgTab ? Number(msgActivityKey) : undefined,
      keyword,
    };

    // 搜索
    setFilters(params);
  };

  /**
	 * @description 获取加载table表格数据。该函数依赖fitles变化自动触发
	 * @param params fitles和搜索框参数（当前页面只有keyword）
	 * @return table数据
	 */
  const loadData = async (params) => {
    const msgParams = {
      ...params,
      isRead: Number(msgActivityKey), // 是否已读
      type: 10, // 后端固定传值10
      typeValues: [1, 2, 3], // 后端固定传值[1,2,3]
    };

    const data = isMsgTab
      ? await getTabsMsgList({ ...msgParams })
      : await getTabsApproveList({ ...params });

    getCount();
    return {
      dataSource: data.objectList,
      count: data.totalNum,
    };
  };

  /**
   * @description 刷新tab上个数、列表数据
   */
  const onRefresh = () => {
    getCount();
    onSearch();
  };

  /**
   * @description 点击名称查看审批或者详情
   * @param record 当前选中点击某一行的数据
   */
  const onClickDetail = (record) => {
    const isShowTips =
			[APPROVE_TYPE_ENUMS.DEVELOP_CHANGE, APPROVE_TYPE_ENUMS.POINT_PROTECT].includes(record.type) ||
			[MSG_TYPE_ENUMS.DEVELOP_CHANGE, MSG_TYPE_ENUMS.POINT_PROTECT].includes(record.typeValue
			);
    // 开发异动和点位保护申请显示
    if (isShowTips) {
      V2Confirm({
        onSure: onCloseModal,
        maskClosable: true,
        title: '温馨提示',
        content: '请前往移动端查阅或操作',
        noFooter: true,
      });
    } else {
      setSelDetail(record);
      setDetailVisible(true);
    }
    if (record.isRead === MSG_STATUS_ENUMS.NOT_READ) {
      setMsgRead({
        id: record.id,
      }).then(() => {
        onSearch();
      });
    }
  };

  /** 关闭提示弹窗 */
  const onCloseModal = (modal) => {
    modal.destroy();
  };

  /** 顶部tab项 */
  const tabItems = [
    {
      key: WORKBENCH_TABS_ENUMS.WAITING_DISPOSE,
      label: `待我处理 ${tabCount?.itoDoCount || 0} `,
    },
    {
      key: WORKBENCH_TABS_ENUMS.MY_APPROVE,
      label: `我发起的 ${tabCount?.isponsorCount || 0}`,
    },
    {
      key: WORKBENCH_TABS_ENUMS.HAS_SOLVED,
      label: `已处理 ${tabCount?.ihaveDoneCount || 0}`,
    },
    {
      key: WORKBENCH_TABS_ENUMS.APPROVE_MESSAGE,
      label: `审批消息 ${tabCount?.msgCount || 0}`,
    },
  ];

  /** 表格列表项  */
  const defaultColumns = [
    {
      key: 'name',
      title: '名称',
      dragChecked: true,
      importWidth: true,
      width: 400,
      render: (value, record) => {
        return isNotEmptyAny(value) ? (
          <span className={styles.name} onClick={() => onClickDetail(record)}>
            {value}
          </span>
        ) : '-';
      },
    },
    {
      key: 'typeName',
      title: '申请类型',
      dragChecked: true,
      whiteTooltip: false,
      render: (value) => {
        return isNotEmptyAny(value) ? value : '-';
      },
    },
    {
      key: 'creator',
      title: '发起人',
      dragChecked: true,
      render: (value) => {
        return isNotEmptyAny(value) ? value : '-';
      },
    },
    {
      key: 'createdAt',
      title: '发起时间',
      dragChecked: true,
      render: (value) => {
        return isNotEmptyAny(value) ? value : '-';
      },
    },
    {
      key: 'status',
      title: '审批状态',
      dragChecked: true,
      width: 'auto',
      render: (value, record) => {
        return isNotEmptyAny(value) ? (
          <div className={styles.approveStatus}>
            <span
              className={styles.approveStatusIcon}
              style={{
                backgroundColor: statusColor[value],
              }}
            />
            {record.statusName}
          </div>
        ) : '-';
      },
    },
  ];

  /** 消息-表格列表项 */
  const messageColunms = [
    {
      key: 'title',
      title: '标题',
      dragChecked: true,
      width: '1150px',
      render: (value, record) => {
        return isNotEmptyAny(value) ? (
          <span className={styles.name} onClick={() => onClickDetail(record)}>
            {value}
          </span>
        ) : '-';
      },
    },
  ];

  /** 是否有发起审批权限 */
  const hasCreatePermission = usePermissionCheck(permission, YN_PROMISSION_ENUMS.YN_APPROVAL_CREATE);

  return (
    <div>
      <V2Container
        className={styles.approveWorkbench}
        // 上下padding 9px 24px 标题height 48px
        style={{ height: 'calc(100vh - 35px - 48px)' }}
        emitMainHeight={(h) => setMainHeight(h)}
        extraContent={{
          top: (
            <>
              <V2Tabs
                items={tabItems}
                onChange={onTabChange}
                tabBarExtraContent={{
                  right: (
                    hasCreatePermission && <Button type='primary' onClick={() => setTypeVisible(true)}>
											发起审批
                    </Button>
                  ),
                }}
              />
              <WorkbenchTabs
                form={form}
                onSearch={onSearch}
                isMsgTab={isMsgTab}
                msgActivityKey={msgActivityKey}
                onMsgTabChange={onMsgTabChange}
              />
            </>
          ),
        }}
      >
        <V2Table
          key={isMsgTab} // 当key值不同的时候强制重新渲染table,获取新的表头项
          defaultColumns={isMsgTab ? messageColunms : defaultColumns}
          onFetch={loadData}
          hideColumnPlaceholder={true}
          filters={filters}
          rowKey='id'
          // 64是分页模块的总大小， 42是table头部
          scroll={{ y: mainHeight - 64 - 42 - 56 }}
        />
      </V2Container>
      <SelectType
        visible={typeVisible}
        permissions={permission}
        usePermissionCheck={usePermissionCheck}
        setVisible={setTypeVisible}
        onSpotApproval={() => setSpotVisible(true)}
        onDesignApproval={() => setDesignVisible(true)}
        onContractApproval={() => setContractVisible(true)}/>
      {/* 权限控制 */}
      <SpotApproval open={spotVisible} setOpen={setSpotVisible} onRefresh={onRefresh}/>
      <DesignApproval open={designVisible} setOpen={setDesignVisible} onRefresh={onRefresh}/>
      <ContractApproval open={contractVisible} setOpen={setContractVisible} onRefresh={onRefresh}/>

      {/* 属于消息时用sourceId，除此以外是审批记录用id */}
      <DetailDrawer
        id={selDetail.sourceId || selDetail.id}
        open={detailVisible}
        tab={Number(activeTabKey)}
        setOpen={setDetailVisible}
        onRefresh={onRefresh}/>
    </div>);
};

export default ApproveWorkbench;
