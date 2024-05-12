import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import { post } from '@/common/request';
import { downloadFile, urlParams } from '@lhb/func';
import { FC, useEffect, useState } from 'react';
import Overview from './components/Overview';
// import ResultList from './components/ResultList';
// import ShopInfo from './components/ShopInfo';
import Tendency from './components/Tendency';
import styles from './entry.module.less';
import cs from 'classnames';
import { Button } from 'antd';
import SurroundDetail from '@/common/components/business/SurroundDrawer/SurroundDetail';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
// import { downloadFileByBlob } from '@/common/utils/ways';
// import { getExportUrl } from '@/common/api/car';
// https://confluence.lanhanba.com/pages/viewpage.action?pageId=67518659
// 踩点分析报告列表页
import V2Tabs from '@/common/components/Data/V2Tabs';
import ResultTable from './components/ResultTable';


const id: string | number = urlParams(location.search)?.id;

const Footprintingreport: FC<any> = () => {
  const [data, setData] = useState<any>({});
  const [value, setValue] = useState<any>();
  const [options, setOptions] = useState<any>([]);
  const [searchParams, setSearchParams] = useState<any>({});
  const [surroundPermission, setSurroundPermission] = useState<boolean>(false);
  // const [url, setUrl] = useState<any>(null);
  // const [tabActive, setTabActive] = useState<string>(''); // Tabs选中项
  const loadCount = async () => {
    post('/checkSpot/project/flowRankDetail', { id: id }).then((res) => {
      setData(res?.data || {});
      const projectInfos = res?.data?.projectInfos || [];
      const ops = projectInfos.map((item) => ({ label: item.checkDate, value: item.id }));
      setOptions(ops);
      ops.length && setValue(ops[0].value);
      ops.length && setSearchParams({ id: ops[0].value });
      res?.data?.permissionButtons.map((item) => {
        if (item.event === 'surroundReport:pcEntrance') {
          setSurroundPermission(true);
        }
      });
    });
  };

  const onChange = (value: any) => {
    setValue(value);
    setSearchParams({ id: value });
  };

  useEffect(() => {
    loadCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // 获取对应tab下面的交付报告url
  // useEffect(() => {
  //   value && getExportUrl({ id: value }).then(({ url }) => {
  //     setUrl(url);
  //   });
  // }, [value]);
  return (
    <div className={styles.container}>
      <Overview data={data} />
      <TitleTips name='踩点分析结果' showTips={false} />

      {/* <div className={styles.radio}>
        <Radio.Group options={options} optionType='button' value={value} onChange={onChange} />
      </div> */}
      <V2Tabs
        items={options.map((optionItem: any) => ({ key: optionItem.value, label: optionItem.label }))}
        activeKey={value}
        onChange={onChange} />
      {data?.projectInfos?.map((item) => {
        let element = <></>;
        if (item.id === value) {
          item?.permissions?.map((permissions) => {
            if (permissions.event === 'checkSpotApp:reportDownload') {
              element = <div className={cs(styles.topBtn, 'mb-16')} key={item.id}>
                <Button
                  onClick={() => {
                    if (!item?.deliveryReportUrl) {
                      V2Message.error('报告生成中，请耐心等待');
                      return;
                    }

                    downloadFile({
                      name: '踩点分析报告.pdf',
                      url: item?.deliveryReportUrl.split('attname')[0],
                      preview: true
                    });
                  }}
                  type='primary'
                  className='mr-6'>查看报告</Button>
                <Button
                  onClick={() => {
                    if (!item?.deliveryReportUrl) {
                      V2Message.error('报告生成中，请耐心等待');
                      return;
                    }
                    downloadFile({
                      name: item?.deliveryReportUrl || '踩点分析报告.pdf',
                      downloadUrl: item?.deliveryReportUrl,
                      useBlob: true,
                    });
                  }}
                  type='primary'>下载报告</Button>
              </div>;
            }
          });
        }
        return element;
      })}
      {/* <ResultList searchParams={searchParams} /> */}
      <ResultTable searchParams={searchParams}/>

      {/* 客流分时趋势图 */}
      {data?.projectInfos?.length && data?.projectInfos[0]?.lineDatas?.length > 0 ? (
        <div>
          <TitleTips name='分时段客流量趋势' showTips={false} />
          <Tendency data={data?.projectInfos} />
        </div>
      ) : null}
      {/* <TitleTips name='场地信息' showTips={false} />
      <ShopInfo data={data} /> */}

      {/* 数据不全则不展示周边信息 */}
      { surroundPermission &&
        data?.checkSpotDetail?.lat &&
        data?.checkSpotDetail?.lng &&
        data?.shopInfo?.placeAddress &&
        data?.checkSpotDetail?.cityId &&
        data?.shopInfo?.city &&
        <div>
          <TitleTips name='周边信息' showTips={false} />
          {true && <SurroundDetail
            fromSurroundSearch={false}
            lat={data?.checkSpotDetail?.lat}
            lng={data?.checkSpotDetail?.lng}
            // 默认查询半径1000--prd中要求
            radius={1000}
            address={data?.shopInfo?.placeAddress}
            cityId={data?.checkSpotDetail?.cityId}
            cityName={data?.shopInfo?.city}
          />}
        </div>
      }

    </div>
  );
};

export default Footprintingreport;
