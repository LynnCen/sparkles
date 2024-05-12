/**
 * @Description 商圈列表底部
 */
import React, { FC, useRef, useState } from 'react';
import { Button, Tooltip } from 'antd';
import { useMethods } from '@lhb/hook';
// import cs from 'classnames';
import styles from '../index.module.less';
import DistrictModal from '@/common/components/business/Edit/components/Search/DistrictModal';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { addToPlan, cancelThePlan, deleteCluster } from '@/common/api/networkplan';
import { businessType } from '../../../ts-config';

const Footer: FC<any> = ({
  detailData, // 详情
  isBranch, // 是否是分公司
  planId, // 规划id
  branchCompanyId, // 分公司id
  setIsReset,
  setSelectedRowKeys,
  isActive, // 是否生效中的公司
  setDetailData,
  selectedRowKeys
  // data// 列表数据
}) => {
  const [districtVisible, setDistrictVisible] = useState<boolean>(false); // 新增规划弹窗
  const isLockRef = useRef<boolean>(false);

  const methods = useMethods({
    handleAddPlan() { // 新增商圈规划
      setDistrictVisible(true);
    },
    onReset() {
      setIsReset((state) => !state);
    },
    handleDelete(ids: React.Key[], e: Event) {
      e.stopPropagation();
      V2Confirm({
        content: `是否确定要取消${isBranch ? '规划' : '推荐'}`,
        onSure() {
          // 取消规划
          if (isLockRef.current) return;
          isLockRef.current = true;
          cancelThePlan({ ids }).then(() => {
            V2Message.success('取消成功');
            setSelectedRowKeys([]);
            methods.onReset();
          }).finally(() => {
            isLockRef.current = false;
          });
        }
      });
    },
    handleAdd(ids: React.Key[], e: Event) {
      e.stopPropagation();
      V2Confirm({
        content: `是否确定要设为${isBranch ? '规划' : '推荐'}？`,
        onSure() {
          // 加入规划
          if (isLockRef.current) return;
          isLockRef.current = true;
          addToPlan({ ids }).then(() => {
            V2Message.success('设置成功');
            setSelectedRowKeys([]);
            methods.onReset();
          }).finally(() => {
            isLockRef.current = false;
          });
        }
      });
    },
    handleDeleteNewBusiness(id, e) {
      e.stopPropagation();
      V2Confirm({
        content: `是否确定要删除该商圈`,
        onSure() {
          // 删除新增商圈
          if (isLockRef.current) return;
          isLockRef.current = true;
          deleteCluster({ id }).then(() => {
            V2Message.success('删除成功');
            setSelectedRowKeys([]);
            methods.onReset();
            setDetailData({ visible: false, id: null });
          }).finally(() => {
            isLockRef.current = false;
          });
        }
      });
    }
  });
  const showDeleteBtn = (notOther = false) => {
    if (detailData.type === businessType.DIYBusiness) {
      return <div className={styles.footerCon}>
        <Button
          block
          type={notOther ? 'primary' : 'default'}
          className='mr-8'
          onClick={(e) => methods.handleDeleteNewBusiness(detailData.planClusterId, e)}
        >删除商圈</Button>
      </div>;
    }
    return <></>;
  };
  return (
    <>
      {
        isActive
          ? showDeleteBtn(true)
          : detailData?.visible ? <div className={styles.footerCon}>
            {detailData.isPlaned
              ? <div className={styles.footer}>
                {showDeleteBtn()}
                <Button
                  block
                  type='primary'
                  onClick={(e) => methods.handleDelete([detailData.planClusterId], e)}>
                取消商圈{isBranch ? '规划' : '推荐'}
                </Button>
              </div>
              : <div className={styles.footer}>
                { showDeleteBtn() }
                <Button
                  block
                  type='primary'
                  onClick={(e) => methods.handleAdd([detailData.planClusterId], e)}>
                设为商圈{isBranch ? '规划' : '推荐'}
                </Button>
              </div>
            }
          </div> : <>
            { isBranch && selectedRowKeys?.length === 0
              ? <div className={styles.footerCon}>
                <Button
                  block
                  type='primary'
                  onClick={methods.handleAddPlan}>
            新增商圈规划
                </Button>
              </div>
              : <></> }
            {
              selectedRowKeys?.length > 0
                ? <div className={styles.selectedRow}>
                  <Tooltip placement='top' title='清空已选商圈'>
                    <span
                      className='c-244 mr-8 fs-12 pointer'
                      onClick={() => { setSelectedRowKeys([]); }}>
                清空
                    </span>
                  </Tooltip>
                  <span className={styles.value}>
                      已选中 <span className='c-006 bold'>{selectedRowKeys.length}</span> 项
                  </span>
                  <Button
                    onClick={(e) => methods.handleDelete(selectedRowKeys, e)}
                    size='small'
                    className={styles.cancelBtn}
                  >
                取消{isBranch ? '规划' : '推荐'}
                  </Button>

                  <Button
                    onClick={(e) => methods.handleAdd(selectedRowKeys, e)}
                    size='small'
                    type='primary'
                    className={styles.confirmBtn}
                  >
                设为{isBranch ? '规划' : '推荐'}
                  </Button>
                </div> : <></>
            }
          </>
      }

      <DistrictModal
        isBranch={isBranch}
        planId={planId}
        branchCompanyId={branchCompanyId}
        visible={districtVisible}
        close={() => setDistrictVisible(false)}
        onAdd={methods.onReset}
      />
    </>

  );
};

export default Footer;
