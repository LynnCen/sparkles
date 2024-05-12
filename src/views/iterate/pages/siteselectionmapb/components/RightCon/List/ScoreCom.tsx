/**
 * @Description 评分组件
 */

import { FC, useEffect, useRef, useMemo, useState } from 'react';
import { Row, Col, Tooltip } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { areaOverview } from '@/common/api/siteselectionmap';
import { beautifyThePrice, isArray, isNotEmpty } from '@lhb/func';
import cs from 'classnames';
import styles from './index.module.less';
import IconFont from '@/common/components/IconFont';
import ScoreOverview from './ScoreOverview';
import ScoreDimension from './ScoreDimension';
import ScoreOverviewRow from './ScoreOverviewRow';
import SpotListModal from '@/views/iterate/pages/siteselectionmapb/components/CollectDrawer/SpotListModal';
import { bigdataBtn } from '@/common/utils/bigdata';
import { geoCategory } from '../../../ts-config';
// const { Text } = Typography;

const ScoreCom: FC<any> = ({
  id,
  rank, // 排名
  firstLevelCategory, // 商圈类型数据
  hasLabel, // 是否有标签行
  setDrawerData, // 设置详情抽屉
  setPointDrawerData,
}) => {
  const [overviewData, setOverviewData] = useState<any>({});
  // const [showPointList, setShowPointList] = useState<boolean>(false); // 是否显示点位列表抽屉
  const statusRef: any = useRef(true);
  const [modalData, setModalData] = useState<any>({
    visible: false,
    // size: 20,
    modelClusterId: '',
  });

  useEffect(() => {
    id && loadData();
    return () => {
      statusRef.current = false;
    };
  }, [id]);

  const targetCategory = useMemo(() => {
    const { firstLevelCategoryId } = overviewData;
    if (firstLevelCategoryId && isArray(firstLevelCategory) && firstLevelCategory.length) return firstLevelCategory.find((item: any) => item.id === firstLevelCategoryId);
    return null;
  }, [firstLevelCategory, overviewData]);
  // 商场类型
  const isMallCategory = useMemo(() => {
    const { id } = targetCategory || {};
    return id === 1;
  }, [targetCategory]);
  // 社区
  const isCommunityCategory = useMemo(() => {
    const { id } = targetCategory || {};
    return id === 2;
  }, [targetCategory]);
  // // 其他
  const otherCategory = useMemo(() => {
    return !isMallCategory && !isCommunityCategory;
  }, [isMallCategory, isCommunityCategory]);
  // 是否配置商场点位
  const hasSiteLocation = useMemo(() => {
    return isNotEmpty(overviewData?.siteLocationNum);
  }, [overviewData]);

  const evaluateInfo = useMemo(() => {
    const { marketScore, resourceMallFlag } = overviewData || {};
    const targetStr = resourceMallFlag ? '汽车' : '餐饮';
    if (marketScore > 70) {
      return {
        // str: '有利于餐饮经营',
        str: <>
          <span className='c-006'>有利于</span>{targetStr}经营
        </>,
        subsection: [
          { percent: '100%', text: '不利于(0-50)' },
          { percent: '100%', text: '一般(50-70)' },
          { percent: (marketScore - 70) / 30 * 100, text: '有利(70-100)' },
        ],
        color: '#006aff'
      };
    }
    if (marketScore > 50 && marketScore <= 70) {
      return {
        // str: '餐饮经营一般',
        str: <>
          {targetStr}经营<span className='c-47d'>一般</span>
        </>,
        subsection: [
          { percent: '100%', text: '不利于(0-50)' },
          { percent: (marketScore - 50) / 20 * 100, text: '一般(50-70)' },
          { percent: 0, text: '有利(70-100)' },
        ],
        color: '#47D0DB'
      };
    }
    if (marketScore <= 50) {
      return {
        // str: '不利于餐饮经营',
        str: <>
          <span className='c-f23'>不利于</span>{targetStr}经营
        </>,
        subsection: [
          { percent: marketScore / 50 * 100, text: '不利于(0-50)' },
          { percent: 0, text: '一般(50-70)' },
          { percent: 0, text: '有利(70-100)' },
        ],
        color: '#EE2F2F'
      };
    }
    return {
      str: '',
      subsection: []
    };
  }, [overviewData]);

  const loadData = async () => {
    const data = await areaOverview({ id });
    statusRef.current && data && setOverviewData(data);
  };

  const population3kmShow = (data: any) => {
    return <Col span={hasSiteLocation ? 8 : 9}>
      <Tooltip title='周边3km居住人口'>
        <span className='c-999'>3km人口</span>
      </Tooltip>
      <div className='c-222 bold mt-4'>
        {beautifyThePrice(data?.population3km, ',', 0)}
      </div>
    </Col>;
  };

  const population500mShow = (data: any) => {
    return <Col span={hasSiteLocation ? 8 : 9}>
      <Tooltip title='周边500m居住人口'>
        <span className='c-999'>500m人口</span>
      </Tooltip>
      <div className='c-222 bold mt-4'>
        {beautifyThePrice(data?.population, ',', 0)}
      </div>
    </Col>;
  };

  const railRestaurantsShow = (data: any) => {
    return <Col span={hasSiteLocation ? 8 : 9}>
      <Tooltip title='围栏内餐饮门店数'>
        <span className='c-999'>餐饮门店数</span>
      </Tooltip>
      <div className='c-222 bold mt-4'>
        {data?.foodStores || '-'}
      </div>
    </Col>;
  };
  return (
    <div className={styles.overviewCon}>
      <div className={styles.scoreWrapper}>
        <ScoreOverviewRow
          overviewData={overviewData}
          evaluateInfo={evaluateInfo}
        />
        {/* <Row>
          <Col span={10}>
            <span className='fs-12 c-666'>市场评分</span>
            <span className='fs-20 pl-4 bold ff-impact' style={{
              color: evaluateInfo.color
            }}>{overviewData?.marketScore}</span>
          </Col>
          <Col span={14} className='fs-12 c-666 rt'>
            <span className='fs-20 c-faf bold selectNone'>{overviewData?.marketScore}</span>
            {evaluateInfo?.str}
          </Col>
        </Row> */}
        {/* 评分区间 */}
        <ScoreOverview evaluateInfo={evaluateInfo}/>
        {/* 评分维度 */}
        <ScoreDimension scores={overviewData?.scores}/>
      </div>
      {
        targetCategory ? <div className={cs(styles.secondaryWrapper, 'mt-8')}>
          <div>
            <IconFont
              iconHref={targetCategory.icon}
              style={{
                color: targetCategory.color
              }}
            />
            <span className='pl-4'>{overviewData?.firstLevelCategory}</span>
          </div>
          {/* isMallCategory isCommunityCategory */}
          <Row className='fs-12 mt-8'>
            {/* 配置了显示商圈点位，没配置就是null */}
            {
              hasSiteLocation ? <Col
                span={8}
                className='pointer'
                onClick={() => {
                  // 0的时候不执行
                  if (!overviewData?.siteLocationNum) return;
                  bigdataBtn('277af25e-24ac-4520-9215-c6afc2d66fbd', '选址地图', '列表-点位数', '点击列表-点位数');
                  setModalData((state) => ({
                    ...state,
                    visible: true,
                    modelClusterId: overviewData.id
                  })
                  );
                }}
              >
                <div className='c-006'>
                  商场点位
                </div>
                <div className='c-006 bold mt-4'>
                  {overviewData?.siteLocationNum}
                </div>
              </Col> : <></>
            }
            {
              isMallCategory ? <>
                <Col span={hasSiteLocation ? 8 : 9}>
                  <div className='c-999'>
                  日均客流量
                  </div>
                  <div className='c-222 bold mt-4'>
                    {isNotEmpty(overviewData?.mallPassFlow) ? `${overviewData.mallPassFlow}人` : '-'}
                  </div>
                </Col>
                {population3kmShow(overviewData)}
              </> : null
            }
            {
              isCommunityCategory ? <>
                {population500mShow(overviewData)}
                {population3kmShow(overviewData)}
              </> : null
            }
            {
              otherCategory ? <>
                {population3kmShow(overviewData)}
                {railRestaurantsShow(overviewData)}
              </> : null
            }
            {/* 商圈点位展示时，不显示老店占比 */}
            {
              hasSiteLocation
                ? <></>
                : <Col span={6}>
                  <Tooltip title={`${overviewData?.geoCategory === geoCategory.car ? '有车客群比例' : '3年餐饮老店占比'}`}>
                    <span className='c-999'>{overviewData?.geoCategory === geoCategory.car ? '有车客群' : '老店占比'}</span>
                  </Tooltip>
                  <div className='c-222 bold mt-4'>
                    {
                      overviewData?.geoCategory === geoCategory.car
                        ? isNotEmpty(overviewData?.carRate) ? `${overviewData.carRate}%` : '-'
                        : isNotEmpty(overviewData?.oldCateringRate) ? `${overviewData.oldCateringRate}%` : '-'
                    }
                  </div>
                </Col>
            }
          </Row>
        </div> : <></>
      }
      <div
        className={cs('ct c-006 fs-12 pointer', hasLabel ? 'mt-16' : 'mt-40')}
        onClick={() => {
          bigdataBtn('d2e7bbcc-3a29-04f7-5b40-28ebe0321e6b', '选址地图', '商圈列表-查看商圈详情按钮', '点击商圈列表-查看商圈详情按钮	');
          setDrawerData({
            id,
            open: true,
            rankVal: rank
          });
        }}
      >
        <span className='pr-2'>查看详情</span>
        <RightOutlined />
      </div>

      {/* 点位抽屉，收起就销毁该组件了，故不需要状态提升 */}
      <SpotListModal
        // open={showPointList}
        // modelClusterId={overviewData.id}
        modalData={modalData}
        setModalData={setModalData}
        setPointDrawerData={setPointDrawerData}
      />
    </div>
  );
};

export default ScoreCom;
