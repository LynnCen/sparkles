import { FC, useEffect, useMemo, useRef, useState } from 'react';
import styles from './entry.module.less';
import BasicInfo from './components/BasicInfo';
import TableList from './components/TableList';
import { Button, Modal, message, List as ListCom } from 'antd';
import MapCon from './components/MapCon';
import { approvalReboot, denyApproval, getApprovalDetail, passApproval } from '@/common/api/expandStore/approveworkbench';
import { getDetail } from '@/common/api/networkplan';
import { isArray, urlParams } from '@lhb/func';
import ApprovalModal from './components/ApprovalModal';
import Rebuttal from '@/common/components/business/ExpandStore/Rebuttal';
import NetworkPlanLeftDetail from '@/common/components/business/NetworkPlanLeftDetail/index';
import V2Container from '@/common/components/Data/V2Container';
import { BUSINESS_FIT_ZOOM } from '@/common/components/AMap/ts-config';
import { BusinessAreaType, markerType } from './ts-config';
import BusinessDistrictDetail from '@/common/components/business/NetworkPlanLeftDetail/BusinessDistrictDetail';
// 以后不要再用这个第三方了，bug特别多
import VirtualList from 'rc-virtual-list';
import ListItem from './components/ListItem';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import V2Message from '@/common/components/Others/V2Hint/V2Message';



