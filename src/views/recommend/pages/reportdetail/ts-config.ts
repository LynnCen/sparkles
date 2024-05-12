export interface MockDemo {
  a: Function;
}
// 1,2,3区域的icon
export const leftIcon = [
  { url: '//staticres.linhuiba.com/project-custom/locationpc/map/medalone.png' },
  { url: '//staticres.linhuiba.com/project-custom/locationpc/map/medaltwo.png' },
  { url: '//staticres.linhuiba.com/project-custom/locationpc/map/medalthree.png' },
];
// 区域icon默认和选中状态
export const areaIcon = [
  { url: '//staticres.linhuiba.com/project-custom/locationpc/map/pointone.png' },
  { url: '//staticres.linhuiba.com/project-custom/locationpc/map/pointtwo.png' },
  { url: '//staticres.linhuiba.com/project-custom/locationpc/map/pointthree.png' },
  { url: '//staticres.linhuiba.com/project-custom/locationpc/map/selectone.png' },
  { url: '//staticres.linhuiba.com/project-custom/locationpc/map/selecttwo.png' },
  { url: '//staticres.linhuiba.com/project-custom/locationpc/map/selectthree.png' },
];

// 1,2,3,4,5排名的店铺点icon
export const rankIcon = [
  { url: '//staticres.linhuiba.com/project-custom/locationpc/lantu/ic_dingwei@2x.png' },
  { url: '//staticres.linhuiba.com/project-custom/locationpc/lantu/ic_dingwei@2x-2.png' },
  { url: '//staticres.linhuiba.com/project-custom/locationpc/lantu/ic_dingwei@2x-3.png' },
  { url: '//staticres.linhuiba.com/project-custom/locationpc/lantu/ic_dingwei@2x-4.png' },
  { url: '//staticres.linhuiba.com/project-custom/locationpc/lantu/ic_dingwei@2x-5.png' },
];
// 相关行业分类的icon
export const selectIcon = {
  '购物中心': { iconHref: 'iconic_left_gouwuzhongxin' },
  '店铺': { iconHref: 'iconic_left_dianpu' },
  '汽车相关': { iconHref: 'iconic_left_qiche', style: { color: '#006AFF' } },
  '餐饮服务': { iconHref: 'iconic_left_canting', style: { color: '#FC8331' } },
  '购物服务': { iconHref: 'iconic_left_gouwu', style: { color: '#AB67F8' } },
  '住宿服务': { iconHref: 'iconic_left_zhusu', style: { color: '#00B183' } },
  '商务住宅': { iconHref: 'iconic_left_shangwu', style: { color: '#6967F8' } },
  '其它': { iconHref: 'iconic_left_qita', style: { color: '#5BD8E0' } },
};
// 地图上显示的icon的样式
export const iconStyle = [
  {
    url: '//staticres.linhuiba.com/project-custom/locationpc/lantu/ic_gouwuzhongxin.png',
    anchor: 'bottom-center',
    size: [23, 24],
    zIndex: 1,
  },
  {
    url: '//staticres.linhuiba.com/project-custom/locationpc/lantu/ic_dianpu.png',
    anchor: 'bottom-center',
    size: [23, 24],
    zIndex: 1,
  },
  {
    url: '//staticres.linhuiba.com/project-custom/locationpc/lantu/ic_qiche.png',
    anchor: 'bottom-center',
    size: [23, 24],
    zIndex: 1,
  },
  {
    url: '//staticres.linhuiba.com/project-custom/locationpc/lantu/ic_canting.png',
    anchor: 'bottom-center',
    size: [23, 24],
    zIndex: 1,
  },
  {
    url: '//staticres.linhuiba.com/project-custom/locationpc/lantu/ic_gouwu.png',
    anchor: 'bottom-center',
    size: [23, 24],
    zIndex: 1,
  },
  {
    url: '//staticres.linhuiba.com/project-custom/locationpc/lantu/ic_zhusu.png',
    anchor: 'bottom-center',
    size: [23, 24],
    zIndex: 1,
  },
  {
    url: '//staticres.linhuiba.com/project-custom/locationpc/lantu/ic_shangwu.png',
    anchor: 'bottom-center',
    size: [23, 24],
    zIndex: 1,
  },
  {
    url: '//staticres.linhuiba.com/project-custom/locationpc/lantu/ic_qita.png',
    anchor: 'bottom-center',
    size: [23, 24],
    zIndex: 1,
  },
];

// 商店竞合状态颜色
export const circleColor = {
  0: { fillColor: '#A03AFF', selectColor: '#A03AFF', label: '一般' },
  1: { fillColor: '#F23030', selectColor: '#F23030', label: '竞争' },
  2: { fillColor: '#00A23C', selectColor: '#00A23C', label: '协同' },
};


export const rankStatus = {
  rank20: 'rank20',
  rank50: 'rank50',
  rank100: 'rank100'
};
export const rankOptions = [
  { key: rankStatus.rank20, name: '前20名', value: 20 },
  { key: rankStatus.rank50, name: '前50名', value: 50 },
  { key: rankStatus.rank100, name: '前100名', value: 100 },
];
