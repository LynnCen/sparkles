import { FC, useEffect, useState } from 'react';
import { Button, Form, Spin, message } from 'antd';
import styles from './index.module.less';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import { getAreaIndustryConfig, getAreaIndustrySelection, setAreaIndustryConfig } from '@/common/api/location';
import { isArray } from '@lhb/func';

const AreaIndustryConfig: FC<any> = ({ tenantId }) => {
  const [form] = Form.useForm();
  const [spinning, setSpinning] = useState<boolean>(false);
  const [selection, setSelection] = useState<any[]>([]);
  const [refresh, setRefresh] = useState<number>(0);

  const getSelectionAndConfig = async () => {
    // 获取商圈行业列表 和配置信息
    const res = await getAreaIndustrySelection();
    if (!(isArray(res) && res.length)) {
      return;
    }
    setSelection(res);

    const data = await getAreaIndustryConfig({ tenantId });
    data && form.setFieldValue('id', data.id);
  };



  useEffect(() => {
    form.resetFields();
    getSelectionAndConfig();
  }, [refresh]);

  const onRefresh = () => {
    setRefresh(refresh + 1);
  };

  const onSubmit = () => {
    form.validateFields().then((values: any) => {
      // 保存配置
      const { id } = values;
      setAreaIndustryConfig({ tenantId, id }).then(() => {
        onRefresh();
        message.success('保存成功');
      }).finally(() => {
        setSpinning(false);
      });
    });
  };

  return (
    <div>
      <Spin spinning={spinning}>
        <Form form={form} colon={false}>
          <V2FormSelect
            label='所属行业'
            name='id'
            placeholder='请选择所属行业'
            options={selection}
            config={{
              style: { width: '200px' },
              fieldNames: { label: 'name', value: 'id' }
            }}
            rules={[{ required: true }]}
          />
        </Form>

      </Spin>
      <div className={styles.submit}>
        <Button onClick={onRefresh} className='mr-12'>
          取消
        </Button>
        <Button type='primary' onClick={onSubmit}>
          确定
        </Button>
      </div>
    </div>
  );
};

export default AreaIndustryConfig;
