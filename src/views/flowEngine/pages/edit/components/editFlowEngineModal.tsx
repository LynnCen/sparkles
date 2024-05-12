/**
 * @Description 新增/编辑工作流模版弹窗
 */

import { FC, useMemo } from 'react';
import { Col, Modal, Row } from 'antd';
import { useMethods } from '@lhb/hook';
import { debounce, urlParams } from '@lhb/func';
import { v4 } from 'uuid'; // 用来生成不重复的key

import { postFlowTemplateCreate, postFlowTemplateUpdate, postLocationFlowTemplateCreate } from '@/common/api/flowEngine';
import V2Form from '@/common/components/Form/V2Form';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import { FormInstance } from 'antd/es/form/Form';

export interface EditFlowEngineModalDataProps{
  visible:boolean;
  data:any;
  /**
   * @description 是否是demo页面，从 location 管理进来的不是 demo 页面
   */
  isDemo?:boolean;
  /**
   * @description 关联的表单id,location 管理进来的需要传
   */
  dynamicRelationId?:string|number|null;
}

export interface EditFlowEngineModalProps {
  form:FormInstance;
  modalData:EditFlowEngineModalDataProps;
  setModalData:(value:EditFlowEngineModalDataProps) => void;
}

const EditFlowEngineModal:FC<EditFlowEngineModalProps> = ({
  form,
  modalData,
  setModalData,
}) => {
  const {
    id, // 模版id
  } = JSON.parse(decodeURI(urlParams(location.search)?.params || null)) || {};

  const title = useMemo(() => {
    return id ? '编辑模版' : '新增模版';
  }, [id]);

  const methods = useMethods({
    closeModal() {
      setModalData({
        ...modalData,
        visible: false
      });
      form.resetFields();
    },
    handleOk() {
      form.validateFields().then((values:any) => {
        const params = {
          code: v4().substring(0, 8), // 截取8位
          ...modalData.data,
          name: values.name,
        };

        const handleResponse = (res: any) => {
          console.log(id ? '编辑' : '新增', res);
          this.closeModal();
          if (modalData?.isDemo) {
            dispatchNavigate(`/flowEngine?appId=${modalData.data.appId}&tenantId=${modalData.data.tenantId}`);
          } else {
            dispatchNavigate(`/location/tenantdetail?id=${modalData.data.tenantId}`);
          }
        };

        if (id) { // 如果有id说明是编辑
          postFlowTemplateUpdate(params).then((res: any) => handleResponse(res));
        } else { // 否则是新增
          if (modalData?.isDemo) {
            postFlowTemplateCreate(params).then((res: any) => handleResponse(res));
          } else {
            // '非demo页面新增'
            postLocationFlowTemplateCreate(params).then((res: any) => handleResponse(res));
          }
        }
      });
    }
  });


  return (
    <Modal
      title={title}
      open={modalData.visible}
      onOk={debounce(methods.handleOk, 500)}
      onCancel={() => methods.closeModal()}>
      <V2Form form={form}>
        <Row gutter={24}>
          <Col span={12}>
            <V2FormInput required label='名称' name='name' />
          </Col>
          <Col span={12}>
            <V2FormInput label='编码' placeholder='编码系统自动生成' name='code' disabled/>
          </Col>
        </Row>

      </V2Form>
    </Modal>
  );
};


export default EditFlowEngineModal;


