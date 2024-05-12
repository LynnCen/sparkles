/**
 * @Description 分公司规划管理 modal
 */

import { FC } from 'react';
import { useMethods } from '@lhb/hook';
import { Form, Modal, Space } from 'antd';
import V2Form from '@/common/components/Form/V2Form';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';

import styles from '../index.module.less';


const BranchPlanningModal: FC<any> = ({
  modalData,
  setModalData
}) => {
  const [form] = Form.useForm();

  const methods = useMethods({
    onOk() {
      form.validateFields().then((values: any) => {
        console.log('values', values);
      });
    },
    onCancel() {
      setModalData({
        ...modalData,
        visible: false
      });
    }
  });


  return (
    <>
      <Modal
        title={`规划管理`}
        open={modalData.visible}
        onOk={methods.onOk}
        width={526}
        onCancel={methods.onCancel}
        forceRender
        okText='创建'
      >
        <div className={styles.branchPlanningModal}>
          <div className={styles.leftBox}>
            <div className={styles.versionBox}>
              <span className={styles.version}>当前版本</span>
              <span className={styles.versionValue}>2023年规划版本</span>
            </div>
            <div className={styles.infoBox}>
              <Space direction='vertical' >
                <span className={styles.value}>600</span>
                <span className={styles.label}>总部规划商圈数</span>
              </Space>
              <Space direction='vertical'>
                <span className={styles.value}>600</span>
                <span className={styles.label}>分公司规划商圈数</span>
              </Space>
              <Space direction='vertical'>
                <span className={styles.value}>600</span>
                <span className={styles.label}>总部规划开店数</span>
              </Space>
              <Space direction='vertical'>
                <span className={styles.value}>600</span>
                <span className={styles.label}>分公司规划开店数</span>
              </Space>
            </div>
          </div>
          <V2Form form={form} className={styles.rightBox}>
            <V2FormSelect
              label='选择应用版本'
              name='one1'
              options={[]}
              required
              config={{ showSearch: true }} />
            <div className={styles.infoBox}>
              <Space direction='vertical' >
                <span className={styles.value}>600</span>
                <span className={styles.label}>总部规划商圈数</span>
              </Space>
              <Space direction='vertical'>
                <span className={styles.value}>600</span>
                <span className={styles.label}>分公司规划商圈数</span>
              </Space>
              <Space direction='vertical'>
                <span className={styles.value}>600</span>
                <span className={styles.label}>总部规划开店数</span>
              </Space>
              <Space direction='vertical'>
                <span className={styles.value}>600</span>
                <span className={styles.label}>分公司规划开店数</span>
              </Space>
            </div>
          </V2Form>
        </div>
      </Modal>
    </>
  );
};

export default BranchPlanningModal;
