import { FC, useEffect, useRef, useState } from 'react';
import styles from './entry.module.less';
import V2Container from '@/common/components/Data/V2Container';
import V2Table from '@/common/components/Data/V2Table';
import { useMethods } from '@lhb/hook';
import { Popover } from 'antd';
import BusinessDetail from '@/common/components/business/Edit/components/BusinessDetail';
import { isNotEmpty, refactorPermissions, urlParams } from '@lhb/func';
import { amountStr } from '@/common/utils/ways';
import V2Operate from '@/common/components/Others/V2Operate';
import MapContainer from './components/MapContainer';
import { cancelCluster, getPlanCluster } from '@/common/api/networkplan';
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import ApprovalModal from './components/ApprovalModal';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
const Addproject: FC<any> = () => {
  const [params, setParams] = useState<any>(null);// 表格搜索参数，用于刷新
  const [mainHeight, setMainHeight] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);// 抽屉页开关
  const [permissions, setPermissions] = useState<any>([]);
  const [curSelectedBusiness, setCurSelectedBusiness] = useState<any>(null);// 记录从表格点击的商圈名称（需要跳转到地图页的具体点位）
  const [modalData, setModalData] = useState<boolean>(false);// 提交审批二次确认弹窗
  const [total, setTotal] = useState<number>(0);
  const isShowDeleteRef = useRef<boolean>(false);

  const {
    branchCompanyId, // 分公司id
    planId, // 版本id
  } = JSON.parse(decodeURI(urlParams(location.search)?.params || null)) || {};

  const toMap = (value) => {
    setCurSelectedBusiness({
      planClusterId: value?.id,
      lng: value?.centerLng,
      lat: value?.centerLat,
    });
    setIsOpen(true);
  };
  const defaultColumns = [
    { key: 'centerName', title: '商圈名称', width: 220, dragChecked: true, noTooltip: true, render(text, record) {
      // const loaded = false;
      return text ? (
        <Popover
          placement='topLeft'
          className='c-006 pointer'
          content={<BusinessDetail detail={record}/>}>
          <span onClick={() => toMap(record)} >{text}</span>
        </Popover>
      ) : '-';
    } },
    { key: 'provinceName', title: '省份', width: 100, dragChecked: true },
    { key: 'cityName', title: '城市', width: 100, dragChecked: true },
    { key: 'districtName', title: '城区', width: 100, dragChecked: true },
    {
      key: 'mainBrandsScore',
      title: '奶茶行业评分',
      width: 130,
      dragChecked: true,
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      render: (value) => Math.round(value) || '-'
    },
    {
      key: 'totalScore',
      title: '益禾堂评分',
      dragChecked: true,
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      width: 130,
      render: (value) => Math.round(value) || '-'
    },
    {
      key: 'salesAmountPredict',
      title: '预测日营业额',
      width: 130,
      dragChecked: true,
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      // render: (value) => Math.round(value) || '-'
      render: (val: number, record: any) => (<>
        {
          isNotEmpty(record?.lowSalesAmountPredict) && isNotEmpty(record?.upSalesAmountPredict) ? <>
            {amountStr(record.lowSalesAmountPredict)}-{amountStr(record.upSalesAmountPredict)}
          </> : <>
            {isNotEmpty(record?.lowSalesAmountPredict) ? amountStr(record.lowSalesAmountPredict) : ''}
            {
              !isNotEmpty(record?.lowSalesAmountPredict) && !isNotEmpty(record?.upSalesAmountPredict) ? '-' : ''
            }
            {isNotEmpty(record?.upSalesAmountPredict) ? amountStr(record.upSalesAmountPredict) : ''}
          </>
        }
      </>
      )
    },
    {
      key: 'mainBrandsProba',
      title: '奶茶行业适合度',
      width: 145,
      dragChecked: true,
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      render: (value) => value || '-'
    },
    {
      key: 'proba',
      title: '品牌适合度',
      dragChecked: true,
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      width: 130,
      render: (value) => value || '-'
    },
    { key: 'firstLevelCategory', title: '商圈类型', width: 110, dragChecked: true },
    { key: 'secondLevelCategory', title: '业态', width: 100, dragChecked: true },
    {
      key: 'recommendStores',
      title: '推荐开店数',
      dragChecked: true,
      sorter: true,
      width: 130,
      render: (value) => value || '-'
    },
    {
      key: 'openStores',
      title: '已开店数',
      dragChecked: true,
      sorter: true,
      width: 130,
      render: (value) => value || '-'
    },
    {
      key: 'operate',
      title: '操作',
      fixed: 'right',
      dragDisabled: true,
      dragChecked: true,
      width: 100,
      render: (val: any[], record: any) => (
        <V2Operate
          operateList={refactorPermissions(isShowDeleteRef.current ? [{ event: 'plan:delete', name: `删除` }] : [])}
          onClick={(btn: any) => methods[btn.func](record)}
        />
      )
    },
  ];

  const methods = useMethods({
    async onFetch(params) {
      const _params = {
        branchCompanyId,
        planId,
        showChildCompanyAddPlanned: 1, // 是否展示分公司是否生效后添加需要审批的规划(0:否 1:是)
        ...params
      };
      const data = await getPlanCluster(_params);
      data.meta.permissions.map((item) => {
        item.type = item.event === 'addPLanCluster' ? 'default' : 'primary';
      });
      setPermissions(data.meta.permissions);
      isShowDeleteRef.current = !!data.meta.permissions.length;
      setTotal(data.totalNum);
      return {
        dataSource: data.objectList,
        count: data.totalNum
      };
    },
    onRefresh() {
      setParams({});
    },
    // 删除
    handleDelete(record) {
      V2Confirm({
        onSure: (modal: any) => {
          // https://yapi.lanhanba.com/project/532/interface/api/55677
          const params = {
            ids: [record.id],
            childCompanyId: branchCompanyId
          };
          cancelCluster(params).then((val) => {
            if (val) {
              methods.onRefresh();
              V2Message.success('删除成功！');
            }
          });
          modal.destroy();
        },
        content: '是否确定删除该商圈？'
      });
    },
    // 添加规划商圈
    handleAddPLanCluster() {
      setIsOpen(true);
    },
    // 提交审批按钮
    handleAddPLanClusterSubmit() {
      setModalData(true);
    }
  });
  useEffect(() => {
    if (!isOpen) {
      setCurSelectedBusiness(null);
    }
  }, [isOpen]);
  return (
    <div className={styles.container}>
      <V2Container
        style={{ height: '100%' }}
        emitMainHeight={h => setMainHeight(h)}
        extraContent={{
          top: <div className={styles.top}>
            <div className='fs-16 bold c-222'>添加规划商圈</div>
            <div className='fs-12 c-999'>（最多添加5个）</div>
            { total === 0 ? <></> : <div className={styles.rightBtn}>
              <V2Operate
                operateList={refactorPermissions(permissions)}
                onClick={(btn: any) => methods[btn.func]()}
              />
            </div>}
          </div>
        }}
      >
        <V2Table
          rowKey='id'
          filters={params}
          // 勿删! 64：分页模块总大小、48抽屉上下边距、32总共商圈数量、94+16筛选项、28分公司名称、56tabs
          scroll={{ y: mainHeight - 64 - 45 }}
          defaultColumns={defaultColumns}
          hideColumnPlaceholder
          tableSortModule='consoleRecommendAddProject'
          emptyRender={<div>
            <span className='c-999'>请在地图上 </span>
            <span className='c-006 pointer' onClick={() => setIsOpen(true)}>添加规划商圈</span>
            <span className='c-999'>~</span>
          </div>}
          onFetch={methods.onFetch}
          pagination={false}
        />
      </V2Container>

      {/* 提交审批 */}
      <ApprovalModal
        modalData={modalData}
        setModalData={setModalData}
        successCb={methods.onRefresh}
      />
      {/* 抽屉地图页 */}
      <V2Drawer
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className={styles.drawer}
        destroyOnClose
      >
        <MapContainer
          onRefresh={methods.onRefresh}
          curSelectedBusiness={curSelectedBusiness}
          total={total}
        />
      </V2Drawer>
    </div>
  );
};

export default Addproject;
