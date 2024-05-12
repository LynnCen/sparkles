import { FC, useEffect, useState } from 'react';
import { Modal, Form, message, Col, Row } from 'antd';
import V2Form from '@/common/components/Form/V2Form';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormCascader from '@/common/components/Form/V2FormCascader/V2FormCascader';
import { useMethods } from '@lhb/hook';
import { deepCopy } from '@lhb/func';
import { post } from '@/common/request';
const EditModal: FC<any> = ({
  editData = {},
  showEdit,
  id,
  onSuccess
}) => {
  const [form] = Form.useForm();
  const [selectionData, setSelectionData] = useState<any>([]);
  useEffect(() => {
    getSelection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getSelection = async () => {
    const params = {
      key: 'MDHY'
    };
    post('/common/selection/tree', params, {
      isMock: false,
      mockId: 335,
      mockSuffix: '/api',
      needHint: true
    }).then((res) => {
      setSelectionData(res);
    });
  };
  const methods = useMethods({
    handleOk() {
      form.validateFields().then((result) => {
        // https://yapi.lanhanba.com/project/331/interface/api/34315
        let url = '/shop/type/create';
        const params: any = deepCopy(result);
        params.industryId = params.industryId[params.industryId.length - 1];
        if (id) { // 编辑
          // https://yapi.lanhanba.com/project/331/interface/api/34325
          url = '/shop/type/update';
          params.id = id;
        }
        post(url, params, {
          isMock: false,
          mockId: 331,
          mockSuffix: '/api',
          needHint: true
        }).then(() => {
          message.success('操作成功', 0.2, () => {
            onSuccess && onSuccess();
            showEdit(false);
          });
        });
      });
    }
  });
  useEffect(() => {
    if (editData.visible) {
      if (id) { // 编辑
        const data = deepCopy(editData.data);
        data.industryId = data.industryList?.map(_ => _.id);
        form.setFieldsValue(data);
      } else { // 创建
        form.resetFields();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData.visible]);
  return (
    <Modal width={640} title={`${id ? '编辑' : '新增'}门店类型`} open={editData.visible} onOk={methods.handleOk} onCancel={() => showEdit(false)}>
      <V2Form form={form}>
        <Row gutter={16}>
          <Col span={12}>
            <V2FormInput
              label='门店类型'
              name='name'
              maxLength={10}
              required
            />
            <V2FormCascader
              label='所属行业'
              name='industryId'
              config={{
                maxTagCount: 'responsive',
                fieldNames: {
                  label: 'name',
                  value: 'id'
                }
              }}
              options={selectionData}
              required />
          </Col>
          <Col span={12}>
            <V2FormSelect
              label='门店状态'
              name='status'
              options={[
                { value: 0, label: '停用' },
                { value: 1, label: '启用' }
              ]}
              required />
          </Col>
        </Row>
      </V2Form>
    </Modal>
  );
};

export default EditModal;
