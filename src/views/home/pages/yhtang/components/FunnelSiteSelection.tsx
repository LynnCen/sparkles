/**
 * @Description 选址漏斗
 */

import { FC, useEffect, useState } from 'react';
import { siteSelectionData } from '@/common/api/yhtang';
import { Divider, Tooltip, Skeleton } from 'antd';
import { beautifyThePrice, isArray } from '@lhb/func';
import cs from 'classnames';
import styles from '../entry.module.less';
import IconFont from '@/common/components/IconFont';

const FunnelSiteSelection: FC<any> = ({
  searchParams
}) => {
  const [funnelData, setFunnelData] = useState<any[]>([]);

  useEffect(() => {
    const { start, end } = searchParams;
    if (!(start && end)) return;
    loadData();
  }, [searchParams]);

  const loadData = () => {
    siteSelectionData(searchParams).then((data) => {
      const {
        goalCount,
        gatherPointCount,
        gatherPointApproveCount,
        chancePointCount,
        chancePointApproveCount,
        signCount,
        netProcess,
        chancePointApproveRate,
      } = data;
      setFunnelData([
        {
          ...goalCount,
          progress: {
            ...netProcess
          },
          width: '420px', // 行宽
          trapezoidWidth: '272px', // 右侧梯形宽度
          baseMapBgOpacity: 0.5, // 梯形底图透明度
          btrRadius: '8px', // 右侧圆角
          skewVal: 'skew(-17.1deg)',
          filtrationRightVal: '-129px' // 右侧连线的偏移量
        },
        {
          ...gatherPointCount,
          width: '402px',
          trapezoidWidth: '255px',
          borderTopWidth: '56px',
          baseMapBgOpacity: 0.56,
        },
        {
          ...gatherPointApproveCount,
          width: '386px',
          trapezoidWidth: '236px',
          borderTopWidth: '56px',
          baseMapBgOpacity: 0.64,
        },
        {
          ...chancePointCount,
          progress: {
            ...chancePointApproveRate
          },
          width: '365px',
          trapezoidWidth: '217px',
          baseMapBgOpacity: 0.76,
          filtrationRightVal: '-166px',
          borderTopWidth: '56px',
          rhomboidHeight: '58px'
        },
        {
          ...chancePointApproveCount,
          width: '349px',
          trapezoidWidth: '198px',
          baseMapBgOpacity: 0.84,
          filtrationRightVal: '-148px',
          borderTopWidth: '56px',
          // borderRightWidth: '17px',
          rhomboidHeight: '58px'
        },
        {
          ...signCount,
          width: '326px',
          trapezoidWidth: '178px',
          baseMapBgOpacity: 1,
          borderTopWidth: '56px',
        },
      ]);
    });
  };
  return (
    <div className={cs(styles.invariableSection, styles.right)}>
      <div className='fs-16 c-222 bold'>
        选址漏斗
      </div>
      <Divider style={{ background: '#eee', margin: '16px 0' }}/>
      {
        isArray(funnelData) && funnelData.length > 0 ? <>
          {
            // 行容器
            funnelData.map((item: any, index: number) => <div
              className={styles.rowFunnelItem}
              key={index}
              style={{
                width: item.width
              }}>
              <div className={cs(styles.valCon, 'fs-20 c-333 bold')}>
                {beautifyThePrice(item.result, ',', 0)}
              </div>
              <div
                className={styles.trapezoidCon}
                style={{
                  width: item.trapezoidWidth
                }}>
                <div
                  className={styles.baseMap}
                  style={{
                    opacity: item.baseMapBgOpacity,
                    borderTopRightRadius: item?.btrRadius || '0px'
                  }}></div>
                <div className={styles.textCon}>
                  <span className='fs-14 bold pr-6'>{ item.name }</span>
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
                          className='fs-14' />
                      </span>
                    </Tooltip> : <></>
                  }
                </div>
                <div
                  className={styles.coverTriangle}
                  style={{
                    borderTopWidth: item.borderTopWidth,
                    borderRightWidth: item.borderRightWidth
                  }}>
                </div>
              </div>
              {
                item.progress ? <div
                  className={styles.filtrationCon}
                  style={{
                    right: item.filtrationRightVal
                  }}>
                  <div className={styles.relationCon}>
                    <div
                      className={styles.rhomboidCon}
                      style={{
                        height: item.rhomboidHeight,
                        transform: item.skewVal
                      }}>
                    </div>
                    <div className='ml-24'>
                      <div>
                        <span className='fs-14 pr-6 c-666'>{item.progress?.name}</span>
                        {
                          item.placeHolder ? <Tooltip
                            placement='top'
                            overlayInnerStyle={{
                              fontSize: '12px'
                            }}
                            title={item.progress?.placeHolder}>
                            <span>
                              <IconFont
                                iconHref='iconquestion-o'
                                className='fs-14 c-999' />
                            </span>
                          </Tooltip> : <></>
                        }
                      </div>
                      <div className='c-333 fs-18 bold'>
                        {item.progress?.result}
                      </div>
                    </div>
                  </div>
                </div> : <></>
              }
            </div>)
          }
        </> : <Skeleton
          active
          title={false}
          paragraph={{
            rows: 7,
            width: 415
          }}
          style={{ width: '400px' }}/>
      }
    </div>
  );
};

export default FunnelSiteSelection;
