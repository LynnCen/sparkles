/**
 * @Description 周边详情抽屉
 *  展示入口
 *   -鱼你租户的机会点详情，传入inputDetail
 *   -简鹿等租户的机会点详情，传入inputDetail
 *   -周边查询历史记录页查看详情，传入id
 */

import { FC, useEffect, useState, useMemo } from 'react';
import { Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import V2Container from '@/common/components/Data/V2Container';
import Basic from './components/Basic';
import Main from './components/Main';
import Category from './components/Category';
import SurroundPopulation from './components/SurroundPopulation';
import Share from './components/Share';
import City from './components/City';
import { useMethods } from '@lhb/hook';
import styles from './index.module.less';
import { modelCategoryList, historyReportDetail, queryHistoryReport } from '@/common/api/surround';
import LBSBottom from './components/LBSBottom';
import LBSEntry from './components/LBSEntry';
import { isNotEmptyAny } from '@lhb/func';
import { useSelector } from 'react-redux';

const TabKeySurround = 'surround'; // 周边人群tab的key
const TabKeyCity = 'city'; // 城市tab的key

// 机会点详情周边信息
export interface SurroundInputDetailProps {
  lat: number;
  lng: number;
  radius: number; // 周边查询半径（米）
  name?: string;
  cityId?: number;
  cityName?: string;
  address?: string;
  createdAt?: string;
  poiSearchType?: number; // 1圆形 2多边形
  borders: any; // 多边形时才用到
  area: number; // 面积：平方千米
}

export interface SurroundDrawerProps {
  id?: number; // 周边信息id
  inputDetail?: SurroundInputDetailProps; // 周边信息detail，周边信息id为空使用detail
  open: boolean;
  setOpen: Function;
  isSurround?:boolean;
}

interface SuroundTabProps {
  label?: string;
  value?: string;
  categoryId?: number;
}

const SurroundDrawer: FC<SurroundDrawerProps> = ({
  id,
  inputDetail,
  open,
  setOpen,
  isSurround = false
}) => {
  const [tabActive, setTabActive] = useState<string>('');
  const [tabs, setTabs] = useState<SuroundTabProps[]>([]);
  const [detail, setDetail] = useState<any>({});
  const [businessReport, setBusinessReport] = useState<any>(null);
  const isShowLBS = useSelector((state: any) => state.common.tenantCheck.lbsFlag); // 是否显示LBS引导付费入口

  useEffect(() => {
    if (id) { // 有周边搜索历史id，获取详情
      getHistoryDetail(id);
    } else if (inputDetail) { // 没有id则使用传入的detail
      setDetail(inputDetail);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, inputDetail]);

  useEffect(() => {
    open && getTabList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  useEffect(() => {
    open && isNotEmptyAny(detail) && queryHistory(detail);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail, open]);
  const currentTabVal = useMemo(() => {
    return (tabActive && Array.isArray(tabs) && tabs.length) ? tabs.find((itm: SuroundTabProps) => itm.value === tabActive) : {};
  }, [tabActive, tabs]);

  const {
    getHistoryDetail,
    getTabList,
    onChangeTab,
    queryHistory
  } = useMethods({
    /**
     * @description 获取周边查询记录详情
     * @param id 周边查询记录id
     */
    async getHistoryDetail(id: number) {
      const data = await historyReportDetail({ id });
      data && setDetail({
        ...data,
        name: data.address, // 附加处理，address同时当作查询地点、地址
      });
    },
    async getTabList() {
      const res = await modelCategoryList();
      const list: SuroundTabProps[] = res.map((item: any) => ({
        label: item.name,
        value: item.code,
        categoryId: item.id,
      }));
      // 周边人群,城市信息写死必有
      list.push({ label: '周边人群', value: TabKeySurround, categoryId: undefined });
      list.push({ label: '城市信息', value: TabKeyCity, categoryId: undefined });
      // tabs列表数据
      setTabs(list);
      // 默认选中第一个
      setTabActive(list[0].value || '');
    },

    onChangeTab({ target: { value } }: RadioChangeEvent) {
      tabs.forEach((item) =>
        item.value === value && setTabActive(value)
      );
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
  });
  return (
    <V2Drawer
      open={open}
      onClose={() => setOpen(false)}
      className={styles.surroundDrawer}
      destroyOnClose>
      <V2Container
        style={{ height: 'calc(100vh - 48px)' }}
        extraContent={{
          top: <>
            <div className={styles.titleRow}>
              <div className='fs-20 c-222 bold'>周边详情</div>
              {((+detail.poiSearchType === 1 && detail.lat && detail.lng && detail.radius) || +detail.poiSearchType === 2) && <Share detail={{
                lat: detail.lat,
                lng: detail.lng,
                address: detail.address,
                radius: detail.radius,
                cityId: detail.cityId,
                cityName: detail.cityName,
                createdAt: detail.createdAt,
                poiSearchType: detail.poiSearchType, // 1圆形 2多边形
                borders: detail.borders, // 多边形时才用到
                area: detail.area,
              }} isFromHistory />}
            </div>
            <Basic
              name={detail.name}
              radius={detail.radius}
              area={detail.area}
              createdAt={detail.createdAt}/>

            {(businessReport?.id && businessReport?.process === 4) && isSurround && <LBSEntry reportId={businessReport?.id}/>}

            <div className={'mt-24'}>
              <Radio.Group
                options={tabs as any}
                onChange={onChangeTab}
                value={tabActive}
                optionType='button'
                buttonStyle='solid'
              />
            </div>
          </>
        }}
      >

        <Main>
          { (tabActive !== TabKeySurround && tabActive !== TabKeyCity) &&
           <Category
             tabKey={tabActive}
             categoryId={currentTabVal?.categoryId}
             lat={detail.lat}
             lng={detail.lng}
             cityName={detail.cityName}
             radius={detail.radius}
             address={detail.address}
             poiSearchType={detail.poiSearchType}
             borders={detail.borders}
             isShowAddress={false}
           />}
          { tabActive === TabKeySurround && (<SurroundPopulation
            fromSurroundSearch={false}
            lat={detail.lat}
            lng={detail.lng}
            cityId={detail.cityId}
            address={detail.address}
            isActiveTab={tabActive === TabKeySurround}
          />)}
          { tabActive === TabKeyCity && <City
            detail={detail}
            cityId={detail.cityId}
            cityName={detail.cityName}
            isActiveTab={tabActive === TabKeyCity}
          />}
          {/* 周边查询详情抽屉 isShowLBS 控制是否显示LBS引导付费入口 */}
          {/* process 3和4 即报告正在生成中或已生成，则没有购买入口 */}
          {isShowLBS && !(businessReport?.id && [3, 4].includes(businessReport?.process)) && isSurround && <LBSBottom
            detail={detail}
            type={tabActive}
          />}
        </Main>
      </V2Container>
    </V2Drawer>
  );
};

export default SurroundDrawer;
