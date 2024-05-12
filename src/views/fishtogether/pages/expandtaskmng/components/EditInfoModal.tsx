/**
 * @Description 加盟商编辑
 */
import { FC, useEffect, useState } from 'react';
import { Modal, Col, Form, Row } from 'antd';
import { MOBILE_REG } from '@lhb/regexp';
import V2Form from '@/common/components/Form/V2Form';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormTextArea from '@/common/components/Form/V2FormTextArea/V2FormTextArea';
import V2FormUpload from '@/common/components/Form/V2FormUpload/V2FormUpload';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { franchiseeEdit } from '@/common/api/fishtogether';

const EditInfoModal: FC<any> = ({
  modalData, // 弹窗数据
  closeModalHandle, // 关闭弹窗逻辑
  loadData, // 更新详情页
  statusOptions // 客户状态options
}) => {
  const {
    showModal,
    info
  } = modalData;
  const [form] = Form.useForm();
  const [isLock, setIsLock] = useState<boolean>(false);

  // 点击提交
  const submitHandle = () => {
    form.validateFields().then(async (values: any) => {
      // let paymentVoucher;
      // if (Array.isArray(values.paymentVoucher)) {
      //   paymentVoucher = values.paymentVoucher.filter((itm: any) => !!itm).map((itm: any) => itm.url);
      // }

      if (isLock) return;
      setIsLock(true);
      const params = {
        ...values,
        // paymentVoucher,
        id: info.taskId,
      };
      await franchiseeEdit(params).finally(() => {
        V2Message.success('编辑成功');
        setIsLock(false);
      });
      cancelHandle();
      loadData();
    });
  };
  // 关闭弹窗
  const cancelHandle = () => {
    form.resetFields();
    closeModalHandle();
  };

  // 编辑是的赋值操作
  useEffect(() => {
    if (!info) return;
    const {
      name,
      contactInfo,
      status,
      specialProvisions,
      remark,
      paymentVoucher
    } = info;
    form.setFieldsValue({
      name,
      contactInfo,
      franchiseeStatus: status,
      specialProvisions,
      remark,
      // paymentVoucher: Array.isArray(paymentVoucher) ? paymentVoucher.map((itm: any, idx: number) => ({ url: itm, name: `文件${idx + 1}` })) : []
      paymentVoucher
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info]);

  return (
    <Modal
      title='加盟商信息编辑'
      open={showModal}
      onOk={submitHandle}
      onCancel={cancelHandle}>
      <V2Form
        form={form}
        name='form'>
        <Row gutter={24}>
          <Col span={12}>
            <V2FormInput
              required
              label='加盟商姓名'
              config={{
                disabled: true
              }}
              name='name' />
          </Col>
          <Col span={12}>
            <V2FormInput
              required
              label='加盟商手机号'
              rules={[
                { pattern: MOBILE_REG, message: '手机号格式错误' }
              ]}
              name='contactInfo' />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <V2FormSelect
              label='客户状态'
              required
              name='franchiseeStatus'
              options={statusOptions}
              config={{ fieldNames: { label: 'name', value: 'id' } }}/>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <V2FormTextArea
              maxLength={200}
              label='特殊条款'
              name='specialProvisions'
              config={{
                showCount: true,
                rows: 3
              }} />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <V2FormTextArea
              maxLength={200}
              label='备注'
              name='remark'
              config={{
                showCount: true,
                rows: 3
              }} />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <V2FormUpload
              label='凭证'
              name='paymentVoucher'
              uploadType='file'
              config={{
                size: 100,
                maxCount: 5,
                fileType: ['jpeg', 'png', 'jpg', 'bmp', 'ppt', 'pptx', 'pdf']
              }}
            />
          </Col>
        </Row>
      </V2Form>
    </Modal>
  );
};
export default EditInfoModal;
