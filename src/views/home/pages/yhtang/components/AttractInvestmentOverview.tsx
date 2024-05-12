/**
 * @Description 招商目标完成情况
 */

import { FC, useEffect, useState } from 'react';
import { Tooltip, Divider, Skeleton } from 'antd';
import { beautifyThePrice, isArray } from '@lhb/func';
import { attractInvestmentCompletion } from '@/common/api/yhtang';
import cs from 'classnames';
import styles from '../entry.module.less';
import IconFont from '@/common/components/IconFont';

const AttractInvestmentOverview: FC<any> = ({
  searchParams
}) => {
  const [panelData, setPanelData] = useState<any[]>([]);
  const [panelRateData, setPanelRateData] = useState<any[]>([]);
  useEffect(() => {
    const { start, end } = searchParams;
    if (!(start && end)) return;
    loadData();
  }, [searchParams]);

  const loadData = () => {
    attractInvestmentCompletion(searchParams).then((data) => {
      const {
        goalCount,
        standardTaskCount,
        standardTaskFirstCount,
        standardTaskBranchesCount,
        standardTaskRelocationCount,
        signCount,
        locationFirstCount,
        locationBranchesCount,
        locationRelocationCount,
        signRate,
        newSignRate,
        resignRate
      } = data;
      const targetData = [
        {
          ...goalCount,
          bg: 'linear-gradient(90deg, #36CEF3 0%, rgba(57,211,249,0.8) 100%)',
          trimBg: '#36CEF3',
          cornerBg: 'linear-gradient(to right, rgba(54,206,243,0.20) 0%, rgba(54,206,243,0)',
        },
        {
          ...standardTaskCount,
          bg: 'linear-gradient(90deg, #FF7D7D 0%, rgba(246,137,137,0.8) 100%)',
          trimBg: '#FF7D7D',
          cornerBg: 'linear-gradient(to right, rgba(255,125,125,0.20) 0%, rgba(255,125,125,0)',
          supplement1: {
            ...standardTaskFirstCount
          },
          supplement2: {
            ...standardTaskBranchesCount
          },
          supplement3: {
            ...standardTaskRelocationCount
          },
        },
        {
          ...signCount,
          bg: 'linear-gradient(90deg, #8263FF 0%, rgba(168,150,239,0.8) 100%)',
          trimBg: '#8263FF',
          cornerBg: 'linear-gradient(to right, rgba(130,99,255,0.20) 0%, rgba(130,99,255,0)',
          supplement1: {
            ...locationFirstCount
          },
          supplement2: {
            ...locationBranchesCount
          },
          supplement3: {
            ...locationRelocationCount
          },
        }
      ];
      setPanelData(targetData);
      const targetRateData = [
        { ...signRate },
        { ...newSignRate },
        { ...resignRate },
      ];
      setPanelRateData(targetRateData);
    });
  };

  /**
   * @description 二级指标渲染
   * @param param1 {supplement, index}
   *    supplement：二级指标数据；
   *    index：序号0~
   * @return
   */
  const renderSupplement = ({ supplement, index } : {supplement: any, index: number}) => {
    return supplement ? <div className={index ? cs('ml-20') : ''}>
      <span className='c-666 fs-12 pr-4 vm'>{supplement?.name}</span>
      {
        supplement?.placeHolder ? <Tooltip
          placement='top'
          overlayInnerStyle={{
            fontSize: '12px'
          }}
          title={supplement?.placeHolder}>
          <span>
            <IconFont
              iconHref='iconquestion-o'
              className='fs-12 c-999 vm' />
          </span>
        </Tooltip> : <></>
      }
      <span className='c-222 fs-16 bold pl-12 vm'>{beautifyThePrice(supplement?.result, ',', 0)}</span>
    </div> : null;
  };

  return (
    <div className={cs(styles.invariableSection, styles.left)}>
      <div className='fs-16 c-222 bold'>
        招商目标完成情况
      </div>
      <Divider style={{ background: '#eee', margin: '16px 0' }}/>
      {
        isArray(panelData) && panelData.length > 0 ? <div className={styles.panelCon}>
          {
            // 卡片item
            panelData.map((item: any, index: number) => <div key={index} className={styles.panelItemCon}>
              {/* 背景 */}
              <div
                className={styles.bgCon}
                style={{
                  background: item.bg,
                }}>
              </div>
              {/* 左侧柱状装饰物 */}
              <div
                className={styles.trimCon}
                style={{
                  background: item.bg,
                }}>
              </div>
              {/* 内容区域 */}
              <div className={styles.contentCon}>
                <div className='mt-16 fs-14 c-666 font-weight-500'>
                  <span className='pr-6'>{item.name}</span>
                  {
                    item.placeHolder ? <Tooltip
                      placement='top'
                      overlayInnerStyle={{
                        fontSize: '12px'
                      }}
                      title={item.placeHolder}>
                      <span>
                        <IconFont
                          iconHref='iconquestion-o'
                          className='fs-14 c-999' />
                      </span>
                    </Tooltip> : <></>
                  }
                </div>
                <div className={cs('fs-28 bold mt-8 c-222', styles.textFlexCon)}>
                  <div className={styles.mainText}>
                    {beautifyThePrice(item.result, ',', 0)}
                  </div>
                  {
                    renderSupplement({ supplement: item?.supplement1, index: 0 })
                  }
                  {
                    renderSupplement({ supplement: item?.supplement2, index: 1 })
                  }
                  {
                    renderSupplement({ supplement: item?.supplement3, index: 2 })
                  }
                </div>
              </div>
              <div className={styles.cornerCon}
                style={{
                  background: item.cornerBg
                }}>
              </div>
            </div>)
          }

          {
            isArray(panelRateData) && panelRateData.length > 0 ? <div className={styles.panelRateCon}>
              <div className={styles.linCon}></div>
              <div className={styles.rateCon}>
                {
                  panelRateData.map((item: any, index: number) => <div
                    key={index}
                    className={cs(index > 0 ? 'mt-32' : '')}
                  >
                    <div className='fs-14 c-666'>
                      <span className='pr-6'>{item.name}</span>
                      {
                        item.placeHolder ? <Tooltip
                          placement='top'
                          title={item.placeHolder}>
                          <span>
                            <IconFont
                              iconHref='iconquestion-o'
                              className='fs-14 c-999' />
                          </span>
                        </Tooltip> : <></>
                      }
                    </div>
                    <div className='fs-18 bold mt-4 c-333'>
                      {item.result}
                    </div>
                  </div>)
                }
              </div>
            </div> : <></>
          }
        </div> : <Skeleton
          active
          title={false}
          paragraph={{
            rows: 4,
            width: 415
          }}
          style={{ width: '400px' }}/>
      }
    </div>
  );
};

export default AttractInvestmentOverview;

