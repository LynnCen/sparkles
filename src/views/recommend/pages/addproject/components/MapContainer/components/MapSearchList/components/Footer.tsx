/**
 * @Description 商圈列表底部
 */
import { FC, useRef } from 'react';
import { Button } from 'antd';
import { useMethods } from '@lhb/hook';
import styles from '../index.module.less';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { addCluster, cancelCluster } from '@/common/api/networkplan';
import { urlParams } from '@lhb/func';

const Footer: FC<any> = ({
  setIsReset,
  detailData, // 详情
  // setSelectedRowKeys,
  onRefresh
}) => {

  const {
    branchCompanyId, // 分公司id
  } = JSON.parse(decodeURI(urlParams(location.search)?.params || null)) || {};

  const isLockRef = useRef<boolean>(false);

  const methods = useMethods({
    onReset() {
      setIsReset((state) => !state);
    },
    handleCancel(e: Event) {
      e.stopPropagation();
      V2Confirm({
        content: `是否确定要取消添加该商圈`,
        onSure() {
          // 取消添加规划
          if (isLockRef.current) return;
          isLockRef.current = true;
          cancelCluster({ ids: [detailData?.planClusterId], childCompanyId: branchCompanyId }).then(() => {
            V2Message.success('取消成功');
            onRefresh();
            methods.onReset();
          }).finally(() => {
            isLockRef.current = false;
          });
        }
      });
    },
    handleAdd(e: Event) {
      e.stopPropagation();
      V2Confirm({
        content: `是否确定要添加规划该商圈？`,
        onSure() {
          // 添加规划商圈
          if (isLockRef.current) return;
          isLockRef.current = true;
          addCluster({ ids: [detailData?.planClusterId], childCompanyId: branchCompanyId }).then(() => {
            V2Message.success('设置成功');
            onRefresh();
            methods.onReset();
          }).finally(() => {
            isLockRef.current = false;
          });
        }
      });
    },
  });

  return (
    // 子公司未规划的才出现按钮(用===false，来排除null、undefined的情况)
    detailData?.childCompanyPlanned === false ? <div className={styles.footerCon}>
      {/* 根据子公司是否添加列表出现不同的按钮 */}
      {detailData?.isChildCompanyAddPlanned
        ? <Button onClick={methods.handleCancel} block type='primary'>取消添加</Button>
        : <Button onClick={methods.handleAdd} block type='primary'>添加规划商圈</Button>
      }
    </div> : <></>
  );
};

export default Footer;
