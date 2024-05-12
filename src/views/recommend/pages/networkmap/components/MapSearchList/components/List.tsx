/**
 * @Description 商圈列表
 */

import { FC, useEffect, useRef, useState } from 'react';
import { List as ListCom, Spin } from 'antd';
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
import { NOT_MORE_DATA, markerType } from '../../../ts-config';
import BusinessDistrictDetail from '@/common/components/business/NetworkPlanLeftDetail/BusinessDistrictDetail';


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
  setIsReset, // 是否重置接口入参
  setDetailData, // 设置详情
  appendData, // 加载下一页
  isActive, // 是否生效中的公司
  selectedBusinessDistrict, // 选中的商区围栏
  setSelectedBusinessDistrict, // 设置选中的商区围栏,
  curClickTypeRef,
  curSelectRightList
}) => {
  const [checkAll, setCheckAll] = useState<boolean>(false); // 全选
  const businessDistrictRef = useRef<any>(null);
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
  useEffect(() => {
    const selectedArr:any = [];
    data.map((item) => {
      if (selectedRowKeys.includes(item.planClusterId)) {
        selectedArr.push(item.planClusterId);
      }
    });
    setSelectedRowKeys(selectedArr);
  }, [data]);
  // 设置全选状态
  useEffect(() => {
    if (!(isArray(selectedRowKeys) && selectedRowKeys.length)) return;
    const isIndeterminate = selectedRowKeys.length !== data.length;
    // setIndeterminate(isIndeterminate);
    setCheckAll(!isIndeterminate);
  }, [selectedRowKeys]);

  // const dynamicHeight = useMemo(() => {
  //   // 底部footer高 56 选中行高40
  //   // if (selectedRowKeys.length > 0 && isBranch) return mainHeight - 56 - 40;
  //   if (selectedRowKeys.length) return mainHeight - 40; // 有选中行  减去选中行高度
  //   // if (isBranch) return mainHeight - 56;
  //   return mainHeight;
  // }, [selectedRowKeys, isBranch, mainHeight]);

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
            setIsReset((state) => !state);
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
            setIsReset((state) => !state);
          });
        }
      });
    },
    // 点击进入详情
    handleCell(record: any) {
      curClickTypeRef.current = markerType.AddressMarker;
      setDetailData({
        ...record,
        visible: true,
      });
    },
    onScroll(e: any) {
      if (selectedBusinessDistrict.visible) return;
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
    detailData?.visible || selectedBusinessDistrict.visible
    // 详情
      ? <div className={styles.networkDetail}>
        { curClickTypeRef.current === markerType.AddressMarker
        // 商圈点位详情
          ? <NetworkPlanLeftDetail
            type={detailData.type}
            id={detailData.id}
            mainHeight={mainHeight}
            backList={() => {
              // 这里当返回后，肯定不是显示当前type，所以取另外一种详情
              // !!注意，如果这里一共有三种类型，则行不通
              curClickTypeRef.current = markerType.BusinessDistrictMarker;
              setDetailData({
                id: null,
                visible: false,
              });
            }}/>
        // 商区围栏（市场容量）详情
          : <div
            style={{
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
              businessDistrictRef={businessDistrictRef}
            />
            <ListCom>
              {/* 虚拟列表 */}
              <VirtualList
              //  selectedBusinessDistrict.visible的时候换data
                data={curSelectRightList}
                // 这里的mainHeight是否需要根据selectedBusinessDistrict.visible改变
                height={mainHeight - (businessDistrictRef.current?.clientHeight || 0)}
                itemHeight={85}
                itemKey='id'
                // onScroll={methods.onScroll}
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
                      isActive={isActive}
                      isBranch={isBranch}
                    />
                  </ListCom.Item>
                )}
              </VirtualList>
            </ListCom>
          </div>
        }
      </div>
      : <>
        {/* 商圈虚拟列表 */}
        <Spin
          spinning={loading}>
          <ListCom>
            {/* 虚拟列表 */}
            <VirtualList
              ref={listRef}
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
                    keywords={keywords}
                    selectedRowKeys={selectedRowKeys}
                    setSelectedRowKeys={setSelectedRowKeys}
                    isActive={isActive}
                    isBranch={isBranch}
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

