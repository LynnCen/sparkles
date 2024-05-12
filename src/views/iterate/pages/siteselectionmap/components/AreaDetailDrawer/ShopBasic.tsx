/**
 * @Description 基本信息
 */
import { FC, useMemo } from 'react';
import { Row, Col } from 'antd';
// import cs from 'classnames';
// import styles from './entry.module.less';
import V2Title from '@/common/components/Feedback/V2Title';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';

const ShopBasic: FC<any> = ({
  detail,
}) => {
  const { placeBaseInfo } = detail || {};
  const pcdName = useMemo(() => {
    const { provinceName, cityName, districtName } = placeBaseInfo || {};
    if (provinceName || cityName || districtName) {
      // 直辖市时省份名和城市名相同
      return provinceName === cityName ? `${cityName || ''}${districtName || ''}` : `${provinceName || ''}${cityName || ''}${districtName || ''}`;
    }
    return '';
  }, [placeBaseInfo]);
  return (
    <div className='mt-24'>
      <V2Title divider type='H2' text='基本信息'/>
      <Row gutter={16}>
        <Col span={8}>
          <V2DetailItem
            label='省市区'
            value={pcdName}
          />
        </Col>
        <Col span={8}>
          <V2DetailItem
            label='场地名称'
            value={placeBaseInfo?.placeName || '-'}
          />
        </Col>
        <Col span={8}>
          <V2DetailItem
            label='物业名称'
            value={placeBaseInfo?.managerName || '-'}
          />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <V2DetailItem
            label='建筑面积（m²）'
            value={placeBaseInfo?.builtArea || '-'}
          />
        </Col>
        <Col span={8}>
          <V2DetailItem
            label='建成年份'
            value={placeBaseInfo?.constructionTime || '-'}
          />
        </Col>
      </Row>
    </div>
  );
};

export default ShopBasic;
