import { FC, useEffect, useState } from 'react';
import { Button, Form, Spin, message } from 'antd';
import styles from './index.module.less';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import { get, post } from '@/common/request';
import { getLBSConfig, setLBSConfig } from '@/common/api/location';

const SurroundConfig: FC<any> = ({ tenantId }) => {
  const [form] = Form.useForm();
  const [spinning, setSpinning] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<number>(0);
  const [categoryOptions, setCategoryOptions] = useState<any>([]);
  const [searchOptions, setSearchOptions] = useState<any>([]);
  const loadCategoryOptions = async () => {
    const { objectList } = await get(
      '/surround/model/list',
      { page: 1, size: 100 },
      {
        isMock: false,
        mockId: 331,
        mockSuffix: '/api',
        needHint: true,
        proxyApi: '/blaster',
      }
    );
    if (objectList.length) {
      const ops = objectList.map((item) => ({ id: item.id, name: item.name }));
      setCategoryOptions(ops);
      setSearchOptions(ops);
    }
  };

  const loadmodels = async () => {
    const data = await post(
      '/surround/model/search',
      { tenantId },
      {
        isMock: false,
        mockId: 331,
        mockSuffix: '/api',
        needHint: true,
        proxyApi: '/blaster',
      }
    );
    if (data && data.length) {
      form.setFieldValue('modelId', data[0].id);
    }
  };

  const loadLBSConfig = async () => {
    // 获取热力配置信息
    getLBSConfig({
      tenantId,
    }).then((res) => {
      form.setFieldValue('lbsFlag', res);
    });
  };

  const onSearch = (keyword) => {
    setSearchOptions(categoryOptions.filter((item) => item.name.includes(keyword)));
  };

  useEffect(() => {
    form.resetFields();
    loadCategoryOptions();
    loadmodels();
    loadLBSConfig();
  }, [refresh]);

  const onRefresh = () => {
    setRefresh(refresh + 1);
  };

  const onSubmit = () => {
    form.validateFields().then((values: any) => {
      // 保存热力开关
      setLBSConfig({ tenantId, flag: values.lbsFlag });

      // 保存模型-https://yapi.lanhanba.com/project/462/interface/api/45107
      const url = '/surround/model/tenant/relate';
      const params = {
        tenantId: tenantId,
        modelIds: [values.modelId],
      };
      setSpinning(true);
      post(url, params, { proxyApi: '/blaster' }).then(() => {
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
            label='选择当前模版'
            name='modelId'
            options={searchOptions}
            config={{
              allowClear: true,
              fieldNames: { label: 'name', value: 'id' },
              showSearch: true,
              onSearch: onSearch,
              filterOption: false,
              style: { width: '200px' }
            }}
            rules={[{ required: true }]}
          />

          <V2FormSelect
            label='是否展示LBS付费引导入口'
            name='lbsFlag'
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

export default SurroundConfig;
