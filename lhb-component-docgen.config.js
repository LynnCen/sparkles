// 默认配置信息
const CONFIG = {
  outputDir: 'src/views/demo', // 生成的组件文档路径
  componentFolderPath: 'src/common/components', // 公共组件文件夹路径

  exampleTemplatePath: 'tpl/component.example.template.tsx', // 示例文件模板，用于加载示例组件、组件 API 信息
  exampleGeneratePath: 'src/views/demo/pages', // 生成的组件示例文件夹

  // entryTemplatePath: 'tpl/component.entry.template.tsx', // 入口文件模板，用来加载示例文件的目录
  // entryGeneratePath: '.temp/index/entry.tsx', // 生成的组件示例入口文件路径，主要是导航和父级路由，为空则不生成
  entryGeneratePath: null,

  entryConfigTemplateJsPath: 'tpl/component-entry-config.template.js', // 入口配置信息，存储组件入口配置信息文件，包括 组件名称、分类、路由
  entryConfigJsGeneratePath: 'src/layout/componentMenuConfig.ts', // 生成的入口配置信息文件路径，为空则不生成

  /* 独立展示的自定义文档文件，可以用于展示开发简介、说明文档或者集中展示多个组件等，如
    {
      displayName: 'Text 相关组件', // 文档名称
      path: 'src/common/components/Form/FormDemo/index.tsx', // demo 文件路径
      category: 'Basic', // 分类
    }
   */
  customDocList: [
    {
      displayName: '主页', // 文档名称
      path: '/demo/index', // 路由地址
      exampleName: 'Index/entry.tsx', // 生成的文档文件地址
      demoPath: 'src/common/components/Index/index.tsx', // demo 文件路径
      category: 'Introduce', // 分类
    },
    // {
    //   displayName: '开发简介', // 文档名称
    //   path: '/demo/standard', // 路由地址
    //   exampleName: 'Standard/entry.tsx', // 生成的文档文件地址
    //   demoPath: 'test/src/views/demo/pages/standard/entry.tsx', // demo 文件路径
    //   category: 'Introduce', // 分类
    // },
    {
      displayName: 'Form 组件合集', // 文档名称
      path: '/demo/form', // 路由地址
      exampleName: 'Form/entry.tsx', // 生成的文档文件地址
      demoPath: 'src/common/components/Demo/Form/index.tsx',
      category: 'Form', // 分类
    },
  ],
  // 包含的文件
  aimPathList: [
    // Basic
    'src/common/components/Empty/index.tsx',
    'src/common/components/Base/IconFont/index.tsx',

    // Text
    'src/common/components/Text/ColorText.tsx',
    'src/common/components/Text/CopyTextIcon.tsx',

    // Detail

    // Data

    // Notice

  ],
  // 应该排除 /(FormSelect)?Demo.tsx 组件
  excludeList: [
    /\/(((?!\/).)*)?Demo\.tsx/,
  ], // 排除掉的文件
  // 组件分类
  DEFAULT_CATEGORY: 'Other', // 默认类目
  compList: [
    'Index',
    'Introduce',
    'Test',
    'Basic',
    'Detail',
    'Data',
    'Navigation',
    'Text',
    'Wrapper',
    'Notice',
    'Date',
    'Select',
    'Form',
    'Other',
  ],

};

// 默认配置
module.exports = CONFIG;
