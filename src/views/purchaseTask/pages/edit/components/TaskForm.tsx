import { FC, useState, useRef } from 'react';
import { Col, Row, Form, Space, Button, message } from 'antd';
import { Description, PageContainer, Layout } from '@/common/components';
import { passTask } from '@/common/api/purchaseTask';
import styles from '../entry.module.less';
import Supplier from './Supplier';
import Price from './Price';
import RejectModal from './RejectModal';
import ConfirmModal from './ConfimModal';
import { dispatchNavigate } from '@/common/document-event/dispatch';

const TaskForm: FC<any> = ({ info }) => {
  const {
    spot = {},
  } = info;

  const [form] = Form.useForm();
  const refSupplier: any = useRef();
  const refPrice: any = useRef();

  // 未绑定到 form 上的字段
  const [extraFormData, setExtraFormData] = useState({
    supplyName: null, // 供应商名称
    contactName: null, // 联系人名称
    contactMobile: null, // 联系人手机号
  });
  const [rejectModalData, setRejectModalData] = useState<any>({
    visible: false,
    id: info.id,
  });
  const [confirmModalData, setConfirmModalData] = useState<any>({
    visible: false,
    formData: {},
  });

  const onPass = () => {
    form.validateFields().then((formData) => {
      if (!formData.contractNum) {
        // 未设置合同时
        setConfirmModalData({
          visible: true,
          formData,
        });
      } else {
        postPass(formData);
      }
    });
  };

  const postPass = (formData: any) => {
    const supplierParams = refSupplier.current.getSubmitParams(formData);
    const priceParams = refPrice.current.getSubmitParams(formData);

    const params = {
      ...supplierParams,
      ...priceParams,
      ...extraFormData,
      id: info.id
    };
    passTask(params).then(() => {
      message.success('提交成功');
      onComplete();
    });
  };

  const onReject = () => {
    setRejectModalData({
      visible: true,
      id: info.id,
    });
  };

  const onComplete = () => {
    dispatchNavigate('/purchaseTask');
  };

  const updateExtraFormData = (data) => {
    setExtraFormData(Object.assign(extraFormData, data));
  };

  const renderSpotInfo = () => {
    const { placeName, spotName, dates, area } = spot;
    return (
      <>
        <div className='fn-14 lh-20 font-weight-500 mb-16'>2.点位信息</div>
        <PageContainer noMargin noPadding>
          <Row>
            <Col span={12}>
              <Description label='点位名称' border>{placeName}-{spotName}</Description>
            </Col>
            <Col span={12}>
              <Description label='活动时间' border>{Array.isArray(dates) ? dates.join(',') : '-'}</Description>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Description label='点位面积' border>{area}</Description>
            </Col>
          </Row>
        </PageContainer>
      </>
    );
  };

  return (
    <Layout actions={
      <Space>
        <Button onClick={onReject}>拒绝</Button>
        <Button type='primary' onClick={onPass}>通过</Button>
      </Space>}>
      <Form labelAlign='left' form={form} colon={false} className={styles.form}>
        <div className='fn-16 bold mb-16'>采购信息</div>
        <Supplier ref={refSupplier} form={form} updateExtraFormData={updateExtraFormData}/>
        {!!spot && renderSpotInfo()}
        <Price ref={refPrice} form={form}/>
      </Form>
      <RejectModal data={rejectModalData} setData={setRejectModalData} onComplete={onComplete}/>
      <ConfirmModal data={confirmModalData} setData={setConfirmModalData} onPost={(val) => postPass(val)}/>
    </Layout>
  );
};

export default TaskForm;
