/**
 * @Description 应用到其他modal
 */

import Modal from '@/common/components/Modal/Modal';
import { useMethods } from '@lhb/hook';
import { Button } from 'antd';
import { FC, useState } from 'react';
import SelectVideoModal, { SelectVideoModalDataProps } from './SelectVideoModal';
import { passengerCheckPointsApply } from '@/common/api/footprinting';
import V2Message from '@/common/components/Others/V2Hint/V2Message';

export interface ApplyOtherModalDataProps{
  visible:boolean;
  /** 当前任务 id */
  projectId:string|number;
  /** 当前编辑视频 id */
  currentId: string|number,
  /** 视频点位(过店) */
  outdoorPoints: any[],
  /** 视频点位(进店) */
  indoorPoints: any[],
}

interface ApplyOtherModalProps{
  modalData: ApplyOtherModalDataProps;
  setModalData:Function
  onRefresh?:Function
}

const ApplyOtherModal:FC<ApplyOtherModalProps> = ({
  modalData,
  setModalData,
  onRefresh = () => {}
}) => {
  const [selectVideoModalData, setSelectVideoModalData] = useState<SelectVideoModalDataProps>({
    visible: false,
    projectId: '',
    currentId: '',
    outdoorPoints: [],
    indoorPoints: [],
  }); // 保存成功，应用到全部弹窗

  const methods = useMethods({
    onCancel() {
      setModalData({
        ...modalData,
        visible: false
      });
    },
    /** 应用到指定片段 */
    onApply() {
      setSelectVideoModalData({
        ...selectVideoModalData,
        ...modalData,
        visible: true
      });
    },
    onApplyAll() {
      const params = {
        projectId: modalData.projectId,
        sourceVideoId: modalData.currentId,
        outdoorPoints: modalData.outdoorPoints,
        indoorPoints: modalData.indoorPoints,
        needToAnalysis: false,
        applyAll: true,
      };
      passengerCheckPointsApply(params).then(() => {
        setModalData({
          ...modalData,
          visible: false,
        });
        methods.successCallback();
        V2Message.success('分析区域应用成功');
      }).catch(() => {
        setModalData({
          ...modalData,
          visible: false,
        });
        V2Message.error('分析区域应用失败,请重试');
      });
    },
    successCallback() {
      setModalData({
        ...modalData,
        visible: false
      });
      onRefresh();
    },
  });

  return (
    <>
      <Modal
        title='保存成功'
        open={modalData.visible}
        // 两列弹窗要求640px
        width={640}
        onCancel={methods.onCancel}
        forceRender
        footer={[
          <Button type='default' onClick={methods.onCancel}>暂不应用</Button>,
          <Button type='primary' onClick={methods.onApplyAll}>应用到全部</Button>,
          <Button type='primary' onClick={methods.onApply}>应用到指定片段</Button>,
        ]}
      >
        <p>请选择是否应用于其他视频片段？</p>
        <SelectVideoModal
          onRefresh={methods.successCallback}
          modalData={selectVideoModalData}
          setModalData={setSelectVideoModalData}
        />
      </Modal>
    </>
  );
};

export default ApplyOtherModal;
