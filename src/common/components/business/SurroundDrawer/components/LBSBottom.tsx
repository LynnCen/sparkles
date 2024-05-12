/**
 * @Description 底部LBS解锁按钮
 */
import { Button } from 'antd';
import styles from '../index.module.less';
import { FC, forwardRef, useImperativeHandle, useState } from 'react';
import { createBusinessReport, queryBenefit } from '@/common/api/surround';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import ModalHint from './Modal';
import { downloadFile } from '@lhb/func';
import cs from 'classnames';

const getType = (type) => {
  switch (type) {
    // 潜客聚集点
    case 'around':
      return { title: '周边商圈评估', img: 'https://staticres.linhuiba.com/project-custom/locationpc/surround/bg_surround_%20clientInfo.png' };
      // 周边人群
    case 'surround':
      return { title: '人群概括', img: 'https://staticres.linhuiba.com/project-custom/locationpc/surround/bg_surround_peopleInfo.png' };
      // 商业范围
    case 'competition':
      return { title: '人群概括', img: 'https://staticres.linhuiba.com/project-custom/locationpc/surround/bg_surround_ businessInfo.png' };
      // 城市信息
    case 'city':
      return { title: '市场评估', img: 'https://staticres.linhuiba.com/project-custom/locationpc/surround/bg_surround_cityInfo.png' };
    default:
      return null;
  }
};
const LBSBottom:FC<any> = forwardRef(({
  type,
  mainClassName,
  btnClassName, // 自定义解锁按钮样式
  btnContent = '解锁VIP分析报告',
  detail,
  extraType, // 额外传递
  lockContentSlot,
}, ref) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  // const onDelete = (modal: any) => {
  //   modal.destroy();
  // };
  /**
   * @description 确认购买弹窗点击确定后
   */
  const handlePurchase = async() => {
    const res = await createBusinessReport({
      name: `${detail?.address}报告`,
      address: detail?.address,
      cityId: detail?.cityId,
      cityName: detail?.cityName,
      type: detail?.poiSearchType,
      lng: detail?.lng,
      lat: detail?.lat,
      radius: detail?.radius,
      area: detail?.area || ((detail?.radius / 1000) * (detail?.radius / 1000) * 3.14),
      border: detail?.borders
    });
    if (res) {
      V2Confirm({
        title: '报告正在生成中',
        content: '请前往【APP-周边查询-历史】中查看详细报告',
        noFooter: true
      });
      setOpen(false);
    }

  };
    /**
   * @description 点击解锁跳出确认购买弹窗
   */
  const handleUnlock = async() => {
    const data = await queryBenefit();
    // 公司权益和个人权益都大于200
    if (+data.tenantBenefit >= 200 && +data.accountBenefit >= 200) {
      setOpen(true);
    }
    // 公司权益大于200且个人权益小于200  或  公司权益小于200
    if ((+data.tenantBenefit >= 200 && +data.accountBenefit < 200) || +data.tenantBenefit < 200) {
      setModalVisible(true);
    }

  };
  const jumpExamplePDF = () => {
    downloadFile({
      url: 'https://location-pdf.oss-cn-hangzhou.aliyuncs.com/ab69cf47-4bd8-450c-979e-5133bdfdc304.pdf',
      name: '示例报告'
    });
    setOpen(false);
  };

  // 暴露相关方法
  useImperativeHandle(ref, () => ({
    handleUnlock: handleUnlock,
  }));

  const info:any = extraType || getType(type);
  return (
    <>
      { info
        ? <div className={cs(mainClassName, styles.bottom)}>
          {info.title && <div className={styles.title}>{info.title}</div>}
          <img src={info.img}/>

          {lockContentSlot ||
          <Button
            type='primary'
            className={cs(btnClassName, styles.btn)}
            onClick={handleUnlock}>
            {btnContent}
          </Button>}

        </div>
        : <></>}
      {/* 企点余额不足弹窗 */}
      <ModalHint
        visible={modalVisible}
        setVisible={setModalVisible}
        // content={'查看详细数据需支付200个企点，当前账户余额不足'}
        width={380}
        title='企点余额不足'
        children={
          <div className={styles.noFundBox}>
            <div className={styles.content}>
            查看详细数据需支付200个企点，当前账户余额不足
            </div>
            <div className={styles.img}>
              <img src='https://staticres.linhuiba.com/project-custom/locationpc/demo/qr_code.jpg' alt='' />
              <span className={styles.imgText}>请添加客服微信，充值企点获取VIP分析报告</span>
            </div>
            <div className={styles.bottom} onClick={jumpExamplePDF}>
              <Button>查看VIP报告示例</Button>
            </div>
          </div>
        }
      />


      <ModalHint
        title='确认购买'
        visible={open}
        setVisible={setOpen}
        children={
          <div className={styles.confirmBuyBox}>
            <div className={styles.text}>查看详细数据需支付200个企点，确认购买？</div>
            <div className={styles.btn}>
              <Button className='mr-12' onClick={jumpExamplePDF}>查看示例</Button>
              <Button onClick={handlePurchase} type='primary'>确认</Button>
            </div>
          </div>}
      />

    </>
  );
});
export default LBSBottom;

