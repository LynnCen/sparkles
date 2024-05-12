/**
 * @description 该页面目前没有入口可以访问了
 */
import { FC, useEffect, useRef, useState } from 'react';
import styles from './entry.module.less';
import Overview from './components/Overview';
import Area from './components/Area';
import { debounce, urlParams } from '@lhb/func';
import { modelCircle } from '@/common/api/recommend';
const Detail: FC<any> = () => {
  const id: string | number = urlParams(location.search)?.id || 0; // 详情时的id
  const itemRef = useRef(1); // 事件监听内部使用
  const areaLenRef = useRef(0);
  const PAGE_SIZE = 4;
  const [areaData, setAreaData] = useState<any>([]);
  const [reportData, setReportData] = useState({});
  const [showList, setShowList] = useState<any>([]);
  const [itemIndex, setItemIndex] = useState(1);
  const [overviewShowMap, setOverviewMap] = useState(true);
  useEffect(() => {
    if (id) {
      getAreaData();
    }
    document.addEventListener('scroll', scrollChange);
    return () => {
      document.removeEventListener('scroll', scrollChange);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (areaData.length === 0) return;
    const data = areaData.slice(itemIndex - 1, itemIndex + PAGE_SIZE - 1);
    const len = areaData.length;
    const spanceArr = Array.from({ length: len });
    spanceArr.splice(itemIndex - 1, PAGE_SIZE, ...data);
    setShowList(spanceArr);
  }, [areaData, itemIndex]);
  const getAreaData = async () => {
    const circleList = await modelCircle({ id });
    setReportData({
      address: circleList.address,
      logo: circleList.logo,
      modelName: circleList.modelName
    });
    setAreaData(circleList.items);
    areaLenRef.current = circleList.items.length;
    // setShowList(circleList.items.slice(0, (itemIndex * PAGE_SIZE)));
    const data = circleList.items.slice(0, PAGE_SIZE);
    const len = circleList.items.length;
    const spanceArr = Array.from({ length: len });
    spanceArr.splice(0, PAGE_SIZE, ...data);
    setShowList(spanceArr);
  };

  const scrollChange = debounce(() => {
    const yTop = document.body.getBoundingClientRect().top;
    /**
     * 标题：570， item：428, pagesize(最多渲染条目数): 4
     * list部分滚动高度：yTop + 570   一页list高度：-428 相除 + 1得当前是第几个处于最上方
     * 计算公式 Math.trunc((yTop + 570) / (-428)) + 1
     */
    const page = (Math.trunc((yTop + 570) / (-428)) < 0 ? 0 : Math.trunc((yTop + 570) / (-428))) + 1;
    if (itemRef.current !== page) {
      itemRef.current = page;
      setItemIndex(page);
    };
    if (yTop < -570) {
      setOverviewMap(false);
    } else {
      setOverviewMap(true);
    };
  }, 100);
  return (
    <div className={styles.container} >
      <Overview
        areaList={areaData}
        reportData={reportData}
        id={id}
        showMap={overviewShowMap}
      />
      <div>
        {showList.map((val, ind) =>
          <Area
            id={id}
            key={ind}
            area={val}
            ind={ind}
            rank={ind + 1}
          />
        )}
      </div>
    </div>
  );
};

export default Detail;
