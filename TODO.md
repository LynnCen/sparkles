# 升级antd后部分组件的api更改
```
1. Dropdown 组件的提示：
warning.js:6 Warning: [antd: Dropdown] `overlay` is deprecated. Please use `menu` instead.

2. Tabs的用法变化：
Warning: [antd: Tabs] Tabs.TabPane is deprecated. Please use `items` directly. 
```

# 高德相关接口的api封装
```
1. 获取城市信息的接口封装，因为高德接口下直辖市、县级市不返回city值，统一处理后返回
```