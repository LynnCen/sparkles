/**
 * @Description 点击商圈名称后显示的label
 */

import { Button, Form, Modal } from 'antd';
import styles from './index.module.less';
import V2Tag from '@/common/components/Data/V2Tag';
import { FC, useState } from 'react';
import V2Form from '@/common/components/Form/V2Form';
import V2FormTextArea from '@/common/components/Form/V2FormTextArea/V2FormTextArea';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import { post } from '@/common/request';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { setPlannedArea } from '@/common/api/networkplan';
import { getLngLatAddress } from '@/common/utils/map';
const MapLabel:FC<any> = ({
  detail,
  planId,
  branchCompanyId,
  setRefresh,
  checkCity,
  infoLabelRef,
  isBranch
}) => {
  const [form] = Form.useForm();

  const [visible, setVisible] = useState<boolean>(false);
  const handlePlan = async() => {
    let adcode:any;
    if (detail?.lng && detail?.lat) {
      const addressInfo: any = await getLngLatAddress([detail?.lng, detail?.lat], '', false).catch((err) => console.log(`查询具体地址信息：${err}`));
      // console.log('addressInfo', addressInfo);
      // 直辖市需要通过province获取
      adcode = addressInfo?.addressComponent?.adcode;
    }

    // if(checkCity){}
    if (!checkCity(adcode)) {
      V2Message.warning('您当前暂无该城市权限');
      return;
    }
    // 总部已规划且分公司未规划--总公司未规划状态
    if (!detail?.parentCompanyPlanned && !detail?.childCompanyPlanned) {
      setVisible(true);
      return;
    }
    // 总部规划了，分公司未规划-- 分公司未规划状态
    if (detail?.parentCompanyPlanned && !detail?.childCompanyPlanned) {
      V2Confirm({
        content: `是否确定要设为${isBranch ? '规划' : '推荐'}？`,
        onSure() {
          // 加入规划
          // https://yapi.lanhanba.com/project/546/interface/api/59800
          post('/plan/add', { ids: [detail.planClusterId], type: 2 }, {
            needHint: true,
          }).then(() => {
            V2Message.success('设置成功');
            setRefresh((state) => !state);
          });
        }
      });
      return;
    }

    // 分公司已规划
    if (detail?.childCompanyPlanned) {
      V2Confirm({
        content: `是否确定要取消${isBranch ? '规划' : '推荐'}`,
        onSure() {
          // 取消规划
          // https://yapi.lanhanba.com/project/546/interface/api/60108
          // 取消类型 1:总公司规划 2:分公司规划
          post('/plan/cancel', { ids: [detail?.planClusterId], type: 2 }, {
            needHint: true,
          }).then(() => {
            V2Message.success('取消成功');
            setRefresh((state) => !state);
          });
        }
      });
      return;
    }
  };
  const handleOk = () => {
    form.validateFields().then((val) => {
      setPlannedArea(({
        branchCompanyReason: val.reason,
        planId: planId,
        branchCompanyId: branchCompanyId,
        areaId: detail?.id
      }));
      // 取请求接口 后
      setVisible(false);
      form.resetFields();
      setRefresh((state) => !state);
    });
  };
  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
    // setRefresh((state) => !state);
  };
  return <>
    <div className={styles.mapLabel}>
      {/* // 此处的className-orangeLabel引用组件处有使用，改动时需要注意，两端需要同时改*/}
      <div className={styles.orangeLabel}>
        <div className={styles.orangeTriangle}>
        </div>
        {detail.areaName}
        {detail?.isPlaned ? <span className={styles.planned}>已规划</span> : ''}
      </div>
      <div className={styles.rightBox} ref={infoLabelRef}>
        <div className={styles.rightTriangle}></div>
        <div className={styles.title}>{detail.areaName}</div>
        <div className={styles.tagBox}>
          <V2Tag color='orange'>推荐开店 {detail.recommendStores || '0'}</V2Tag>
          <V2Tag color='green'>已开店 {detail.openStores || '0'}</V2Tag>
        </div>
        <div className={styles.businessDetailRate}>
        综合评估<span className={styles.businessDetailRateCore}>{detail.totalScore || '-'}</span>分
        </div>
        <div className='pb-20'>
          <span className={styles.status}>规划状态</span>
          {/* 总部已规划且分公司未规划--总公司未规划状态 */}
          {!detail?.parentCompanyPlanned && !detail?.childCompanyPlanned && <span className={styles.plan}>总公司未规划</span>}
          {/* 总部规划了，分公司未规划 */}
          {detail?.parentCompanyPlanned && !detail?.childCompanyPlanned && <span className={styles.plan}>分公司未规划</span>}
          {/* 分公司已规划 */}
          {detail?.childCompanyPlanned && <span className={styles.plan}>分公司已规划</span>}
        </div>
        {/* detail?.childCompanyPlanned--分公司已规划，该情况下才显示取消规划 */}
        <Button
          block
          type='primary'
          onClick={() => { handlePlan(); }}>
          {detail?.childCompanyPlanned ? '取消规划' : '设为规划商圈' }
        </Button>
      </div>
    </div>
    <Modal
      title='设为规划商圈原因'
      open={visible}
      destroyOnClose={true}
      width={648}
      onCancel={handleCancel}
      onOk={handleOk}
    >
      <V2Form form={form}>
        <V2FormTextArea required maxLength={500} label='规划原因' name='reason' config={{
          showCount: true,
        }} />
      </V2Form>
    </Modal>
  </>;
};

export default MapLabel;
