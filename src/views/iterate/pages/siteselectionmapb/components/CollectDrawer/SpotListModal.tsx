/**
 * @Description 场地点位列表抽屉
 */
import { Fragment, useEffect, useRef, useState } from 'react';
import { Spin } from 'antd';
import { getAreaPoints } from '@/common/api/siteselectionmap';
import { isArray } from '@lhb/func';
// import V2DetailGroup from '@/common/components/Feedback/V2DetailItem/Group';
// import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
// import Entrance from '../CreateFavorite/Entrance';
// import { post } from '@/common/request';
// import V2Empty from '@/common/components/Data/V2Empty';
// import { getQiniuFileOriSuffix } from '@/common/utils/ways';
// import styles from './index.module.less';
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import V2Container from '@/common/components/Data/V2Container';
import V2Title from '@/common/components/Feedback/V2Title';
import V2Pagination from '@/common/components/Data/V2Pagination';
import PointItem from '@/views/iterate/pages/siteselectionmap/components/AreaDetailDrawer/ShopPoints/PointItem';
const size = 10;
const SpotListModal: any = ({
  modalData,
  setPointDrawerData,
  setModalData,
}) => {
  const targetObserverRef: any = useRef();
  const pageRef: any = useRef(1);
  const [records, setRecords] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState<number>(0);
  const [detailIsShow, setDetailIsShow] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  useEffect(() => {
    if (modalData.visible && modalData.modelClusterId) {
      getClusterPlaces();
    }
  }, [modalData]);
  // 监听点位详情关闭，之所以用这种方式是因为业务逻辑相互嵌套以及代码结构
  useEffect(() => {
    if (!detailIsShow) return;
    setTimeout(() => {
      const targetDrawerDom: any = document.querySelector('.pointDetailDrawerOnly')?.parentNode;
      if (!targetDrawerDom) return;
      const targetObserver = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if (mutation.type === 'childList') {
            mutation.removedNodes.forEach(node => {
              if (node === targetDrawerDom) {
                // 更新列表
                modalData.visible && modalData.modelClusterId && getClusterPlaces(false);
              }
            });
          }
        }
      });
      targetObserver.observe(document.body, {
        childList: true, // 观察目标子节点的变化，是否有添加或者删除
        attributes: false, // 观察属性变动
        subtree: false, // 观察后代节点，默认为 false
      });
      targetObserverRef.current = targetObserver;
    }, 500);
    return () => {
      targetObserverRef.current && targetObserverRef.current?.disconnect();
    };
  }, [detailIsShow]);

  // 获取商圈下的场地点位
  const getClusterPlaces = async (needLoading = true) => {
    needLoading && setIsLoading(true);
    setDetailIsShow(false);
    const params = {
      page: pageRef.current,
      size,
      modelClusterId: modalData.modelClusterId,
    };
    const data = await getAreaPoints(params).finally(() => {
      needLoading && setIsLoading(false);
    });
    const { objectList, totalNum } = data || {};
    setRecords(isArray(objectList) ? objectList : []);
    setTotal(totalNum);
    // post('/modelCluster/mallLocation/list', params).then((res) => {
    //   setRecords(res.locations || []);
    // }).finally(() => setLoaded(true));
  };

  return (
    <V2Drawer
      bodyStyle={{ padding: '18px 30px 0' }}
      open={modalData.visible}
      onClose={() => {
        setModalData({
          visible: false,
          modelClusterId: '',
        });
        setPage(1);
        pageRef.current = 1;
      }}
    >
      <V2Container
        // emitMainHeight={(h) => setMainHeight(h)}
        style={{
          height: 'calc(100vh - 18px)',
        }}
        extraContent={{
          top: <V2Title text='场地点位'/>,
          bottom: <V2Pagination
            current={page}
            total={total}
            pageSize={size}
            showSizeChanger={false}
            onChange={(page) => {
              pageRef.current = page;
              setPage(page);
              getClusterPlaces();
            }}
          />
        }}
      >
        <Spin spinning={isLoading}>
          {
            records.map((item: any, index: number) => <Fragment key={index}>
              <PointItem
                item={item}
                clusterId={modalData.modelClusterId}
                setPointDrawerData={setPointDrawerData}
                setDetailIsShow={setDetailIsShow}
              />
            </Fragment>)
          }
        </Spin>
      </V2Container>
    </V2Drawer>
  );
};

export default SpotListModal;
