# 带查询功能的结构树

### 基础用法
```js
<SearchTree
  onSelect={(_, { node }) => {
    setSelectedItem(node);
  }}
  treeRef={treeRef}
  btnConfig={{
    btnText: '新增类目',
    btnClick: onAddBtnClick }}/>
```

### SearchTree props
| name       | 说明              | 类型     | 默认值 |
| ---------- | ----------------- | ---------- | ------ |
| data    | 原始数据 | -        | -     |
| onDelete | 删除icon的触发事件 | function(target) | -  |
| inputConfig | 输入框参数合集 | { placeholder: string } | { placeholder: '搜索' }  |
| btnConfig | 按钮参数合集 | { btnText: string, btnClick: function(event) } | { btnText: '新增' }  |
| fieldNames | 自定义节点 title、key、children 的字段 | object | { title: 'title', key: 'key', children: 'children' }  |

### 特殊情况用法

#### 1、对title进行改造
