/**
 * @Description 商圈详情-数据说明弹窗
 */

import { Modal } from 'antd';
import styles from './index.module.less';

const DataInfoModal = ({ open, setOpen }) => {
  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      width='680px'
      title='数据说明'
      centered
      footer={null}
    >
      <div className={styles.dataInfoContent}>
        <div className={styles.infoItem}>统计范围：商圈详情数据统计范围为中心点周边500米</div>
        <div className={styles.infoSubTitle}>【商圈市场评分】</div>
        <div className={styles.infoItem}>通过以下4个综合指标，客观评估得出</div>
        <div className={styles.infoItem}>人口客群：人越多的地方评分越高（包含居住、商场客流、办公等人口）</div>
        <div className={styles.infoItem}>区域特征：配套越好评分越高（包含餐饮、生活服务、购物、休闲娱乐、商业住宅办公、交通等）</div>
        <div className={styles.infoItem}>消费能力：消费力越强评分越高（包含餐饮客单价、房价）</div>
        <div className={styles.infoItem}>门店经营：存续3年以上老店密度越高评分越高（统计近5年的餐饮门店）</div>
        <div className={styles.infoSubTitle}>【历史经营门店】</div>
        <div className={styles.infoItem}>沉淀位置厂商历年门店数据及location大数据整合测算得出，数据从2018年3月开始记录，每年3月进行更新。</div>
        <div className={styles.infoSubTitle}>【居住人口&画像】</div>
        <div className={styles.infoItem}>基于官方统计、位置厂商数据及location大模型。根据城市人口、居住密度、商场客流画像、范围内住宅小区、生活配套数量等数据进行人口算法模型测算。</div>
        <div className={styles.infoSubTitle}>【周边配套】</div>
        <div className={styles.infoItem}>基于位置厂商数据及location大数据整合。</div>
      </div>
    </Modal>
  );
};

export default DataInfoModal;
