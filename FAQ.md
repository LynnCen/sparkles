## 多级菜单uri设置
```md
例：
{
  name: '门店配置',
  encode: 'system:store',
  uri: '/system/20220810-1',
  icon: null,
  children: [
    {
      name: '模型配置',
      uri: '/system/20220810-2',
      children: [
        {
          name: '推荐模型',
          uri: '/system/store'
        }
      ]
    }
  ],
}
```
## 配置 page.config.ts以显示面包屑和不在menu的页面刷新不回退
```md
例：
export default {
  meta: {
    title: '踩点详情',
    parentPath: ['/storemanage'],
    breadcrumbs: {
      path: ['/storemanage/tap'],
      name: ['踩点管理'],
    },
  },
};

```