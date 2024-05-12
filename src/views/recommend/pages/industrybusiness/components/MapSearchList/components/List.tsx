/**
 * @Description 商圈列表
 */

import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { List as ListCom, Spin, Checkbox, Button } from 'antd';
import { useMethods } from '@lhb/hook';
import { isArray } from '@lhb/func';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import { addToPlan, cancelThePlan } from '@/common/api/networkplan';
// import cs from 'classnames';
import styles from '../index.module.less';
// 以后不要再用这个第三方了，bug特别多
import VirtualList from 'rc-virtual-list';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import NetworkPlanLeftDetail from '@/common/components/business/NetworkPlanLeftDetail/index';
import ListItem from './ListItem';
import { NOT_MORE_DATA } from '../../../ts-config';

const List: FC<any> = ({
  pageRef,
  data,
  detailData,
  loading,
  mainHeight,
  isBranch, // 是否是分公司
  keywords, // 搜索关键词
  selectedRowKeys, // 选中行
  setSelectedRowKeys, // 设置选中行
  // setIsReset, // 是否重置接口入参
  setDetailData, // 设置详情
  appendData, // 加载下一页
}) => {
  const [checkAll, setCheckAll] = useState<boolean>(false); // 全选
  const [indeterminate, setIndeterminate] = useState<boolean>(false); // 全选样式
  const listRef: any = useRef(null);

  // https://virtual-list-react-component.vercel.app/demo/basic
  useEffect(() => {
    // 回到顶部
    if (pageRef.current === 1) {
      listRef.current && listRef.current.scrollTo({
        index: 0,
        align: 'bottom',
      });
    }
  }, [data]);
  // 翻页时的自动选中
  useEffect(() => {
    if (!checkAll) return;
    if (!isArray(data)) return;
    // 全选选中时翻页，自动全部选中
    setSelectedRowKeys(data.map((item) => item.planClusterId));
  }, [data, checkAll]);
  // 设置全选状态
  useEffect(() => {
    if (!(isArray(selectedRowKeys) && selectedRowKeys.length)) return;
    const isIndeterminate = selectedRowKeys.length !== data.length;
    setIndeterminate(isIndeterminate);
    setCheckAll(!isIndeterminate);
  }, [selectedRowKeys]);

  const dynamicHeight = useMemo(() => {
    // 底部footer高 56 选中行高40
    // if (selectedRowKeys.length > 0 && isBranch) return mainHeight - 56 - 40;
    if (selectedRowKeys.length) return mainHeight - 40; // 有选中行  减去选中行高度
    // if (isBranch) return mainHeight - 56;
    return mainHeight;
  }, [selectedRowKeys, mainHeight]);

  const methods = useMethods({
    // 全选
    checkAllChange(e: any) {
      const isCheked = e?.target?.checked;
      setCheckAll(isCheked);
      if (isCheked) { // 全选选中
        setSelectedRowKeys(data?.map((item) => item.planClusterId));
        return;
      }
      setSelectedRowKeys([]);
    },
    // 设为推荐/规划
    handleAdd(ids: number[]) {
      V2Confirm({
        content: `是否确定要设为${isBranch ? '规划' : '推荐'}？`,
        onSure() {
          addToPlan({ ids }).then(() => {
            V2Message.success('设置成功');
            setSelectedRowKeys([]);
            // setIsReset(true);
          });
        }
      });
    },
    // 取消推荐/规划
    handleDelete(ids: number[]) {
      // e.stopPropagation();
      V2Confirm({
        content: `是否确定要取消${isBranch ? '规划' : '推荐'}`,
        onSure() {
          // 取消规划
          cancelThePlan({ ids }).then(() => {
            V2Message.success('取消成功');
            setSelectedRowKeys([]);
            // setIsReset(true);
          });
        }
      });
    },
    // 点击进入详情
    handleCell(record: any) {
      setDetailData({
        ...record,
        visible: true,
      });
    },
    onScroll(e: any) {
      // 预留10px
      if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop <= dynamicHeight + 10) {
        if (loading) return;
        if (pageRef.current !== NOT_MORE_DATA) {
          pageRef.current += 1;
          appendData && appendData();
        }
      }
    },
  });

  return (
    detailData?.visible ? <div className={styles.networkDetail}>
      {/* 详情组件 */}
      <NetworkPlanLeftDetail
        isModelCluster
        type={detailData.type}
        id={detailData.id}
        mainHeight={mainHeight}
        // isModelCluster
        backList={() => {
          setDetailData({
            id: null,
            visible: false,
          });
        }}/>
    </div>
      : <Spin spinning={loading}>
        {
          selectedRowKeys?.length > 0 ? <div className={styles.selectedRow}>
            <Checkbox
              indeterminate={indeterminate}
              checked={checkAll}
              onChange={methods.checkAllChange}
              className='mr-10'/>
            <span>已选中 <span>{selectedRowKeys.length}</span> 项</span>
              &nbsp;&nbsp;
            <Button
              onClick={() => methods.handleAdd(selectedRowKeys)}
              size='small'>
                设为{isBranch ? '规划' : '推荐'}
            </Button>
              &nbsp;
            <Button
              onClick={() => methods.handleDelete(selectedRowKeys)}
              size='small'>
                取消{isBranch ? '规划' : '推荐'}
            </Button>
          </div> : <></>
        }
        <ListCom>
          {/* 虚拟列表 */}
          <VirtualList
            ref={listRef}
            data={data}
            height={dynamicHeight}
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
                  keywords={keywords}
                  selectedRowKeys={selectedRowKeys}
                  setSelectedRowKeys={setSelectedRowKeys}
                />
              </ListCom.Item>
            )}
          </VirtualList>
        </ListCom>
      </Spin>
  );
};

export default List;

