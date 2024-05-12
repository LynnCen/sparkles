/**
 * @Description 品牌筛选
 */

import { FC } from 'react';
import { Row, Col } from 'antd';
import { isArray } from '@lhb/func';
// import cs from 'classnames';
// import styles from './entry.module.less';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';

const Trend: FC<any> = ({
  selection,
  commonSelectConfig
}) => {

  return (
    <Row gutter={16}>
      <Col span={12}>
        <V2FormSelect
          label='辐射居住人口排名'
          name='radiationResidentsList'
          // 因为居住和办公的选项值一样的，所以接口就用了一个：radiationType来表示
          options={isArray(selection?.radiationType) ? selection?.radiationType : []}
          mode='multiple'
          config={{
            ...commonSelectConfig,
            maxTagCount: 'responsive'
          }}
        />
      </Col>
      <Col span={12}>
        <V2FormSelect
          label='辐射办公人口排名'
          name='radiationWorkPopulationList'
          options={isArray(selection?.radiationType) ? selection?.radiationType : []}
          mode='multiple'
          config={{
            ...commonSelectConfig,
            maxTagCount: 'responsive'
          }}
        />
      </Col>
    </Row>
  );
};

export default Trend;
