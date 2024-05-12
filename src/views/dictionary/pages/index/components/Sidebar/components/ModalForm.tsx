import React, { useContext, useEffect } from 'react'; // { useEffect, useState }
import { Modal, Form, Row, Col } from 'antd';
import V2Form from '@/common/components/Form/V2Form';
import V2FormTreeSelect from '@/common/components/Form/V2FormTreeSelect/V2FormTreeSelect';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormInputNumber from '@/common/components/Form/V2FormInputNumber/V2FormInputNumber';
import {
  MoadlFormProps,
  DictionaryListItem,
  InDrawerDictionaryFormDataType } from '../../../ts-config';
import {
  dictionaryDetail,
  addDictionaryType,
  updateDictionaryType
} from '../../../api';
import { useMethods } from '@lhb/hook';
import { contrast } from '@lhb/func';
import DictionaryDataContext from '../../../context';

const ModalForm: React.FC<MoadlFormProps> = ({ modalData, modalHandle, loadData }) => {
  const dictionaryData: Array<DictionaryListItem> = useContext(DictionaryDataContext);
  const { formData, visible } = modalData;
  const [form] = Form.useForm();
  const treeDictionaryData = [
    {
      id: 0,
      name: '顶级节点',
      children: dictionaryData
    }
  ];

  // methods
  const { getDetail, submitHandle } = useMethods({
    // 获取详情
    getDetail: async (id: number) => {
      const detail = await dictionaryDetail({ id });
      const { parent = {} } = detail;
      form.setFieldsValue({
        parentId: contrast(parent, 'id', 0),
        name: contrast(detail, 'name', ''),
        encode: contrast(detail, 'encode', ''),
        sortNum: contrast(detail, 'sortNum', '')
      });
    },
    submitHandle: () => {
      form.validateFields().then(async (values: InDrawerDictionaryFormDataType) => {
        const params: InDrawerDictionaryFormDataType = values;
        // 根节点时接口要parentId传null
        if (!params.parentId) {
          params.parentId = null;
        }
        const submitMethod = formData.id ? updateDictionaryType : addDictionaryType;
        if (formData.id) {
          params.id = formData.id;
        }
        await submitMethod(params);
        loadData(); // 更新列表
        modalHandle(false); // 关闭弹窗
      });
    }
  });

  useEffect(() => {
    // 有id的时候是编辑
    visible && formData.id && getDetail(formData.id as number);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <>
      <Modal
        title={ formData.id ? '编辑分类' : '新建分类' }
        open={visible}
        destroyOnClose={true}
        onOk={submitHandle}
        onCancel={() => modalHandle(false)}>
        <V2Form form={form} preserve={false}>
          <Row gutter={16}>
            <Col span={12}>
              <V2FormTreeSelect
                label='上级'
                name='parentId'
                treeData={treeDictionaryData}
                placeholder='请选择上级菜单'
                rules={[{ required: true, message: '上级菜单不能为空' }]}
                config={{
                  fieldNames: {
                    label: 'name',
                    value: 'id'
                  },
                  treeDefaultExpandAll: true,
                }}/>
              <V2FormInput
                label='名称'
                name='name'
                maxLength={32}
                required/>
            </Col>
            <Col span={12}>
              <V2FormInput
                label='编码'
                name='encode'
                maxLength={32}
                required/>
              <V2FormInputNumber
                label='排序'
                name='sortNum'
                min={0}
                max={9999}
                precision={0}
                formItemConfig={{
                  initialValue: formData.sortNum
                }}/>
            </Col>
          </Row>
        </V2Form>
      </Modal>
    </>
  );
};

export default ModalForm;
