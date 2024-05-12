# 动态属性限制字段说明 `restriction`与`templateRestriction`一致

### 输入框 input
```
controlType = 3
templateRestriction = {
  placeholder: string; // 默认提示语
  min: number; // 最小字数限制
  max: number; // 最大字数限制
}
```

### 文本框 textarea
```
controlType = 4
templateRestriction = {
  placeholder: string; // 默认提示语
  min: number; // 最小字数限制
  max: number; // 最大字数限制
}
```

### 多选框 checkbox
```
controlType = 2
templateRestriction = {
  min: number; // 最少选择限制
  max: number; // 最大选择限制
}
```

### 文件上传 upload
```
controlType = 5
templateRestriction = {
  accept: string; // 支持文件的格式
  maxCount: number; // 限制文件个数
  size: number; // 单个文件大小限制
}
```

### 数字输入框 input number
```
controlType = 7
templateRestriction = {
  placeholder: string; // 默认提示语
  decimals: number; // 小数点位数
  range: {
    minValue: number; // 最小值
    maxValue: number; // 最大值
  } // 输入范围
}
```
