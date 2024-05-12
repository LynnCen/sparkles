// /**
//  * @Description 本品牌门店分布
//  */

// import { FC, useEffect, useRef, useState } from 'react';
// import cs from 'classnames';
// import styles from '../index.module.less';
// import IconFont from '@/common/components/IconFont';
// import { Checkbox, Divider } from 'antd';
// import { getSelection, getStoreList } from '@/common/api/networkplan';
// import { isArray } from '@lhb/func';
// // import { CITY_LEVEL, PROVINCE_LEVEL } from '../ts-config';
// import V2Message from '@/common/components/Others/V2Hint/V2Message';

// const iconList = ['iconic_yikaidian', 'iconic_yibidian'];

// // 显示全国范围的level值（展示全国范围下的不同省份）
// export const COUNTRY_LEVEL = 1;
// // 显示省范围的level值 （展示省范围下的不同城市）
// export const PROVINCE_LEVEL = 2;
// // 显示市范围的level值 （展示市范围下的不同区）
// export const CITY_LEVEL = 3;

// const CurrentBrand:FC<any> = ({
//   showCurrentBrand,
//   setShowCurrentBrand,
//   level,
//   city,
//   amapIns
// }) => {
//   const [selectValue, setSelectValue] = useState<any>([]);
//   const [listData, setListData] = useState<any>([]);
//   const [storeData, setStoreData] = useState<any>([]);
//   const [indeterminate, setIndeterminate] = useState<boolean>(false);
//   const [checkAll, setCheckAll] = useState<boolean>(false);

//   const massMarkerRef = useRef<any>(null);

//   const onChange = (value) => {
//     if (level <= PROVINCE_LEVEL) {
//       V2Message.warning('地图放大至区级呈现门店分布数据');
//       return;
//     }
//     setSelectValue(value);
//     setIndeterminate(value.length && value.length < listData.length);
//     setCheckAll(value.length === listData.length);
//   };
//   // 获取本品牌门店状态
//   const getList = async() => {
//     const { planStoreStatus } = await getSelection();
//     setListData(planStoreStatus);
//   };
//   // 根据勾选项获取对应状态的门店数据
//   const getStoreData = async() => {
//     let params :any = {
//       statusList: selectValue,
//     };
//     if (level === PROVINCE_LEVEL) {
//       params = {
//         ...params,
//         provinceId: city?.provinceId
//       };
//     }
//     if (level === CITY_LEVEL) {
//       params = {
//         ...params,
//         provinceId: city?.provinceId,
//         cityId: city?.id
//       };
//     }
//     const data = await getStoreList(params);
//     setStoreData(data);
//   };
//   const drawStoreMarker = () => {
//     const val:any = [];
//     const style:any = [{
//       url: 'https://staticres.linhuiba.com/project-custom/locationpc/map/icon_network_kaidian.png',
//       anchor: new window.AMap.Pixel(6, 6),
//       size: new window.AMap.Size(32, 34),
//       // zIndex: 2,
//     }, {
//       url: 'https://staticres.linhuiba.com/project-custom/locationpc/map/icon_network_bidian.png',
//       anchor: new window.AMap.Pixel(6, 6),
//       size: new window.AMap.Size(32, 34),
//       // zIndex: 1,
//     }];
//     isArray(storeData) && storeData.length &&
//     storeData.map((item) => {
//       val.push({
//         lnglat: [+item.lng, +item.lat],
//         style: item.status - 1,
//         ...item,
//       });
//     });
//     var mass = new window.AMap.MassMarks(val, {
//       // opacity: 0.8,
//       zIndex: 999,
//       cursor: 'pointer',
//       style: style
//     });
//     massMarkerRef.current = mass;
//     mass.setMap(amapIns);
//   };
//   const handleSelect = (e) => {
//     if (level <= PROVINCE_LEVEL) {
//       V2Message.warning('地图放大至区级呈现门店分布数据');
//       return;
//     }
//     const allSelections:any = [];
//     listData.map((item) => {
//       allSelections.push(item.id);
//     });
//     setSelectValue(e.target.checked ? allSelections : []);
//     setIndeterminate(false);
//     setCheckAll(e.target.checked);
//   };

//   useEffect(() => {
//     getList();
//   }, []);

//   useEffect(() => {
//     if (!amapIns) return;
//     massMarkerRef.current?.clear();

//     if (isArray(selectValue) && selectValue.length) {
//       getStoreData();
//     }
//   }, [amapIns, selectValue, level, city?.id]);
//   useEffect(() => {
//     if (!amapIns) return;
//     drawStoreMarker();
//   }, [storeData, amapIns]);
//   return <div
//     className={cs(styles.currentBrand, showCurrentBrand ? styles.active : '')}
//     onClick={(e) => {
//       if (e.target === e.currentTarget) {
//         setShowCurrentBrand((state) => !state);
//       }
//     }}>
//       本品牌门店分布
//     {showCurrentBrand
//       ? <IconFont iconHref='iconarrow-down-copy' className='inline-block ml-4'/>
//       : <IconFont iconHref='iconarrow-down' className='inline-block ml-4'/>}
//     {
//       showCurrentBrand
//         ? <div className={styles.currentSelectBox}>
//           <Checkbox
//             className={styles.allBrand}
//             indeterminate={indeterminate}
//             onChange={handleSelect}
//             checked={checkAll}
//           >本品牌门店分布</Checkbox>
//           <Divider style={{
//             marginTop: 8,
//             marginBottom: 8
//           }}/>

//           <Checkbox.Group
//             className={styles.selectBox}
//             value={selectValue}
//             onChange={onChange} >
//             {
//               listData.map((item, index) => <div className={styles.check}>
//                 <Checkbox value={item.id}>
//                   <IconFont iconHref={iconList[index]} className={styles.icon}/>
//                   {item.name}
//                 </Checkbox>
//               </div>)
//             }
//           </Checkbox.Group>
//         </div>
//         : <></>
//     }
//   </div>;

// };
// export default CurrentBrand;
export default {};
