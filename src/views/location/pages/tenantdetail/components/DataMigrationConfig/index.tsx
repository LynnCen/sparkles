import { FC, useEffect, useState } from 'react';
import { Button, Form, Spin, message } from 'antd';
import styles from './index.module.less';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import { getMigrationConfig, setMigrationConfig } from '@/common/api/location';

const DataMigrationConfig: FC<any> = ({ tenantId }) => {
  const [form] = Form.useForm();
  const [spinning, setSpinning] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<number>(0);



  const loadConfig = async () => {
    // 获取数据迁移配置信息
    getMigrationConfig({ // TODO: api
      tenantId,
    }).then((res) => {
      form.setFieldValue('migrationFlag', res);
    });
  };



  useEffect(() => {
    form.resetFields();
    loadConfig();
  }, [refresh]);

  const onRefresh = () => {
    setRefresh(refresh + 1);
  };

  const onSubmit = () => {
    form.validateFields().then((values: any) => {
      // 保存配置
      setMigrationConfig({ tenantId, flag: values.migrationFlag }).then(() => {
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
            label='是否支持数据迁移功能'
            name='migrationFlag'
            options={[{ label: '是', value: true }, { label: '否', value: false },]}
            config={{
              style: { width: '200px' }
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

export default DataMigrationConfig;
