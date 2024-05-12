/**
 * @Description 商圈列表底部
 */
import { FC, useState } from 'react';
// import { Button } from 'antd';
import { useMethods } from '@lhb/hook';
// import cs from 'classnames';
import styles from '../index.module.less';
import DistrictModal from '@/common/components/business/Edit/components/Search/DistrictModal';

const Footer: FC<any> = ({
  detailData, // 详情
  isBranch, // 是否是分公司
  // planId, // 规划id
  // branchCompanyId, // 分公司id
  setIsReset,
}) => {
  const [districtVisible, setDistrictVisible] = useState<boolean>(false); // 新增规划弹窗

  const methods = useMethods({
    // handleAddPlan() { // 新增商圈规划
    //   setDistrictVisible(true);
    // },
    onReset() {
      setIsReset(true);
    }
  });
  return (
    <>
      <div className={detailData?.visible ? styles.footerCon : ''}>
        {
          detailData?.visible ? <>
            {/* {detailData.isPlaned
              ? <Button
                type='primary'
                onClick={(e) => methods.handleDelete([detailData.planClusterId], e)}>
                  取消商圈{isBranch ? '规划' : '推荐'}
              </Button>
              : <Button
                type='primary'
                onClick={(e) => methods.handleAdd([detailData.planClusterId], e)}>
                  设为商圈{isBranch ? '规划' : '推荐'}
              </Button>} */}
          </> : <>
            {/* { isBranch ? <Button
              // className={styles.addBtn}
              block
              type='primary'
              onClick={methods.handleAddPlan}>
              新增商圈规划
            </Button> : <></>} */}

            { /* <Tooltip title={`筛选后的全部商圈一键全部${isBranch ? '规划' : '推荐'}`}>
              <Button
                type='primary'
                className={styles.allBtn} onClick={methods.handleAllPlan}>
                全部{isBranch ? '规划' : '推荐'}
                <ExclamationCircleOutlined />
              </Button>
            </Tooltip> */ }
          </>
        }
      </div>

      <DistrictModal
        isBranch={isBranch}
        // planId={planId}
        // branchCompanyId={branchCompanyId}
        visible={districtVisible}
        close={() => setDistrictVisible(false)}
        onAdd={methods.onReset}
      />
    </>

  );
};

export default Footer;
