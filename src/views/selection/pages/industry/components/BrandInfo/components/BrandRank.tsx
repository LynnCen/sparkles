/**
 * @Description 品牌项的排名
 */

import { FC, useEffect, useMemo, useState } from 'react';
import { Row, Col, Button } from 'antd';
import { brandRankData } from '@/common/api/selection';
import { isArray } from '@lhb/func';
import { rankIcon } from '@/common/enums/options';
import cs from 'classnames';
import styles from '../index.module.less';
import dayjs from 'dayjs';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import { bigdataBtn } from '@/common/utils/bigdata';

const BrandRank: FC<any> = ({
  brandId,
  month
}) => {
  const [active, setActive] = useState<number>(0);
  const [listData, setListData] = useState<any[]>([]);
  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, brandId, month]);

  const showListData = useMemo(() => {
    const len = listData?.length;
    if (len === 0) return [{}, {}, {}];
    if (len === 1) return [...listData, {}, {}];
    if (len === 2) return [...listData, {}];
    return listData;
  }, [listData]);

  const showBrandCompareBtn = useMemo(() => {
    let flag = false;
    listData?.map((item) => {
      item?.permissions.map((item) => {
        if (item.event === 'industry:brandCompare') {
          flag = true;
        }
      });
    });
    return flag;
  }, [listData]);

  const loadData = () => {
    const params = {
      isAllCity: active === 1,
      brandId,
      month: dayjs(month).format('YYYY-MM'),
    };
    brandRankData(params).then((data: any[]) => {
      setListData(isArray(data) ? data : []);
    });
  };
  const jumpToContrast = () => {
    bigdataBtn('9b7f6781-103d-400c-913c-9e7d5f686a03', '行业地图', '品牌对比', '点击了品牌对比');
    dispatchNavigate(`/recommend/contrast?brandId=${brandId}`);
  };
  return (
    <div className={cs('mt-20', styles.rankCon)}>
      <Row align='middle'>
        <Col span={12} className='fn-14 bold c-222'>
          排名
        </Col>
        <Col span={12} className={styles.flexEnd}>
          <div className={styles.switchCon}>
            <span
              className={cs(styles.switchItem, active === 0 ? styles.switchItemActive : null)}
              onClick={() => setActive(0)}>
                省份
            </span>
            <span
              className={cs(styles.switchItem, active === 1 ? styles.switchItemActive : null)}
              onClick={() => setActive(1)}>
              城市
            </span>
          </div>
        </Col>
      </Row>
      <Row className={cs(styles.theadCon, 'mt-10 fn-12 c-999')}>
        <Col span={9}>排名</Col>
        <Col span={9}>主力{active === 0 ? '省份' : '城市'}</Col>
        <Col span={6} className='rt'>门店数</Col>
      </Row>
      {
        showListData.map((item: any, index: number) => (
          <Row
            align='middle'
            className={cs(styles.thCon, 'fn-12')}>
            <Col span={9}>
              <div className={styles.iconBox}>
                <img src={rankIcon[index]} width='100%' height='100%' />
              </div>
            </Col>
            <Col span={9}>{item?.name || '-'}</Col>
            <Col span={6} className='rt'>{item?.total || '-'}</Col>
          </Row>
        ))
      }

      {showBrandCompareBtn && <Button
        type='primary'
        block
        onClick={jumpToContrast}
        className='mt-20'>
        品牌对比
      </Button>}
    </div>
  );
};

export default BrandRank;
