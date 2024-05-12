export const keepRoutes: any[] = [
  // 对列表去详情后，需要缓存组件
  {
    formPathname: '/selection/industry', // 行业地图
    toPathname: ['/guide/definition'] // 使用引导-相关定义
  },
  {
    formPathname: '/selection/industry', // 行业地图
    toPathname: ['/guide/operation'] // 使用引导-操作指引
  },
  {
    formPathname: '/guide/definition', // 行业地图
    toPathname: ['/guide/operation'] // 使用引导-操作指引
  },
  {
    formPathname: '/guide/operation', // 行业地图
    toPathname: ['/guide/definition'] // 使用引导-操作指引
  },
  {
    formPathname: '/recommend/modal', // 标准模型推荐
    toPathname: ['/recommend/detail'] // 区域详情
  },
  {
    formPathname: '/surround', // 周边查询
    toPathname: ['/surround/history'] // 周边查询-历史记录
  },
];
