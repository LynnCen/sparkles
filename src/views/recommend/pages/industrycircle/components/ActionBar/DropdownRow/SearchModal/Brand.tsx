/**
 * @Description 品牌筛选
 */

import { FC } from 'react';
import { Row, Col } from 'antd';
// import cs from 'classnames';
// import styles from './entry.module.less';
import FormBrand from '@/common/components/Form/FormBrand';

const Brand: FC<any> = () => {

  // 接口额外入参
  // 来源 1导入；2中台
  // 列表类型 1:行业地图列表 2:开店推荐区域列表3:竞品分析列表
  const extraParams = {
    origin: 2,
    type: 3,
  };

  return (
    <Row gutter={16}>
      <Col span={12}>
        <FormBrand
          label='偏好品牌'
          name='preferBrandIds'
          mode='multiple'
          maxTagCount='responsive'
          fieldNames={{
            label: 'name',
            value: 'originBrandId', // 这里接口要的是中台的品牌id
          }}
          extraParams={extraParams}
          getPopupContainer={(node) => node.parentNode}
          style={{ width: '307px' }}
        />
      </Col>
      <Col span={12}>
        <FormBrand
          label='避开品牌'
          name='avoidBrandIds'
          mode='multiple'
          maxTagCount='responsive'
          fieldNames={{
            label: 'name',
            value: 'originBrandId',
          }}
          extraParams={extraParams}
          getPopupContainer={(node) => node.parentNode}
          style={{ width: '307px' }}
        />
      </Col>
    </Row>
  );
};

export default Brand;
