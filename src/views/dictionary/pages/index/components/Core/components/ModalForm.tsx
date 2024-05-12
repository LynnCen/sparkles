import React, { useEffect, useState } from 'react';
import { Modal, Form, Col, Row } from 'antd';
import type { DefaultOptionType } from 'rc-select/lib/Select';
import {
  DictionaryModalDataProps,
  InDrawerDictionaryFormDataType } from '../../../ts-config';
import {
  dictionaryDetail,
  dictionaryDataDetail,
  addDictionaryData,
  updateDictionaryData
} from '../../../api';
import { useMethods } from '@lhb/hook';
import { contrast } from '@lhb/func';
import V2Form from '@/common/components/Form/V2Form';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormInputNumber from '@/common/components/Form/V2FormInputNumber/V2FormInputNumber';

const ModalForm: React.FC<DictionaryModalDataProps> = ({ modalData, modalHandle, loadData }) => {
  const [upLevelOptions, setUpLevelOptions] = useState<Array<DefaultOptionType>>([]);
  const { id, visible, dictionaryId } = modalData;
  const [form] = Form.useForm();

  const { getDetail, getDictionaryClass, submitHandle } = useMethods({
    // 获取编辑详情
    getDetail: async (id: number) => {
      await getDictionaryClass();
      const detail = await dictionaryDataDetail({ id });
      const formData = {
        dictionaryId: contrast(detail, 'dictionaryId', ''),
        name: contrast(detail, 'name', ''),
        encode: contrast(detail, 'encode', ''),
        sortNum: contrast(detail, 'sortNum', ''),
      };
      form.setFieldsValue(formData);
    },
    // 获取字典分类详情
    getDictionaryClass: async () => {
      const detail = await dictionaryDetail({ id: dictionaryId });
      const { id, name } = detail;
      const options = [{
        label: name,
        value: id
      }];
      setUpLevelOptions(options);
    },
    submitHandle: () => {
      form.validateFields().then(async (values: InDrawerDictionaryFormDataType) => {
        const params = values;
        const submitMethod = id ? updateDictionaryData : addDictionaryData;
        if (id) {
          params.id = id;
        }
        await submitMethod(params);
        modalHandle(false);
        loadData();
      });
    }
  });

  useEffect(() => {
    if (id) {
      getDetail(id);
    } else {
      dictionaryId && getDictionaryClass();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <>
      <Modal
        title={ id ? '编辑字典' : '新建字典' }
        open={visible}
        destroyOnClose={true}
        width={640}
        onOk={submitHandle}
        onCancel={() => modalHandle(false)}>
        <V2Form form={form} preserve={false}>
          <Row gutter={16}>
            <Col span={12}>
              <V2FormSelect
                label='项目上级'
                name='dictionaryId'
                required
                options={upLevelOptions}
                formItemConfig={{
                  initialValue: dictionaryId
                }}/>
              <V2FormInput
                label='字典名称'
                name='name'
                maxLength={32}
                required/>
            </Col>
            <Col span={12}>
              <V2FormInput
                label='字典编码'
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
                  initialValue: 0
                }}/>
            </Col>
          </Row>
        </V2Form>
      </Modal>
    </>
  );
};

export default ModalForm;
