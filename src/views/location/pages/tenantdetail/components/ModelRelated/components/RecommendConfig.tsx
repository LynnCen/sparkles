/**
 * @Description 开店区域推荐模型配置
 */
import { FC, useState } from 'react';
import { Button } from 'antd';
import TenantModelOperate from './components/TenantModelOperate';
import { TenantModelModalValuesProps } from './components/TenantModelOperate';

const RecommendConfig: FC<any> = ({ tenantId }) => {

  const [operateModel, setOperateModel] = useState<TenantModelModalValuesProps>({
    visible: false,
  });

  const onClickConfigModel = () => {
    setOperateModel({ visible: true, tenantId });
  };

  return (
    <div>
      <Button onClick={onClickConfigModel} className='mr-12' type='primary'>
        配置模型
      </Button>
      <TenantModelOperate setOperateModel={setOperateModel} operateModel={operateModel} />
    </div>
  );
};

export default RecommendConfig;
