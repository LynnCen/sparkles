/**
 * @Description 审批工作台
 * 该工作台用于的场景是接入了中台审批流
 */

import { FC, useEffect, useState } from 'react';
import { Badge, Form } from 'antd';

import styles from './entry.module.less';

import V2Container from '@/common/components/Data/V2Container';
import { isNotEmptyAny, isWxWorkBrowser, urlParams } from '@lhb/func';
import DetailDrawer from './components/DetailDrawer';
import V2Table from '@/common/components/Data/V2Table';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import V2Tabs from '@/common/components/Data/V2Tabs';
import Filter from './components/FIlter';
import { APPROVE_STATUS_ENUMS, FiftersType, TabCountType, WORKBENCH_TABS_ENUMS } from './ts-config';

import { ApprovalType, ApprovalTypeValue } from '@/common/components/business/ExpandStore/ts-config';

import { getTabsApproveList, getTabsCount } from '@/common/api/expandStore/approveworkbench';
import { dispatchNavigate } from '@/common/document-event/dispatch';
// import V2Message from '@/common/components/Others/V2Hint/V2Message';

/** 状态颜色值 */
const statusColor = {
  [APPROVE_STATUS_ENUMS.WAITING_DISPOSE]: '#FF861D',
  [APPROVE_STATUS_ENUMS.APPROVE_ACCESS]: '#009963',
  [APPROVE_STATUS_ENUMS.APPROVE_REFUSE]: '#F53F3F',
  [APPROVE_STATUS_ENUMS.APPROVE_REJECT]: '#F53F3F',
};

// const renderTabBar:any = (props, DefaultTabBar) => {
//   return (
//     <Badge count={5}>
//       <DefaultTabBar {...props}/>
//     </Badge>
//   );
// };

/** 审批工作台 */
const ApproveWorkbench: FC<any> = ({ location }) => {
  const [form] = Form.useForm();
  const [tabCount, setTabCount] = useState<TabCountType>(); // 工作台tab的数量
  const [filters, setFilters] = useState<FiftersType>(); // 参数变化的时候会触发请求
  const [activeTabKey, setActiveTabKey] = useState<string>('1'); // tab的key值记录
  const [detailVisible, setDetailVisible] = useState<boolean>(false); // '审批详情'组件是否可见
  const [selDetailId, setSelDetailId] = useState<any>(0);
  const [mainHeight, setMainHeight] = useState<number>(0);

  useEffect(() => {
    // 通过企业微信消息通知过来的需要直接唤起详情弹窗
    if (location?.search && isWxWorkBrowser()) {
      const params = urlParams(location.search);
      if (params.id && params.type) {
        const isShowTips = [ApprovalType.ShopProtect].includes(params.type);
        if (isShowTips) {
          V2Confirm({
            onSure: onCloseModal,
            maskClosable: true,
            title: '温馨提示',
            content: '请前往移动端查阅或操作',
            noFooter: true,
          });
          return;
        }
        setSelDetailId(params.id);
        setDetailVisible(true);
      }
    }
  }, [location]);

  useEffect(() => {
    const filters: FiftersType = {
      tab: Number(activeTabKey),
      keyword: undefined, // tab切换的时候重置表单
      typeValueIdList: undefined,
      statusIdList: undefined,
    };

    setFilters(filters);
  }, [activeTabKey]);

  /**
   * @description 获取顶部tab各种消息数量
   */
  const getCount = async () => {
    const data: TabCountType = await getTabsCount();

    setTabCount(data);
  };

  /**
   * @description 顶部tab项发生改变
   * @param activeKey 当前点击活跃的tab的key值
   */
  const onTabChange = activeKey => {
    setActiveTabKey(activeKey);

    form.resetFields(); // 重置搜索表单
  };

  /**
   * @description 点击搜索框模糊查询
   * @param fields 搜索框参数
   */
  const onSearch = () => {
    const _params = form.getFieldsValue();
    const params: FiftersType = {
      ..._params,
      tab: Number(activeTabKey),
    };
    console.log('onSearch', _params, params);

    // 搜索
    setFilters(params);
  };

  /**
   * @description 获取加载table表格数据。该函数依赖fitles变化自动触发
   * @param params fitles和搜索框参数（当前页面只有keyword）
   * @return table数据
   */
  const loadData = async params => {
    const data = await getTabsApproveList({ ...params });

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
  const onClickDetail = record => {
    // 网规审批类型，跳转到网规详情
    if (record.type === ApprovalType.PlanSpot && record.typeValue === ApprovalTypeValue.PlanDelivery) {
      dispatchNavigate(`/recommend/networkplanapprove?id=${record.id}`);
      return;
    }
    if (record.type === ApprovalType.PlanSpot && record.typeValue === ApprovalTypeValue.AddNetWork) {
      dispatchNavigate(`/recommend/addprojectapprove?id=${record.id}`);
      return;
    }

    const isShowTips = [ApprovalType.ShopProtect].includes(record.type);
    // 点位保护申请显示
    if (isShowTips) {
      V2Confirm({
        onSure: onCloseModal,
        maskClosable: true,
        title: '温馨提示',
        content: '请前往移动端查阅或操作',
        noFooter: true,
      });
    } else {
      setSelDetailId(record.id);
      setDetailVisible(true);
    }
  };

  /** 关闭提示弹窗 */
  const onCloseModal = modal => {
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
      key: WORKBENCH_TABS_ENUMS.COPY,
      label: (
        <Badge dot={Boolean(tabCount?.ccUnreadCount)} size='small'>
          <span>抄送我的 {tabCount?.iccCount || 0}</span>
        </Badge>
      ),
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
        ) : (
          '-'
        );
      },
    },
    {
      key: 'typeValueName',
      title: '申请类型',
      width: 'auto',
      dragChecked: true,
      render: value => {
        return isNotEmptyAny(value) ? value : '-';
      },
    },
    {
      key: 'creator',
      title: '发起人',
      dragChecked: true,
      render: value => {
        return isNotEmptyAny(value) ? value : '-';
      },
    },
    {
      key: 'createdAt',
      title: '发起时间',
      dragChecked: true,
      render: value => {
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
        ) : (
          '-'
        );
      },
    },
  ];

  return (
    <div>
      <V2Container
        className={styles.approveWorkbench}
        // 上下padding 9px 24px 标题height 48px
        style={{ height: 'calc(100vh - 35px - 48px)' }}
        emitMainHeight={h => setMainHeight(h)}
        extraContent={{
          top: (
            <>
              <V2Tabs
                items={tabItems}
                onChange={onTabChange}
                // renderTabBar={renderTabBar}
              />
              <Filter form={form} onSearch={onSearch}/>
            </>
          ),
        }}
      >
        <V2Table
          defaultColumns={defaultColumns}
          onFetch={loadData}
          hideColumnPlaceholder={true}
          filters={filters}
          rowKey='id'
          // 64是分页模块的总大小， 42是table头部
          scroll={{ y: mainHeight - 64 - 42 - 56 }}
        />
      </V2Container>

      {/* 审批抽屉 */}
      <DetailDrawer
        id={selDetailId} // recordId
        open={detailVisible} // 是否可见
        setOpen={setDetailVisible}
        onRefresh={onRefresh} // 刷新列表
      />
    </div>
  );
};

export default ApproveWorkbench;
