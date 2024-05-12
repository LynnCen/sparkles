/**
 * @Description
 */
import { FC, useEffect, useRef } from 'react';
import styles from './index.module.less';
import cs from 'classnames';
import {
  leftListSelectionDOM,
  leftSection,
  secondLevel,
  sectionKey,
} from '../../ts-config';
import { receiveSession } from '@/common/api/networkplan';
import { getBrand } from '@/common/api/recommend';
import { Checkbox, Radio, Tooltip, Typography } from 'antd';
import { bigdataBtn } from '@/common/utils/bigdata';
import { CITY_LEVEL } from '@/common/components/AMap/ts-config';
import BrandBox from './BrandBox';
import IconFont from '@/common/components/IconFont';
const sideBoxClassName = 'sideBoxClassName';
const SideBox: FC<any> = ({
  active,
  selectionListRef,
  setChecked,
  checked,
  mapHelpfulInfo,
  setCurSelectDistrict,
  curSelectDistrict,
  // setFirstLevelCategory,
  districtCluster,
  options,
  setOptions,
}) => {
  const { city, level } = mapHelpfulInfo;
  const curCityIdRef = useRef<number>(0);

  const getSession = async () => {
    const data = await receiveSession();
    // module 1 网规相关，2行业商圈 （通用版）
    const brandData = await getBrand({ origin: 2, type: 3 });
    const options = {
      ...data,
      preferBrand: brandData,
      avoidBrand: brandData,
      tourBrand: brandData,
    };
    // setFirstLevelCategory(data?.firstLevelCategory);
    setOptions((state) => {
      return {
        ...state,
        ...options,
      };
    });
  };
  // 选择区时的公共逻辑
  const handleSelectArea = (value) => {
    const selectDistrict:any = [];
    options?.[sectionKey.area].map((item) => {
      if (value.includes(item.id)) {
        selectDistrict.push(item);
      }
    });

    if (curSelectDistrict?.districtInfo?.length) {
      setCurSelectDistrict((state) => ({
        ...state,
        districtInfo: selectDistrict,
      }));
    } else {
      setCurSelectDistrict({
        districtInfo: selectDistrict,
        cacheMapInfo: mapHelpfulInfo
      });
    }
  };
  const handleChecked = (value, active) => {
    let res = value;
    // 处理单选
    if (active === sectionKey.sortRule) {
      res = value.target.value;
    }
    // 处理选择行政区
    if (active === sectionKey.area) {
      // const selectDistrict:any = [];
      // options?.[sectionKey.area].map((item) => {
      //   if (value.includes(item.id)) {
      //     selectDistrict.push(item);
      //   }
      // });

      // if (curSelectDistrict?.districtInfo?.length) {
      //   setCurSelectDistrict((state) => ({
      //     ...state,
      //     districtInfo: selectDistrict,
      //   }));
      // } else {
      //   setCurSelectDistrict({
      //     districtInfo: selectDistrict,
      //     cacheMapInfo: mapHelpfulInfo
      //   });
      // }
      handleSelectArea(value);
    }
    setChecked((state) => {
      return {
        ...state,
        [active]: res,
      };
    });
  };
  // // 清除
  const handleClear = (active) => {
    if (active === sectionKey.area) {
      setCurSelectDistrict({
        districtInfo: [],
        cacheMapInfo: null
      });
    }

    setChecked((state) => {
      return {
        ...state,
        [active]: [],
      };
    });
  };
  // 处理埋点
  const handleeBigDataSend = (e, value, active) => {
    // 只处理选中
    if (!e.target.checked) return;
    const bigDataInfo = {
      [sectionKey.area]: {
        eventId: '97c51ecf-b714-9184-56f7-98841a3f4cc0',
        name: '行政区'
      },
      [sectionKey.preferBrandMenu]: {
        eventId: '511ca55d-022b-4748-8c2f-8b8b99452bce',
        name: '偏好品牌'
      },
      [sectionKey.avoidBrandMenu]: {
        eventId: 'c37aa625-0e1e-47cb-b82a-d36d6669cb25',
        name: '避开品牌'
      },
      [sectionKey.tourBrandMenu]: {
        eventId: 'a921db3c-c305-485e-9a2f-268af5f46c9d',
        name: '巡展品牌'
      },
      [sectionKey.developerBrand]: {
        eventId: '361c824e-0753-45ed-a7a0-a56e1a0e594d',
        name: '开发商品牌',
      }
    };
    // 单独处理商圈类型-二级
    if (secondLevel.includes(active)) {
      bigdataBtn('c62387e0-a5df-48d0-b055-12c7184b9802', '', `选中商圈类型-二级	`, `选中了商圈类型-二级`);
      return;
    }
    if (Object.keys(bigDataInfo).includes(active)) {
      bigdataBtn(bigDataInfo[active].eventId, '', `选中`, `选中了${bigDataInfo[active].name}`);
      return;
    }

    if (value?.eventId && value?.name) {
      bigdataBtn(value.eventId, '', `选中`, `选中了${value.name}`);
    }
  };
  useEffect(() => {
    getSession();
  }, []);

  useEffect(() => {
    // 当在全国、省视角下，且行政区未选中，
    if (level < CITY_LEVEL && !checked?.[sectionKey.area]?.length) {
      setOptions((state) => ({
        ...state,
        [sectionKey.area]: []
      }));
      return;
    }

    // 如果当前筛选项的城市和地图中心点的城市相同，则不需要改变options
    if (curCityIdRef.current === city?.id) return;
    if (!checked?.[sectionKey.area]?.length) {
      setOptions((state) => ({
        ...state,
        [sectionKey.area]: city?.districtList
      }));
      curCityIdRef.current = city?.id;
    }
  }, [city?.id, checked, level]);

  useEffect(() => {
    const { data, isBack } = districtCluster;
    if (isBack) { // 点击了返回市级列表
      // 取消选中区
      handleSelectArea([]);
      setChecked((state) => {
        return {
          ...state,
          [sectionKey.area]: [],
        };
      });
      return;
    }
    if (!data) return;
    const { districtId } = data;
    handleSelectArea([districtId]);
    setChecked((state) => {
      return {
        ...state,
        [sectionKey.area]: [districtId],
      };
    });
    // 处理埋点
    handleeBigDataSend(
      {
        target: { checked: true }
      },
      null,
      sectionKey.area,
    );
  }, [districtCluster]);

  return active ? (
    <div
      className={cs(styles.sideBox, leftListSelectionDOM, sideBoxClassName)}
      style={{
        // 左侧的样式加了9px
        minHeight: selectionListRef.current?.clientHeight,
        height: selectionListRef.current?.clientHeight,
        maxHeight: selectionListRef.current?.clientHeight,
      }}
      key={active}
    >

      {
        ![sectionKey.preferBrandMenu, sectionKey.avoidBrandMenu, sectionKey.tourBrandMenu, sectionKey.sortRuleMenu].includes(active) ? <>
          {/* 一级标题 */}
          <div className={styles.sideBoxTop}>
            <div>{leftSection.find(section => section.code === active)?.label}</div>
            <div className='mb-12 mt-4 c-999 fwNormal'>{leftSection.find(section => section.code === active)?.remark}</div>
          </div>
          {/* 二级children遍历 */}
          {
            leftSection?.find((selection) => selection.code === active)?.children?.map((child) =>
              <div className={styles.box} key={child.code}>
                {/* 二级表头 */}
                {
                  options?.[child?.code]?.length ? <div className={styles.title} key={child.code}>
                    {child.label}
                    {
                      checked?.[child?.code]?.length ? <span
                        onClick={() => handleClear(child.code)}
                        className={styles.clear}>清除</span> : <></>
                    }
                  </div> : <span key={child.code}></span>
                }
                <Checkbox.Group
                  onChange={(value) => handleChecked(value, child.code)}
                  value={checked?.[child.code]}
                  className='pl-12'
                >
                  {
                    options?.[child?.code]?.map((option) =>
                      <Checkbox
                        key={option.id}
                        onClick={(e) => handleeBigDataSend(e, option, child.code)}
                        value={option.id}
                        className={styles.checkbox}>
                        <Typography.Text className={styles.name} ellipsis={{
                          // tooltip: option?.name,
                          tooltip: {
                            title: option?.name,
                            getPopupContainer: (triggerNode: any) => triggerNode.parentNode
                          }
                        }}>
                          {option?.name}
                          {option.remark ? <Tooltip title={option.remark} trigger='hover'>
                            <span className={styles.remark}>
                              <IconFont iconHref={'iconxq_ic_shuoming_normal1'} />
                            </span>
                          </Tooltip> : <></>}
                        </Typography.Text>
                      </Checkbox>
                    )
                  }
                </Checkbox.Group>
              </div>
            )
          }
        </> : <></>
      }


      {/* 排名规则 - 单选*/}
      {
        active === sectionKey.sortRuleMenu ? <>
          <div className={styles.sideBoxTop}>
            <div>{leftSection.find(section => section.code === sectionKey.sortRuleMenu)?.label}</div>
            <div className='mb-12 mt-4 c-999 fwNormal'>{leftSection.find(section => section.code === sectionKey.sortRuleMenu)?.remark}</div>
          </div>
          <Radio.Group
            onChange={(value) => handleChecked(value, sectionKey.sortRule)}
            value={checked?.[sectionKey.sortRule]}
          >
            {options?.[sectionKey.sortRule]?.map((item, index) => <div key={index} className={styles.checkboxRadio}>
              <Radio
                className={styles.radio}
                onChange={(e) => handleeBigDataSend(e, item, sectionKey.sortRule)}
                value={item.id}>
                <Typography.Text className={styles.name} ellipsis={{
                  tooltip: {
                    title: item.name,
                    // getPopupContainer: (triggerNode: any) => triggerNode.parentNode
                    getPopupContainer: () => document.querySelector(`.${sideBoxClassName}`)
                  }
                }}>
                  {item.name}
                </Typography.Text>
              </Radio></div>)}

          </Radio.Group>
        </> : <></>
      }


      {/* 偏好品牌、避开品牌、巡展品牌 */}
      {
        [sectionKey.preferBrandMenu, sectionKey.avoidBrandMenu, sectionKey.tourBrandMenu].includes(active)
          ? (
            <BrandBox
              active={active}
              checked={checked}
              handleClear={handleClear}
              handleChecked={handleChecked}
              options={options}
              handleeBigDataSend={handleeBigDataSend}
            />
          ) : <></>
      }

    </div>
  ) : (
    <></>
  );
};
export default SideBox;
