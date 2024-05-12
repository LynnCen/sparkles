/**
 * @Description 行业商圈用的搜索框
 */
import { FC, useState, useEffect, useRef, useCallback } from 'react';
import { AutoComplete, Input, Typography } from 'antd';
import { isArray, debounce } from '@lhb/func';
import { CloseCircleFilled } from '@ant-design/icons';
import styles from './index.module.less';
import IconFont from '@/common/components/IconFont';
import HighlightRow from '@/common/components/business/HighlightRow';
import { getPoi } from '@/common/api/networkplan';

const SearchInMap: FC<any> = ({
  searchConfig, // 自定义搜索框组件
  autoCompleteConfig, // 自定义自动完成组件
  mapIns, // 地图实例
  debounceTimeout = 300,
  finallyKeywords, // 将关键词暴露出去
  mapHelpfulInfo, // 地图城市、缩放级别等信息
  finallySearchResult, // 将搜索结果暴露出去
  finallySelected, // 将选中项暴露出去
  width = 180,
  historySearchList = [], // 历史搜索结果
  hideBorder = false, // 如果ui要求hover无边框，且不出现蓝色，传入该项为true(目前所有场景都用到了)
}) => {
  const poiMarkerRef: any = useRef();
  const labelMarkerRef: any = useRef();
  const searchFnRef = useRef((str, targetCity) => loadData(str, targetCity));
  const overlayPOIGroups: any = useRef();
  const keywordsRef: any = useRef();

  const { city } = mapHelpfulInfo;

  const [keywords, setKeywords] = useState<string>('');
  const [options, setOptions] = useState<any>(historySearchList);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const debounceSearch = useCallback(debounce((str) => searchFnRef.current(str, city), debounceTimeout), [city]);


  useEffect(() => {
    if (!mapIns) return;
    labelMarkerRef.current = new window.AMap.Marker({
      content: ' ',
      map: mapIns,
      anchor: 'top-left',
      offset: [-34, 6]
    });
  }, [mapIns]);


  // 搜索事件
  const searchHandle = (keywordStr: string) => {
    if (!keywordStr) {
      setOptions(historySearchList);
      finallySearchResult && finallySearchResult([]);
      finallySelected && finallySelected(null);
      return;
    };
    // 防止重新创建debounce函数
    debounceSearch(keywordStr);
  };

  useEffect(() => {
    keywordsRef.current = keywords;
    searchHandle(keywords);
  }, [keywords]);
  // 如果在在搜索状态下，则先让options为空数组（接口数据返回太慢了）
  useEffect(() => {
    if (keywords && isLoading) {
      setOptions([]);
    }
  }, [isLoading, keywords]);

  const loadData = async (keywordStr: string, targetCity: any) => {
    setIsLoading(true);
    const searchResult = await getPoi({
      keyword: keywordStr,
      cityId: targetCity?.id,
      cityName: targetCity?.name
    });
    setIsLoading(false);
    if (!isArray(searchResult)) return;
    finallySearchResult && finallySearchResult(searchResult);
    keywordsRef.current && setOptions(searchResult);
  };
  const createPoiMarker = (poi: any) => {
    const { poiName, latitude, longitude } = poi;
    const lnglat = [+longitude, +latitude];
    const marker = new window.AMap.Marker({
      map: mapIns,
      icon: new window.AMap.Icon({
        image: 'https://staticres.linhuiba.com/project-custom/locationpc/map_poi_marker_red.png',
        size: [27, 37],
        imageSize: [27, 37],
        position: lnglat,
      }),
      anchor: 'bottom-center',
      position: lnglat,
    });
    marker.on('mouseover', () => {
      const labelContent = `<div class='amapPOISearchPoiMarkerLabel'>
      <div class='trangle'></div>
      <div class='marker'>${poiName}</div>
      </div>`;
      labelMarkerRef.current.setMap(mapIns); // 防止有的页面使用map.clear()
      labelMarkerRef.current.setPosition(lnglat);
      labelMarkerRef.current.setContent(labelContent);
    });
    marker.on('mouseout', () => {
      labelMarkerRef.current.setContent(' ');
    });
    return marker;
  };
  // 选择poi
  const selectHandle = (value: any, option: any, keywords) => {
    const { extraData } = option;
    option.keywords = keywords;
    finallySelected && finallySelected(option);
    const { poiName } = extraData;
    setKeywords(poiName);
    finallyKeywords && finallyKeywords(poiName);
    if (poiMarkerRef.current) {
      mapIns.remove(poiMarkerRef.current);
    }
    const marker = createPoiMarker(extraData);
    mapIns.setFitView(marker, true);
    poiMarkerRef.current = marker;
    // 每次先将新的覆盖物绘制在地图，然后再清空上一次遗留的覆盖物
    overlayPOIGroups.current && mapIns.remove(overlayPOIGroups.current);
  };
  // 关键词变化
  const changeHandle = (str: string) => {
    setKeywords(str);
    finallyKeywords && finallyKeywords(str);
  };

  const searchIconClick = () => {
    if (!options?.length) return;
    const markers: any = [];
    options.forEach((optionItem: any) => {
      const marker = createPoiMarker(optionItem);
      markers.push(marker);
    });
    const overlayGroups = new window.AMap.OverlayGroup(markers);
    mapIns.add(overlayGroups);
    mapIns.setFitView(markers);
    // 每次先将新的覆盖物绘制在地图，然后再清空上一次遗留的覆盖物
    overlayPOIGroups.current && mapIns.remove(overlayPOIGroups.current);
    overlayPOIGroups.current = overlayGroups;
  };

  const clearHandle = () => {
    if (overlayPOIGroups.current) {
      mapIns.remove(overlayPOIGroups.current);
      overlayPOIGroups.current = null;
    }
    if (poiMarkerRef.current) {
      mapIns.remove(poiMarkerRef.current);
      poiMarkerRef.current = null;
    }
  };

  return (
    <AutoComplete
      value={keywords}
      options={options.map((item: any, index) => {
        return {
          value: index,
          name: item?.poiName,
          extraData: item,
          label: (
            keywords
            // 搜索结果
              ? <div className='mb-7'>
                <HighlightRow
                  className='fn-14 c-132'
                  text={item.poiName}
                  keywords={keywords}
                />
                <Typography.Text ellipsis={{ tooltip: item.address }}>
                  <div className='fn-12 c-959'>
                    {item.address}
                  </div>
                </Typography.Text>
              </div>

            // 历史搜索记录
              : <Typography.Text ellipsis={{ tooltip: item.poiName }}>
                <div className='c-999 fs-12'>
                  <IconFont iconHref='iconlishi' className='mr-8'/>

                  {item.poiName}
                </div>
              </Typography.Text>
          )
        };
      })}
      onSearch={searchHandle}
      onSelect={(value, option) => selectHandle(value, option, keywords)}
      onChange={changeHandle}
      style={{
        marginRight: '8px'
      }}
      className={hideBorder ? styles.hideBorder : ''}
      {
        ...autoCompleteConfig
      }
    >
      <Input
        placeholder='请输入具体地址'
        allowClear={{
          clearIcon: <CloseCircleFilled onClick={clearHandle}/>
        }}
        suffix={<IconFont
          iconHref='iconsearch'
          className='c-959'
          onClick={searchIconClick}
        />
        }
        style={{ width }}
        {
          ...searchConfig
        }
      />
    </AutoComplete>
  );
};

export default SearchInMap;
