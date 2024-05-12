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
noShow不配置则默认显示，当配置true后不显示父级面包屑
export default {
  meta: {
    title: '踩点详情',
    parentPath: ['/storemanage'],
    breadcrumbs: {
      path: ['/storemanage/tap'],
      name: ['踩点管理'],
      noShow:true,
    },
  },
};

```
## PDF页面开发
```md
1. 开发页面统一放在pdf目录下，生成路由 lhb create pdf/xxxxx -p
2. 在src/views/pdf/pages/index/entry.tsx中配置相关的pdf导航
3. 入口：
未登录状态时，验证码登录页面底部点击按钮[去PDF页]跳转到对应的pdf目录页，点击对应的导航进入页面
已登录状态是，配置src/layout/index.tsx页面中的devMenu，通过点击左侧的菜单栏进入对应的页面
```
## V2版本的Table组件一定要配合v2container容器使用
```
1. 注意defaultColumns中的dragChecked属性的配置，不要全部设为false，不设置或者全设置false，table就会是空状态的展示，文档中并没有特别说明该参数
2. 使用自定义表头功能时，一定要注意在文档中确认module是否重名，另外添加完之后一定要更新文档，具体用法可参看src/common/api/common.ts中的postConfigCustomField的相关备注
```