const NetworkPlanApprove: FC<any> = () => {
  const id = urlParams(location.search)?.id;

  const [activeTab, setActiveTab] = useState<string>(BusinessAreaType);
  const [isMap, setIsMap] = useState<boolean>(false);
  const [params, setParams] = useState<any>({});
  const [detail, setDetail] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [visible, setVisible] = useState<any>(false);
  const [approvalAction, setApprovalAction] = useState<string>(''); // rebut/reject
  const [rebuttalModal, setRebuttalModal] = useState<any>({ // 驳回弹窗
    open: false,
    data: null
  });
  const [detailData, setDetailData] = useState<any>({
    id: null,
    visible: false
  });
  const [selectedBusinessDistrict, setSelectedBusinessDistrict] = useState<any>({
    visible: false,
    di: null
  });// 选中的商区围栏
  const [amapIns, setAmapIns] = useState<any>(null);
  const [mainHeight, setMainHeight] = useState<number>(0);
  const [curSelectRightList, setCurSelectRightList] = useState<any>([]);

  const curClickTypeRef = useRef<any>(null);

  const getApprovalData = async() => {
    const data = await getApprovalDetail({ id });
    getCurDetail(+data.relationId);
    setDetail(data);
  };

  const getCurDetail = async(id) => {
    const res = await getDetail({ id: +id });
    setData(res);
  };

  // 拒绝
  const rejectHandle = () => {
    setApprovalAction('reject');
    setVisible(true);
  };
  const confirmReject = (reason) => {
    const params = {
      id: +id,
      reason,
      nodeCode: detail?.nodeCode
    };
    denyApproval(params).then(() => {
      message.success('操作成功');
      getApprovalData();
    });
  };

  const approveHandle = () => {
    Modal.confirm({
      title: `审核通过`,
      content: `确定审核通过？`,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        const params = {
          id: +id,
          nodeCode: detail?.nodeCode
        };
        passApproval(params).then(() => {
          message.success('操作成功');
          getApprovalData();
        });
      },
    });
  };

  // 驳回
  const rebutHandle = () => {
    setApprovalAction('rebut');
    const { nodes, nodeCode } = detail;
    // 判断运营后台的驳回配置，如果是允许用户自由驳回节点，使用setRebuttalModal，否则使用之前的驳回弹窗，驳回到指定节点
    const targetNode = nodes?.find((nodeItem: any) => nodeItem.nodeCode === nodeCode);
    if (targetNode) {
      const { alternateRejectNode } = targetNode;
      alternateRejectNode ? setRebuttalModal({
        open: true,
        data: {
          id: detail.id,
          nodeCode: detail.nodeCode,
        }
      }) : setVisible(true);
      return;
    }
    // 默认
    setVisible(true);
  };
  const rebuttalModalClose = () => {
    setRebuttalModal({
      open: false,
      data: null
    });
  };
  const rebuttalModalSuccess = () => {
    getApprovalData();
  };

  // 重新提交
  const rebootHandle = () => {
    V2Confirm({
      content: `确定要重新提交`,
      onSure() {
        approvalReboot({ id }).then(() => {
          V2Message.success('重新提交成功');
          getApprovalData();
        });
      }
    });
  };

  const backList = () => {
    // 缩放到合适的视角，DISTRICT_ZOOM+1,大于区级别聚合
    // amapIns?.setZoomAndCenter(DISTRICT_ZOOM + 1, [detail?.lng, detail?.lat], false, 300);

    curClickTypeRef.current = markerType.BusinessDistrictMarker;

    setDetailData({
      id: null,
      // index: null,
      visible: false
    });
  };
  // 点击进入详情
  const handleCell = (record: any) => {
    curClickTypeRef.current = markerType.AddressMarker;
    setDetailData({
      ...record,
      visible: true,
    });
  };

  const permissions = useMemo(() => {
    return detail && Array.isArray(detail.permissions) ? detail.permissions.map(item => item.event) : [];
  }, [detail]);

  const hasPermissions = useMemo(() => {
    const targetPerms = ['approve', 'reject', 'rebut', 'reboot'];
    return isArray(permissions) && permissions.some(itm => targetPerms.includes(itm));
  }, [permissions]);

  useEffect(() => {
    getApprovalData();
  }, []);

  useEffect(() => {
    if (!amapIns) return;
    // 处理从列表点击调到地图
    if (detailData?.visible && detailData?.listToMap) {
      amapIns?.setZoomAndCenter(BUSINESS_FIT_ZOOM, [detailData.centerLng, detailData.centerLat], true);
    }


  }, [amapIns, detailData?.id]);
  useEffect(() => {
    if (!amapIns) return;
    if (selectedBusinessDistrict?.visible &&
      selectedBusinessDistrict?.lng &&
      selectedBusinessDistrict?.lat) {
      amapIns?.setZoomAndCenter(BUSINESS_FIT_ZOOM, [selectedBusinessDistrict.lng, selectedBusinessDistrict.lat], true);
    }
  }, [amapIns, selectedBusinessDistrict?.businessAreaId]);
  return (
    <>
      <div
        className={styles.container}
        style={{ height: `calc(100vh - ${hasPermissions ? 160 : 80}px)` }}>
        <V2Container
          emitMainHeight={(h) => setMainHeight(h)}
        >
          {
            detailData?.visible || selectedBusinessDistrict.visible
              ? curClickTypeRef.current === markerType.AddressMarker ? <NetworkPlanLeftDetail
                type={detailData.type}
                id={detailData.id}
                backList={backList}
                style={{
                  width: 300,
                }}
              /> : <div
                style={{
                  backgroundColor: 'white',
                  height: `${mainHeight}px`,
                  overflowY: 'auto',
                }}
              >
                <BusinessDistrictDetail
                  detail={selectedBusinessDistrict}
                  backList={() => {
                  // 这里当返回后，肯定不是显示当前type，所以取另外一种详情
                  // !!注意，如果这里一共有三种类型，则行不通
                    curClickTypeRef.current = markerType.AddressMarker;
                    setSelectedBusinessDistrict({
                      id: null,
                      visible: false
                    });
                  }}
                />
                <ListCom>
                  {/* 虚拟列表 */}
                  <VirtualList
                    //  selectedBusinessDistrict.visible的时候换data
                    data={curSelectRightList}
                    // 这里的mainHeight是否需要根据selectedBusinessDistrict.visible改变
                    // 152px 顶部BusinessDistrictDetail大小
                    height={mainHeight - 152}
                    itemHeight={85}
                    itemKey='id'
                    className={styles.listCon}
                  >
                    {(item: any) => (
                      <ListCom.Item
                        key={item}
                        onClick={() => handleCell(item)}
                      >
                        <ListItem
                          item={item}
                          keywords={''}
                          selectedRowKeys={[]}
                          setSelectedRowKeys={() => {}}
                          isActive={false}
                          isBranch={activeTab === '2'}
                        />
                      </ListCom.Item>
                    )}
                  </VirtualList>
                </ListCom>
              </div>
              : <BasicInfo
                detail={detail}
                data={data}
              />
          }
        </V2Container>
        <>
          {
            isMap
              ? <div className={styles.rightMap}>
                <MapCon
                  setIsMap={setIsMap}
                  detail={data}
                  detailData={detailData}
                  setDetailData={setDetailData}
                  setAmapIns={setAmapIns}
                  setActiveTab={setActiveTab}
                  activeTab={activeTab}
                  amapIns={amapIns}
                  data={data}
                  setSelectedBusinessDistrict={setSelectedBusinessDistrict}
                  selectedBusinessDistrict={selectedBusinessDistrict}
                  setCurSelectRightList={setCurSelectRightList}
                  curClickTypeRef={curClickTypeRef}
                />
              </div>
              : <div className={styles.rightPart}>
                {!!data?.branchCompanyId && !!data?.planId && <TableList
                  hasPermissions={hasPermissions}
                  setParams={setParams}
                  branchCompanyId={data?.branchCompanyId}
                  planId={data?.planId}
                  params={params}
                  setIsMap={setIsMap}
                  setDetailData={setDetailData}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  selectedBusinessDistrict={selectedBusinessDistrict}
                  setSelectedBusinessDistrict={setSelectedBusinessDistrict}
                />}
              </div>
          }
        </>
      </div>
      {hasPermissions && <div className={styles.footer}>
        {permissions.includes('rebut') && <Button onClick={rebutHandle}>驳回</Button>}
        {permissions.includes('reboot') && <Button onClick={rebootHandle} style={{ marginLeft: '12px' }}>重新提交</Button>}
        {permissions.includes('reject') && <Button onClick={rejectHandle} style={{ marginLeft: '12px' }}>拒绝</Button>}
        {permissions.includes('approve') && <Button onClick={approveHandle} style={{ marginLeft: '12px' }} type='primary'>通过</Button>}
      </div>}
      <ApprovalModal
        visible={visible}
        setVisible={setVisible}
        approvalAction={approvalAction}
        onSubmit={confirmReject}
      />
      {/* 驳回弹窗 */}
      <Rebuttal
        modalData={rebuttalModal}
        close={rebuttalModalClose}
        success={rebuttalModalSuccess}
      />
    </>
  );
};

export default NetworkPlanApprove;
