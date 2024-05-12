import { FC, useEffect, useMemo, useState } from 'react';
import styles from './entry.module.less';
import Top from './components/Top';
import MapContrast from './components/MapContrast';
import BottomInfo from './components/BottomInfo';
import { getBrand, getBrandType } from '@/common/api/recommend';
import { isArray, isNotEmptyAny, urlParams } from '@lhb/func';
import { Comprehensiveness, tabType } from './ts-config';


const Contrast: FC<any> = () => {
  const brandId = urlParams(location.search)?.brandId;

  const [selectedBrand, setSelectedBrand] = useState<any>(brandId ? [+brandId] : []);// 被选择的品牌Id
  const [brandList, setBrandList] = useState<any>([]);// 品牌列表
  const [brandLoaded, setBrandLoaded] = useState<boolean>(false);
  const [cityTypes, setCityTypes] = useState<any>([]); // 当前选中的城市类型
  const [selected, setSelected] = useState<any>(Comprehensiveness);// 地图上已被选中的品牌单选按钮，默认选中综合对比
  const [selections, setSelections] = useState<any>(null);// 获取筛选项类型
  const [isShowStoreType, setIsShowStoreType] = useState<boolean>(false);// 判断是否有权限展示门店类型tab相关内容
  const [curTabs, setCurTabs] = useState<string>(tabType.STORE_NUM);// 当前选中的tab（门店数量or门店类型）

  // 当选择变化时，同步变化已选择对比品牌的具体信息
  const selectedInfo = useMemo(() => {
    if (!(isNotEmptyAny(brandList) && isNotEmptyAny(selectedBrand))) return [];
    // 按照勾选顺序返回selectedInfo
    const res:any = [];
    selectedBrand.map((item) => {
      brandList.map((brand) => {
        if (item === brand?.id) {
          res.push(brand);
        }
      });
    });
    return res;
  }, [selectedBrand, brandList]);

  // 获取品牌列表数据
  const getBrandList = async() => {
    // 来源 1导入；2中台
    // 列表类型 1:行业地图列表 2:开店推荐区域列表3:竞品分析列表
    const res = await getBrand({ origin: 2, type: 3 });
    const resArr = isArray(res) && res.length ? res.map((item) => ({ ...item, name: item.shortName || item.name })) : [];
    setBrandLoaded(true);
    setBrandList(resArr);
    //  判断是否有权限展示门店类型tab
    setIsShowStoreType(res[0]?.permissions[0]?.event === 'industry:brandCompare:shopType');
    // 遍历一堆太麻烦了
    // res?.map((item) => {
    //   item?.permissions?.map((val) => {
    //     if (val?.event === 'industry:brandCompare:shopType') {
    //       // 获取权限
    //       setIsShowStoreType(true);
    //     }
    //   });
    // });
  };
  // 获取筛选项类型
  const handleGetBrandType = async() => {
    const data = await getBrandType();
    setSelections(data);
  };
  useEffect(() => {
    getBrandList();
  }, []);
  useEffect(() => {
    // 存在门店类型才需要获取相关筛选项
    if (isShowStoreType) {
      handleGetBrandType();
    }
  }, [isShowStoreType]);


  return (
    <div className={styles.container}>
      {/* 品牌选择 */}
      <Top
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
        loaded={brandLoaded}
        brandList={brandList}
        setSelected={setSelected}
      />

      {/* 门店地理位置分布对比 */}
      <MapContrast
        selected={selected}
        setSelected={setSelected}
        cityTypes={cityTypes}
        setCityTypes={setCityTypes}
        selectedInfo={selectedInfo}
        selectedBrand={selectedBrand}
        curTabs={curTabs}
        setCurTabs={setCurTabs}
        selections={selections}
        isShowStoreType={isShowStoreType}
      />
      {/* 底部柱状图 */}
      <BottomInfo
        selectedInfo={selectedInfo}
        selectedBrand={selectedBrand}
        curTabs={curTabs}
        selections={selections}
        cityTypes={cityTypes}
      />

    </div>
  );
};

export default Contrast;
