/**
 * @Description 商圈详情-基本信息栏
 */

import { FC, useMemo } from 'react';
import styles from './index.module.less';
import cs from 'classnames';
import IconFont from '@/common/components/IconFont';
import { beautifyThePrice, isNotEmpty } from '@lhb/func';
import { Col, Row, Tooltip } from 'antd';
import { geoCategory } from '../../../siteselectionmapb/ts-config';
interface BisConType {
  title:string;
  value:any;
  tag?:string
}

const Basic: FC<any> = ({
  detail,
  overView
}) => {

  const populationStr = (count, unit = '') => {
    if (!isNotEmpty(count)) return '-';
    return +count >= 10000 ? `${beautifyThePrice((count / 10000.0), ',', 1)}${unit}` : beautifyThePrice(Math.floor(count), ',', 0) + '人';
  };

  const data = useMemo(():BisConType[] => {


    return [
      {
        title: '所在城市',
        value: `${detail?.cityName || ''} | ${detail?.districtName || ''}`,
        tag: detail?.cityCategory || ''
      },
      {
        title: '商圈类型',
        value: `${detail?.firstLevelCategory || ''} | ${detail?.secondLevelCategory || ''}`,
      },
    ];
  }, [detail]);

  const data2 = useMemo(():BisConType[] => {
    // 其他类型
    const commonList = [
      {
        title: '周边500m居住人口',
        value: populationStr(overView?.population, '万人') || '-',
      },
      {
        title: '周边3km居住人口',
        value: populationStr(overView?.population3km, '万人') || '-',
      },
      {
        title: '围栏内餐饮门店数',
        value: overView?.foodStores ? overView?.foodStores + '家' : '-',
      },
      {
        title: overView?.geoCategory === geoCategory.car ? '有车客群比例' : '3年餐饮老店占比',
        value: overView?.geoCategory === geoCategory.car ? overView?.carRate ? overView?.carRate + '%' : '-' : overView?.oldCateringRate ? overView?.oldCateringRate + '%' : '-',
      },
      {
        title: '周边小区均价',
        value: overView?.housePrice ? overView?.housePrice + '元/m²' : '-',
      },
    ];
    // 社区类型
    // const sheQuType = [...commonList];

    // 商场
    const shangChangType = [{
      title: '商场日均客流量',
      value: populationStr(overView?.mallPassFlow, '万人') || '-',
    }, ...commonList];

    // const showMap = {
    //   1: shangChangType, // 商场型
    //   2: sheQuType, // 社区型
    // };
    const list = detail?.firstLevelCategoryId === 1 ? shangChangType : commonList;

    return list;
  }, [overView]);

  const address = useMemo(() => `${detail?.provinceName || ''}${detail?.cityName || ''}${detail?.districtName || ''}${detail?.centerAddress || ''}`, [detail]);

  return (
    <div className={styles.basicContainer}>
      <div className={cs(styles.cateCon, 'pd-16')}>
        <div className={styles.addressRow}>
          <IconFont iconHref='iconic_didian' className='fs-14 c-006 mr-4' />
          <Tooltip title={address}>
            <div className={cs(styles.titleCon, 'fs-14 c-222')}>{address}</div>
          </Tooltip>
        </div>

        <div className={cs(styles.infos, 'mt-16')}>
          {data.map((itm, idx) => <div key={idx}>
            <div className='fs-12 c-666'>{itm?.title}</div>
            <div className={styles.valueRow}>
              <div className='fs-14 c-222 bold mt-8'>{itm?.value}</div>
              {itm?.tag ? <div className={styles.tag}>{itm?.tag}</div> : <></>}
            </div>
          </div>)}
        </div>
      </div>

      <div className={cs(styles.singleCon, 'mt-8')}>
        <Row gutter={[8, 8]}>
          {data2.map((itm, idx) =>
            <Col key={idx} span={12}>
              <div className={styles.singleDev}>
                <div className='fs-12 c-666'>{itm?.title}</div>
                <div className={styles.valueRow}>
                  <div className='fs-14 c-222 bold mt-8'>{itm?.value}</div>
                  {itm?.tag ? <div className={styles.tag}>{itm?.tag}</div> : <></>}
                </div>
              </div>
            </Col>
          )}
        </Row>

      </div>
    </div>
  );
};

export default Basic;
