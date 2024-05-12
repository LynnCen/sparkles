// 组件入口配置信息文件

// 组件文档信息
const componentDocs = [
  {
    "comName": "Empty",
    "displayName": "空状态",
    "path": "/demo/empty-index",
    "exampleName": "empty-index.tsx",
    "category": "Basic"
  },
  {
    "comName": "ColorText",
    "displayName": "颜色图标文本",
    "path": "/demo/text-color-text",
    "exampleName": "text-color-text.tsx",
    "category": "Text"
  },
  {
    "comName": "CopyTextIcon",
    "displayName": "复制文本图标",
    "path": "/demo/text-copy-text-icon",
    "exampleName": "text-copy-text-icon.tsx",
    "category": "Text"
  },
  {
    "comName": null,
    "displayName": "主页",
    "path": "/demo/index",
    "exampleName": "custom-doc/index/entry.tsx",
    "category": "Introduce"
  },
  {
    "comName": null,
    "displayName": "Form 组件合集",
    "path": "/demo/form",
    "exampleName": "custom-doc/form/entry.tsx",
    "category": "Form"
  }
];

// 组件路由信息
const routes = [
  {
    "path": "/demo/empty-index",
    "meta": {
      "name": "demo-空状态",
      "title": "Empty 空状态",
      "isComponentDoc": true,
      "category": "Basic",
      "seq": "3.0"
    }
  },
  {
    "path": "/demo/text-color-text",
    "meta": {
      "name": "demo-颜色图标文本",
      "title": "ColorText 颜色图标文本",
      "isComponentDoc": true,
      "category": "Text",
      "seq": "7.1"
    }
  },
  {
    "path": "/demo/text-copy-text-icon",
    "meta": {
      "name": "demo-复制文本图标",
      "title": "CopyTextIcon 复制文本图标",
      "isComponentDoc": true,
      "category": "Text",
      "seq": "7.2"
    }
  },
  {
    "path": "/demo/index",
    "meta": {
      "name": "demo-主页",
      "title": "主页",
      "isComponentDoc": true,
      "category": "Introduce",
      "seq": "1.3"
    }
  },
  {
    "path": "/demo/form",
    "meta": {
      "name": "demo-Form 组件合集",
      "title": "Form 组件合集",
      "isComponentDoc": true,
      "category": "Form",
      "seq": "12.4"
    }
  }
];

// 组件文档导航信息
const componentDocsMenu = [
  {
    "name": "Introduce",
    "path": "/demo-category/introduce",
    "children": [
      {
        "name": "主页",
        "path": "/demo/index",
        "category": "Introduce",
        "seq": "1.3"
      }
    ],
    "seq": 1
  },
  {
    "name": "Basic",
    "path": "/demo-category/basic",
    "children": [
      {
        "name": "Empty 空状态",
        "path": "/demo/empty-index",
        "category": "Basic",
        "seq": "3.0"
      }
    ],
    "seq": 3
  },
  {
    "name": "Text",
    "path": "/demo-category/text",
    "children": [
      {
        "name": "ColorText 颜色图标文本",
        "path": "/demo/text-color-text",
        "category": "Text",
        "seq": "7.1"
      },
      {
        "name": "CopyTextIcon 复制文本图标",
        "path": "/demo/text-copy-text-icon",
        "category": "Text",
        "seq": "7.2"
      }
    ],
    "seq": 7
  },
  {
    "name": "Form",
    "path": "/demo-category/form",
    "children": [
      {
        "name": "Form 组件合集",
        "path": "/demo/form",
        "category": "Form",
        "seq": "12.4"
      }
    ],
    "seq": 12
  }
];

export { componentDocs, routes, componentDocsMenu };