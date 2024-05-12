import { FC, useEffect, useState } from 'react';
import { Modal, Form, message, Row, Col } from 'antd';
import V2Form from '@/common/components/Form/V2Form';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormTextArea from '@/common/components/Form/V2FormTextArea/V2FormTextArea';
import V2FormCascader from '@/common/components/Form/V2FormCascader/V2FormCascader';
import { useMethods } from '@lhb/hook';
import { deepCopy } from '@lhb/func';
import { get, post } from '@/common/request';
import { refactorSelection } from '@/common/utils/ways';

const EditModal: FC<any> = ({
  editData = {},
  showEdit,
  id,
  onSuccess
}) => {
  const [form] = Form.useForm();
  const [industrySelectionData, setIndustrySelectionData] = useState<any>([]);
  const [typeSelectionData, setTypeSelectionData] = useState<any>([]);
  useEffect(() => {
    methods.getSelection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const methods = useMethods({
    handleOk() {
      form.validateFields().then((result) => {
        // https://yapi.lanhanba.com/project/331/interface/api/34327
        let url = '/shop/model/create';
        const params: any = deepCopy(result);
        console.log(result, '表单结果');
        params.industryId = params.industryId[params.industryId.length - 1];
        if (id) { // 编辑
          // https://yapi.lanhanba.com/project/331/interface/api/34328
          url = '/shop/model/update';
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
    },
    async getSelection() {
      post('/common/selection/tree', { key: 'MDHY' }, {
        isMock: false,
        mockId: 335,
        mockSuffix: '/api',
        needHint: true
      }).then((res) => {
        setIndustrySelectionData(res);
      });
      get('/shop/selection', {}, {
        isMock: false,
        mockId: 331,
        mockSuffix: '/api',
        needHint: true
      }).then((res) => {
        setTypeSelectionData(res.shopCategory);
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
    <Modal
      title={`${id ? '编辑' : '新增'}模型`}
      width={640}
      open={editData.visible}
      onOk={methods.handleOk}
      onCancel={() => showEdit(false)}>
      <V2Form form={form}>
        <Row gutter={16}>
          <Col span={12}>
            <V2FormInput label='模型名称' name='name' maxLength={20} required/>
            <V2FormInput label='模型编号' name='code' maxLength={50} disabled={!!id} required />
            <V2FormTextArea label='模型描述' name='description' maxLength={50} config={{ showCount: true }} required />
          </Col>
          <Col span={12}>
            <V2FormSelect label='店铺类型' name='categoryId' options={refactorSelection(typeSelectionData)} required />
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
              options={industrySelectionData}
              required />
          </Col>
        </Row>
      </V2Form>
    </Modal>
  );
};

export default EditModal;
