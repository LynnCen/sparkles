/**
 * @Description 配套筛选
 */

import { FC } from 'react';
import { Row, Col } from 'antd';
import { isArray } from '@lhb/func';
// import cs from 'classnames';
// import styles from './entry.module.less';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';

const Assort: FC<any> = ({
  selection,
  showHousingFilter,
  commonSelectConfig
}) => {
  return (
    <Row gutter={16}>
      {
        showHousingFilter ? <>
          <Col span={12}>
            <V2FormSelect
              label='小区建筑年代'
              name='houseYearTypes'
              options={isArray(selection?.houseYear) ? selection?.houseYear : []}
              mode='multiple'
              config={{
                ...commonSelectConfig,
                maxTagCount: 'responsive'
              }}
            />
          </Col>
          <Col span={12}>
            <V2FormSelect
              label='小区户数'
              name='householdsTypes'
              options={isArray(selection?.households) ? selection?.households : []}
              mode='multiple'
              config={{
                ...commonSelectConfig,
                maxTagCount: 'responsive'
              }}
            />
          </Col>
        </> : <></>
      }
      <Col span={12}>
        <V2FormSelect
          label='办公'
          name='workTypes'
          options={isArray(selection?.workType) ? selection?.workType : []}
          mode='multiple'
          config={{
            ...commonSelectConfig,
            maxTagCount: 'responsive'
          }}
        />
      </Col>
      <Col span={12}>
        <V2FormSelect
          label='学校'
          name='schoolTypes'
          options={isArray(selection?.schoolType) ? selection?.schoolType : []}
          mode='multiple'
          config={{
            ...commonSelectConfig,
            maxTagCount: 'responsive'
          }}
        />
      </Col>
      <Col span={12}>
        <V2FormSelect
          label='交通'
          name='trafficTypes'
          options={isArray(selection?.trafficType) ? selection?.trafficType : []}
          mode='multiple'
          config={{
            ...commonSelectConfig,
            maxTagCount: 'responsive'
          }}
        />
      </Col>
      <Col span={12}>
        <V2FormSelect
          label='景区'
          name='scenicTypes'
          options={isArray(selection?.scenicType) ? selection?.scenicType : []}
          mode='multiple'
          config={{
            ...commonSelectConfig,
            maxTagCount: 'responsive'
          }}
        />
      </Col>
      <Col span={12}>
        <V2FormSelect
          label='医院'
          name='medicalTypes'
          options={isArray(selection?.medicalType) ? selection?.medicalType : []}
          mode='multiple'
          config={{
            ...commonSelectConfig,
            maxTagCount: 'responsive'
          }}
        />
      </Col>
      <Col span={12}>
        <V2FormSelect
          label='其他市场'
          name='otherTypes'
          options={isArray(selection?.otherType) ? selection?.otherType : []}
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

export default Assort;
