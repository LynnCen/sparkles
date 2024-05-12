// 商店竞合状态颜色
export const circleColor = {
  3: { fillColor: '#a94cff', selectColor: '#a94cff', label: '一般' },
  1: { fillColor: '#F23030', selectColor: '#F23030', label: '竞争' },
  2: { fillColor: '#00A23C', selectColor: '#00A23C', label: '协同' },
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
