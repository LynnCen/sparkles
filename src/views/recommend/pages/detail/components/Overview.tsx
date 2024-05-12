import React, { FC, useEffect, useRef, useState, useMemo } from 'react';
import styles from '../entry.module.less';
import { Button, Space, Spin, Table } from 'antd';
import { Avatar } from 'antd';
import { leftIcon } from '../ts-config';
import { downloadFile, throttle } from '@lhb/func';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import { tenantCheck } from '@/common/api/common';
import { fixNumber } from '@/common/utils/ways';
import Radar from '@/common/components/EChart/Radar';
// import Radar from '@/common/components/EChart/Radar';
import ScoreProgress from '@/common/components/business/ScoreProgress';
import IconFont from '@/common/components/IconFont';
import SelectDataRangeModal from './Modal/SelectDataRangeModal';
import { exportExcel, favorCheck, favorCreate, favorDelete } from '@/common/api/areacollect';
import { bigdataBtn } from '@/common/utils/bigdata';
// import Model from '@/views/imageserve/pages/model/entry';
// import { Bucket } from '@/common/enums/qiniu';
// const env = process.env.NODE_TYPE;
const Overview: FC<{
  id: any;
  ind: any;
  address: string;
  areaData: any;
  hasExportPermission: boolean;
  tabList:any;
}> = ({ id, ind, address, areaData, hasExportPermission }) => {
  const titleRef = useRef<any>(null);
  const [tableData, setTableData] = useState<any>([]);
  const [indicator, setIndicator] = useState<any>(null);
  const [radarData, setRadarData] = useState<any>(null);
  const [showBtn, setShowBtn] = useState<boolean>(false);
  const [selectDataRangeVisible, setSelectDataRangeVisible] = useState<boolean>(false);
  const [favorStatus, setFavorStatus] = useState<boolean>(false);
  const [spinning, setSpinning] = useState<boolean>(false);
  // const [url, setUrl] = useState<any>([]);
  // const [qiniuToken, setQiNiuToken] = useState<any>('');
  useEffect(() => {
    checkIsBabyCare();
    document.addEventListener('scroll', scrollChange);
    return () => {
      document.removeEventListener('scroll', scrollChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!areaData?.totalScore) return;
    setAreaData();
    handleRadarInfo();
    loadFavorStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaData]);
  // 是否显示评分进度条 modelType 1:简鹿 2：必点，不是则不展示
  const showScoreProgress = useMemo(() => {
    const { modelType } = areaData;
    return modelType === 1 || modelType === 2;
  }, [areaData]);
  // 当前评分进度条的值，注意：不同于标题显示的总分
  const curScoreVal = useMemo(() => {
    if (!showScoreProgress) return 0;
    const { modelType, areaRatio, cityRatio } = areaData;
    // modelType 1:简鹿 areaRatio 2：必点	cityRatio 接口返回的是数组，需要转成百分比值（向下取整）
    const val = Math.floor((modelType === 1 ? areaRatio || 0 : cityRatio || 0) * 100);
    // return val ? 10 : val; // 自定义数据看效果
    return val;
  }, [showScoreProgress, areaData]);
  // 当前评分范围
  // 0 x>50%为“一般”
  // 1 20%<x<=50%为“良好”
  // 2 x<=20%为“优秀”
  const scoreLevelIndex = useMemo(() => {
    if (!showScoreProgress) return 0;
    let targetIndex = 0;
    if (curScoreVal <= 20) {
      // 优秀
      targetIndex = 2;
    } else if (curScoreVal > 20 && curScoreVal <= 50) {
      targetIndex = 1;
    }
    return targetIndex;
  }, [showScoreProgress, curScoreVal]);
  // 对应区域的指针图标
  const targetPointerImg = useMemo(() => {
    if (scoreLevelIndex === 0) {
      return 'https://staticres.linhuiba.com/project-custom/locationpc/recommend/icon_pointer_general@2x.png';
    }
    if (scoreLevelIndex === 1) {
      return 'https://staticres.linhuiba.com/project-custom/locationpc/recommend/icon_pointer_fine@2x.png';
    }
    if (scoreLevelIndex === 2) {
      return 'https://staticres.linhuiba.com/project-custom/locationpc/recommend/icon_pointer_excellent@2x.png';
    }
    return '';
  }, [scoreLevelIndex]);
  // 对应区域的指针图标位置
  const targetPointerImgLeft = useMemo(() => {
    if (scoreLevelIndex === 0) {
      // 0 x>50%为“一般”
      return 100 - (curScoreVal - 50) * 2;
    } else if (scoreLevelIndex === 1) {
      // 1 20%<x<=50%为“良好”
      return 100 - (curScoreVal - 20) * 3.33;
    } else if (scoreLevelIndex === 2) {
      // x<=20%为“优秀”
      return 100 - curScoreVal * 5;
    }
    return 0;
  }, [curScoreVal, scoreLevelIndex]);

  // 判断是否时babycare租户
  const checkIsBabyCare = async () => {
    const result = await tenantCheck();
    result && result.isBabyCare && setShowBtn(true);
  };

  // 加载当前的收藏状态
  const loadFavorStatus = async () => {
    if (id && areaData && areaData.clusterId) {
      const result = await favorCheck({ reportId: id, clusterId: areaData.clusterId });
      if (result) {
        setFavorStatus(true);
      } else {
        setFavorStatus(false);
      }
    }
  };

  // 收藏
  const createFavor = async () => {
    favorCreate({
      reportId: id,
      clusterId: areaData.clusterId,
      area: address,
      name: areaData.name,
      score: areaData.totalScore,
    }).then(() => {
      loadFavorStatus();
    });
  };

  // 取消收藏
  const deleteFavor = async () => {
    favorDelete({ reportId: id, clusterId: areaData.clusterId }).then(() => {
      loadFavorStatus();
    });
  };

  // 导出
  const exportFile = async () => {
    // setSpinning(true);
    // if (url.length !== tabList.length - 1) {
    //   message.error('请稍后重试，图片正在生成中');
    //   setSpinning(false);
    //   return;
    // }
    // exportExcel({
    //   reportId: id,
    //   lat: areaData.lat,
    //   lng: areaData.lng,
    //   name: areaData.name,
    //   // urls: url,
    // }).then((value) => {
    //   if (value && value.url) {
    //     downloadFile({ url: value.url });
    //   }
    //   setSpinning(false);
    // });


    setSpinning(true);
    exportExcel({ reportId: id, lat: areaData.lat, lng: areaData.lng, name: areaData.name }).then((value) => {
      if (value && value.url) {
        downloadFile({ url: value.url });
      }
      // setSpinning(false);
    }).finally(() => {
      setSpinning(false);
    });
    bigdataBtn('fd9b083b-beb2-4fa5-9821-b681da63a5d5', '推荐报告查询', '导出', '导出了推荐报告');
  };

  const scrollChange = throttle(() => {
    const dom = titleRef.current;
    const viewTop = document.body.getBoundingClientRect().top;
    if (viewTop > -88) {
      if (dom.style.position === 'fixed') {
        dom.style.position = 'absolute';
        dom.style.paddingLeft = '20px';
        dom.style.paddingRight = '0px';
      }
    }
    if (viewTop < -88) {
      if (dom.style.position !== 'fixed') {
        dom.style.position = 'fixed';
        dom.style.paddingLeft = '120px';
        dom.style.paddingRight = '150px';
      }
    }
  }, 100);
  const setAreaData = async () => {
    try {
      const tableData: any = [];
      areaData.scores.map((val) => {
        tableData.push({
          ...val,
          key: val.enname,
          weightNum: val.score * val.weight,
        });
      });
      setTableData(tableData);
    } catch (error) {}
  };

  const columns = [
    {
      title: '评估指标',
      dataIndex: 'name',
      key: 'name',
      render: (_) => <span className={styles.columnStyle}>{_}</span>,
      width: 30,
    },
    {
      title: '得分',
      dataIndex: 'score',
      key: 'score',
      render: (_) => <span>{_.toFixed(2)}</span>,
      width: 30,
    },
    {
      title: '加权',
      dataIndex: 'weightNum',
      key: 'weightNum',
      render: (_) => <span>{_.toFixed(2)}</span>,
      width: 30,
    },
    {
      title: '权重值',
      dataIndex: 'weight',
      key: 'weight',
      render: (value, record, index) => {
        if (index !== tableData.length - 1) {
          return <span>{(value * 100).toFixed(1)}%</span>;
        } else {
          return <span>{
            ((1 - tableData.reduce((acc, item, index) => {
              if (index !== tableData.length - 1) {
                return item.weight + acc;
              } else {
                return acc;
              }
            }, 0)) * 100).toFixed(1)}%</span>;
        }
      },
      width: 120,
    },
  ];

  const onAddBtnClick = () => {
    dispatchNavigate('/recommend/planareamanage');
  };

  const handleRadarInfo = () => {
    if (!areaData?.scores?.length) return;
    const indicatorData: any = [];
    const radarData: any = [];
    areaData.scores.map((item) => {
      indicatorData.push({
        name: item.name,
        max: 100,
      });
      radarData.push(item.score);
    });
    setIndicator(indicatorData);
    setRadarData(radarData);
  };

  // useEffect(() => {
  //   // 获取七牛云token
  //   getQiNiuToken({ bucket: env === 'pe' ? Bucket.Certs : Bucket.Temp }).then(({ token }) => {
  //     setQiNiuToken(token);
  //   });
  // }, []);
  return (
    <Spin spinning={spinning}>
      <div className={styles.overview}>
        <div className={styles.topConSpace}>
          <div className={styles.topCon} ref={titleRef}>
            {ind < 3 && (
              <span style={{ marginRight: '16px' }}>
                <Avatar shape='square' size={40} src={leftIcon[ind].url} />
              </span>
            )}
            <span className={styles.titleSpan}>{`NO.${ind + 1}-${areaData.name}`}</span>
            <div className={styles.right}>
              {showBtn && (
                <span className={styles.addBtnSpan}>
                  <Button type='primary' onClick={onAddBtnClick}>
                    加入网规列表
                  </Button>
                </span>
              )}
              <Space className='mr-24'>
                <div className={styles.iconArea} onClick={() => setSelectDataRangeVisible(true)}>
                  <IconFont iconHref={'iconic_share1'} className={'fn-24'} />
                  <span className={styles.iconText}>分享</span>
                </div>
                {hasExportPermission && (
                  <div className={styles.iconArea} onClick={exportFile}>
                    <IconFont iconHref={'iconic_daochu'} className={'fn-24'} />
                    <span className={styles.iconText}>导出</span>
                  </div>
                )}
                {favorStatus ? (
                  <div className={styles.iconArea} onClick={deleteFavor}>
                    <IconFont iconHref={'iconic_gaoliangshoucang'} className={'fn-24'} />
                    <span className={styles.iconText}>收藏</span>
                  </div>
                ) : (
                  <div className={styles.iconArea} onClick={createFavor}>
                    <IconFont iconHref={'iconic_shoucang'} className={'fn-24'} />
                    <span className={styles.iconText}>收藏</span>
                  </div>
                )}
              </Space>
            </div>
          </div>
        </div>
        <div className={styles.rankCon}>
          <div className={styles.rankTitle}>区域评分信息</div>
          <div className={styles.rankInfo}>
            <div className={styles.leftCon}>
              {/* <div className={styles.rightTitleCon}>
              <span className={styles.rightWriteSpan}>综合总分</span>
              <span className={styles.rightRankSpan}>
                {Math.round(areaData.totalScore)}
                <span className={styles.rightLabel}>分</span>
              </span>

            </div> */}
              <div className={styles.totalPointsCon}>
                <div className='c-959 fs-14 bold'>综合总分</div>
                <div className='color-warning ml-12'>
                  <span className='fs-32 bold'>{fixNumber(areaData.totalScore)}</span>
                  <span className='fs-12 bold'>分</span>
                </div>
              </div>
              {/* cityRatio  val={areaData.areaRatio} */}
              {/* modelType 1:简鹿 areaRatio 2：必点	cityRatio
            x<=20%为“优秀”，20%<x<=50%为“良好”， x>50%为“一般” */}
              <div className={styles.ScoreProgressBox}>
                {showScoreProgress ? (
                  <ScoreProgress
                    targetIndex={scoreLevelIndex}
                    pointerImg={targetPointerImg}
                    pointerOffset={targetPointerImgLeft}
                    className={styles.scoreProgressCon}
                  />
                ) : null}
              </div>
              {indicator && radarData && (
                <div className={styles.radarBox}>
                  <Radar
                    data={radarData}
                    indicator={indicator}
                    title={Math.round(areaData?.totalScore)}
                    titleLabel='总分'
                    radius={60}
                    height='220px'
                    titleTextFontSize={['16px', '10px']}
                    radarInfo={{
                      rich: {
                        a: {
                          color: '#999999',
                          lineHeight: 22,
                          fontSize: '10px',
                          align: 'center',
                        },
                        b: {
                          color: '#222222',
                          align: 'center',
                          fontWeight: 'bolder',
                          fontSize: '12px',
                        },
                      },
                    }}
                    shape='polygon'
                    startAngle={90}
                  />
                </div>
              )}
            </div>
            <div className={styles.rightCon}>
              <div>
                <Table columns={columns} dataSource={tableData} pagination={false} rowKey='enname' />
              </div>
            </div>
          </div>
        </div>
        <SelectDataRangeModal
          visible={selectDataRangeVisible}
          setVisible={setSelectDataRangeVisible}
          id={id}
          ind={ind}
        />
      </div>
      {/* 导出excel所需要的图片 */}
      {/* <div
        style={{ width: '0', height: '0', overflow: 'hidden' }}
      >
        {
          isNotEmptyAny(qiniuToken) && isNotEmptyAny(tabList) && isNotEmptyAny(areaData?.name) && id && tabList.slice(0, -1).map((item) => {
            return <Model
              lng={areaData?.lng}
              lat={areaData?.lat}
              reportId={id}
              categoryId={item?.id}
              setUrl={setUrl}
              qiniuToken={qiniuToken}
            />;
          })
        }
      </div> */}
    </Spin>
  );
};

export default React.memo(Overview);
