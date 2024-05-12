/**
 * @Description 商圈列表
 */

import { FC } from 'react';
import { List as ListCom, Spin } from 'antd';
import { useMethods } from '@lhb/hook';
import styles from '../index.module.less';
import VirtualList from 'rc-virtual-list';
import NetworkPlanLeftDetail from '@/common/components/business/NetworkPlanLeftDetail/index';
import ListItem from './ListItem';
import { NOT_MORE_DATA } from '../../../ts-config';


const List: FC<any> = ({
  pageRef,
  data,
  detailData,
  loading,
  mainHeight,
  setDetailData, // 设置详情
  appendData, // 加载下一页
}) => {

  const methods = useMethods({
    // 点击进入详情
    handleCell(record: any) {
      setDetailData({
        ...record,
        visible: true,
      });
    },
    onScroll(e: any) {
      // 预留10px
      if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop <= mainHeight + 10) {
        if (loading) return;
        if (pageRef.current !== NOT_MORE_DATA) {
          pageRef.current += 1;
          appendData && appendData();
        }
      }
    },
  });

  return (
    detailData?.visible
    // 详情
      ? <div className={styles.networkDetail}>
        <NetworkPlanLeftDetail
          type={detailData.type}
          id={detailData.id}
          mainHeight={mainHeight}
          backList={() => {
            setDetailData({
              id: null,
              visible: false,
            });
          }}/>
      </div>
      : <>
        {/* 商圈虚拟列表 */}
        <Spin
          spinning={loading}>
          <ListCom>
            {/* 虚拟列表 */}
            <VirtualList
              data={data}
              height={mainHeight}
              itemHeight={85}
              itemKey='id'
              onScroll={methods.onScroll}
              className={styles.listCon}
            >
              {(item: any) => (
                <ListCom.Item
                  key={item}
                  onClick={() => methods.handleCell(item)}
                >
                  <ListItem
                    item={item}
                  />
                </ListCom.Item>
              )}
            </VirtualList>
          </ListCom>
        </Spin>
      </>
  );
};

export default List;

