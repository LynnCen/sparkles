/**
 * @Description 行业信息-商场初筛配置
 */
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import { Spin, Form, Button } from 'antd';
import { FC, useEffect, useState } from 'react';
import styles from './index.module.less';
import { getConversionFlagConfig, setConversionFlagConfig } from '@/common/api/location';
import V2Message from '@/common/components/Others/V2Hint/V2Message';

interface Props {
  tenantId
}

const MarkertPreScreens: FC<Props> = ({
  tenantId
}) => {

  const [form] = Form.useForm(); // 地图
  const [spinning, setSpinning] = useState<boolean>(false);

  useEffect(() => {
    // 获取配置信息
    getConfigInfo();
  }, []);

  /** 刷新 */
  const onRefresh = () => {
    getConfigInfo();
  };

  // 提交
  const onSubmit = () => {
    form.validateFields().then((values: any) => {
      const { flag } = values;
      // 配置转化率入口
      setSpinning(true);
      setConversionFlagConfig({ flag, tenantId }).then(() => {
        V2Message.success('保存成功');
        onRefresh();
        setSpinning(false);
      }).catch(() => {
        V2Message.error('保存失败');
        setSpinning(false);
      });

    });
  };

  /** 获取配置信息 */
  const getConfigInfo = async () => {
    // 获取是否展示转化率入口配置信息
    const res = await getConversionFlagConfig({ tenantId });
    form.setFieldValue('flag', !!res);
  };


  return (
    <div>
      <Spin spinning={spinning}>
        <Form form={form} colon={false}>
          <V2FormSelect
            label='是否展示转化率入口'
            name='flag'
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

export default MarkertPreScreens;
