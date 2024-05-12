import { FC, useEffect, useRef, useState } from 'react';
import V2Container from '@/common/components/Data/V2Container';
import Filter from './components/Filter';
import MainCon from './components/MainCon';
import ResultMap from './components/ResultMap';
import SurroundDetail from '@/common/components/business/SurroundDrawer/SurroundDetail';
import styles from './entry.module.less';
import cs from 'classnames';
import { useMethods } from '@lhb/hook';
import { queryHistoryReport, saveSearchReport } from '@/common/api/surround';
import KeepAlive from 'react-activation';
import { isNotEmptyAny, treeFind } from '@lhb/func';
import LBSEntry from '@/common/components/business/SurroundDrawer/components/LBSEntry';
import { useSelector } from 'react-redux';

const SurroundSearch: FC<any> = () => {
  const cities = useSelector((state: any) => state.common.provincesCities);
  const [amapIns, setAmapIns] = useState<any>();
  const [detail, setDetail] = useState<any>({}); // 详情
  const [curPosition, setCurPosition] = useState<any>(null); // 当前默认定位后的城市
  const [cityInfoValue, setCityInfoValue] = useState<any>([]);// 查询城市pcdIds
  const [businessReport, setBusinessReport] = useState<any>(null);// 专业版洞察报告详情
  const [targetName, setTargetName] = useState<string>(''); // 限定的搜索城市名|省份名

  const cityInfoRef = useRef<any>();
  const isDiyShapeRef = useRef<boolean>(false);// 查询范围是否为自定义形状

  useEffect(() => {
    if (cities?.length && curPosition) {
      const province = treeFind(cities, (item) => item.name === curPosition.province);
      const { id: provinceId, name: provinceName } = province || {};
      // 直辖市没有城市名
      const city = treeFind(cities, (item) => item.name === (curPosition.city || curPosition.province));
      const { id: cityId, name: cityName } = city;
      setTargetName(cityName || provinceName);
      setCityInfoValue([provinceId, cityId]);
    }
  }, [cities, curPosition]);

  const methods = useMethods({
    onSearch(params: any) {
      // 保存报告
      methods.saveReport(params);
    },
    async saveReport(params) {
      const data = await saveSearchReport({ ...params });
      if (data) {
        setDetail(data);
      }
    },
    async queryHistory(detail: any) {
      let params:any = {
        lng: detail.lng,
        lat: detail.lat,
        radius: detail.radius,
        type: detail.poiSearchType,
      };
      // 如果是围栏类型，再传入borders
      if (detail.poiSearchType === 2) {
        params = {
          ...params,
          borders: detail?.borders
        };
      }
      const data = await queryHistoryReport({ ...params });
      setBusinessReport(data);
    },
    onReset() {
      setDetail({});
    },
  });
  useEffect(() => {
    isNotEmptyAny(detail) && methods.queryHistory(detail);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail]);
  return (
    <div className={cs(styles.container, 'bg-fff', 'pd-20')}>
      <V2Container
      /*
        减去高度设置120 = 顶部条高度48 + main上下padding各16 + container上下padding各20；
        减去高度大于这个值，页面底部留白大于预期；
        减去高度小于这个值，页面底部留白小于预期，且页面右侧会出现不必要的滚动条；
      */
        style={{ height: 'calc(100vh - 120px)' }}
        extraContent={{
          top: <Filter
            mapIns={amapIns}
            cityInfoRef={cityInfoRef}
            // city={city}
            // level={level}
            detail={detail}
            targetName={targetName}
            setTargetName={setTargetName}
            setCityInfoValue={setCityInfoValue}
            cityInfoValue={cityInfoValue}
            onSearch={methods.onSearch}
            onReset={methods.onReset}
            isDiyShapeRef={isDiyShapeRef}
          />,
        }}
      >
        <MainCon>
          {/* 还没展示查询结果时全屏显示，有结果后半屏显示 */}
          <ResultMap
            amapIns={amapIns}
            setAmapIns={setAmapIns}
            style={ !isNotEmptyAny(detail) && { height: '100%' } }
            setCurPosition={setCurPosition}
          />

          {(businessReport?.id && businessReport?.process === 4) && <LBSEntry reportId={businessReport?.id}/>}

          {detail?.id ? <SurroundDetail
            lat={detail.lat}
            lng={detail.lng}
            radius={detail.radius}
            address={detail.address}
            cityId={detail.cityId}
            cityName={detail.cityName}
            detail={detail}
            businessReport={businessReport}
            isSurround={true}
            poiSearchType={detail?.poiSearchType}
          /> : <></>}
        </MainCon>

      </V2Container>
    </div>
  );
};

export default ({ location }) => (
  <KeepAlive saveScrollPosition='screen' name={location.pathname}>
    <SurroundSearch />
  </KeepAlive>
);
