import { useMethods } from '@lhb/hook';
import { get, post } from '@/common/request';
import { Form, message, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { isNotEmptyAny } from '@lhb/func';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2Form from '@/common/components/Form/V2Form';
// 半径选择框选项
const radiusOptions = [
  { label: '0.5km', value: 500 },
  { label: '1km', value: 1000 },
  { label: '2km', value: 2000 },
  { label: '3km', value: 3000 },
  { label: '4km', value: 4000 },
  { label: '5km', value: 5000 },
];

const SurroundSearchSet: React.FC<any> = ({
  surroundSearchConfig,
  setSurroundSearchConfig,
  onSearch,
  templateId
}) => {

  const { templateRestriction } = surroundSearchConfig;
  const [form] = Form.useForm();
  const [tplOptions, setTplOptions] = useState<any>([]);

  const { onCancel, onOk } = useMethods({
    onCancel() {
      setSurroundSearchConfig({ ...surroundSearchConfig, visible: false });
    },
    onOk() {
      form.validateFields().then((values: any) => {
        const params = {
          templateId,
          propertyConfigRequestList: [{
            ...surroundSearchConfig,
            templateRestriction: isNotEmptyAny(values) ? JSON.stringify({ ...JSON.parse(templateRestriction || '{}'), ...values }) : JSON.stringify({})
          }]
        };
        const url = '/dynamic/property/update';
        post(url, params, { proxyApi: '/blaster', needHint: true }).then((success) => {
          message.success('编辑配置成功');
          if (success) {
            onCancel();
            onSearch();
          }
        });
      });
    },
  });

  const loadTpls = async () => {
    const { objectList } = await get(
      '/surround/model/list',
      { page: 1, size: 100 },
      {
        needHint: true,
        proxyApi: '/blaster',
      }
    );
    if (objectList.length) {
      const ops = objectList.map((item) => ({ value: item.id, label: item.name }));
      setTplOptions(ops);
    }
  };



  useEffect(() => {
    if (!surroundSearchConfig.visible) {
      form.resetFields();
      return;
    }
    loadTpls();
    // 限制设置使用模板限制
    templateRestriction && form.setFieldsValue(JSON.parse(templateRestriction));

    // eslint-disable-next-line
  }, [surroundSearchConfig.visible]);


  return (
    <Modal title='周边品牌查询' open={surroundSearchConfig.visible} onOk={onOk} onCancel={onCancel} width={400}>
      <V2Form form={form}>
        <V2FormSelect
          label='查询范围'
          name='radius'
          options={radiusOptions}
          required={true}
        />
        <V2FormSelect
          label='周边查询模板'
          name='tplId'
          options={tplOptions}
          required={true}
        />
      </V2Form>
    </Modal>
  );
};
export default SurroundSearchSet;
