import { FC, useEffect, useRef, useState } from 'react';
import styles from './entry.module.less';
import Overview from './components/Overview';
import { throttle, urlParams } from '@lhb/func';
import { Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { getCategoryList, modelCircle } from '@/common/api/recommend';
import City from './components/City';
import cs from 'classnames';
import Category from '@/common/components/business/SurroundDrawer/components/Category';

// import ScoreInfo from './components/ScoreInfo';

const Detail: FC<any> = () => {
  const id: string | number = urlParams(location.search)?.id || 0; // 详情时的id
  const ind: number = urlParams(location.search)?.ind ? Number(urlParams(location.search)?.ind) : 0; // 序号
  const radioRef = useRef<any>(null);
  const [checkVal, setCheckVal] = useState<any>(); // 被选中的tabs
  const [areaData, setAreaData] = useState<any>({ name: '' });
  const [tabList, setTabList] = useState<any>([]); // tabs列表数据
  const [address, setAddress] = useState<string>('');
  const [hasExportPermission, setHasExportPermission] = useState<boolean>(false);
  useEffect(() => {
    if (id) {
      getAreaData();
      getTabsList();
    }
    document.addEventListener('scroll', scrollChange);
    return () => {
      document.removeEventListener('scroll', scrollChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 状态2 获取推荐区域列表
  const getAreaData = async () => {
    try {
      const res = await modelCircle({ id });
      res && res.address && setAddress(res.address);
      if (res && res.permissions) {
        const exportPermission = res.permissions.filter((item) => item.event === 'recommend:export');
        if (exportPermission && exportPermission.length) {
          setHasExportPermission(true);
        }
      }
      let data: any;
      if (res.items[ind]) {
        data = res.items[ind];
        console.log('data', data);
        setAreaData(data);
      }
    } catch (error) {}
  };
  const onChange4 = ({ target: { value } }: RadioChangeEvent) => {
    tabList.map((item) => item.value === value && setCheckVal(item));
  };
  const scrollChange = throttle(() => {
    const dom = radioRef.current;
    const viewTop = document.body.getBoundingClientRect().top;
    if (viewTop > -664) {
      if (dom.style.position === 'fixed') {
        dom.style.position = 'static';
        dom.style.height = '32px';
      }
    }
    if (viewTop < -664) {
      if (dom.style.position !== 'fixed') {
        dom.style.position = 'fixed';
        dom.style.top = '62px';
        dom.style.height = '40px';
      }
    }
  }, 100);
  const getTabsList = async () => {
    const res = await getCategoryList({ reportId: id });
    const list = res.map((item) => {
      return {
        label: item.name || '-',
        value: item.code,
        id: item.id,
      };
    });
    // 城市信息写死必有
    list.push({ label: '城市信息', value: 'city' });
    // tabs列表数据
    setTabList(list);
    // 默认选中第一个
    setCheckVal(list[0]);
  };
  return (
    <div className={styles.container}>
      <div className={styles.fixedWidth}>
        <Overview ind={ind} id={id} address={address} areaData={areaData} hasExportPermission={hasExportPermission} tabList={tabList}/>
        <div className={styles.tabConSpance}>
          <Radio.Group
            ref={radioRef}
            className={styles.tabCon}
            options={tabList}
            onChange={onChange4}
            value={checkVal?.value}
            optionType='button'
            buttonStyle='solid'
          />
        </div>
        {/*  */}
        <div className={cs(styles.reportCon, checkVal?.value === 'city' && styles.marginBottom)}>
          {/* checkVal存在（默认值为undefined）并且不为city则渲染<Report/> */}
          {checkVal && address && areaData.lng && areaData.lat && checkVal?.value !== 'city' ? (
            <>
              <Category
                tabKey={checkVal.value}
                lat={areaData.lat}
                lng={areaData.lng}
                categoryId={checkVal.id}
                poiSearchType={1}
                showRadiusSelect
                props={{
                  reportId: id
                }}
                isShowAddress
                isReport
                stickyLeft
              />

            </>
          ) : (
            <City id={id} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Detail;
