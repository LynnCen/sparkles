# location目录说明
### 该目录下存放的是配置租户前台（console-pc项目）的相关页面

# 动态表头module命名规则

```
1. https://yapi.lanhanba.com/project/378/interface/api/46017
2. 命名规则：命名规则 loc + SAAS + 路由path(/为分隔符，首字母大写)，如果当前页有多个Table时，可拼接具体的Table名
例如当前路由：location/tenantdetail，该页面下有Tabs，每个Tabs下都有Table
当tab为企点账号时，module命名为：locSAASLocationTenantdetailPoints
3. 确定module之后，一定要在文档上确认是否是重复的key，如无重复，添加该module至文档
```