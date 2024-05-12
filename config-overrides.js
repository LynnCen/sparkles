const { override, fixBabelImports, addWebpackAlias, overrideDevServer } = require('customize-cra');
const addLessLoader = require('customize-cra-less-loader');
const path = require('path');
const webpack = require('webpack');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
const paths = require('react-scripts/config/paths');
// 修改打包文件夹
paths.appBuild = path.join(path.dirname(paths.appBuild), 'dist');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
// 组装pagelist信息 start
const { pathJoin } = require('./libs/helpers/path');
const antdStyles = require('./libs/reset/antd-styles'); // 对antd进行定制化换肤
const glob = require('glob');
const projectPathRoot = process.cwd();
const viewPath = pathJoin(projectPathRoot, 'src/views');
const entryPath = pathJoin(viewPath, '**/entry.tsx');
const files = glob.sync(entryPath);
const isProd = process.env.NODE_ENV === 'production';

const pageList = files.map((file) => {
  const relativePath = file.slice(viewPath.length).slice(1, -10);
  return {
    relativePath,
  };
});
// 打包去除console
const dropConsole = () => {
  return (config) => {
    if (config.optimization.minimizer) {
      config.optimization.minimizer.forEach((minimizer) => {
        if (minimizer.constructor.name === 'TerserPlugin') {
          minimizer.options.minimizer.options.compress.drop_console = true;
        }
      });
    }
    return config;
  };
};

module.exports = {
  webpack: override(
    // 添加别名
    addWebpackAlias({
      '@': path.resolve(__dirname, 'src'),
      // 'react/jsx-runtime': 'react/jsx-runtime.js',
      // 'react/jsx-dev-runtime': 'react/jsx-dev-runtime.js',
    }),
    // antd按需加载
    fixBabelImports('import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: true, //自动打包相关的样式 默认为 style:'css'
    }),
    // 配置less/less-loader
    addLessLoader({
      cssLoaderOptions: {
        sourceMap: true,
        modules: {
          localIdentName: '[local]--[hash:base64:5]',
        },
      },
      lessLoaderOptions: {
        lessOptions: {
          modifyVars: {
            ...antdStyles
          },
          javascriptEnabled: true,
        },
        // 注入less变量
        additionalData: `
         @import "${path.join(__dirname, './src/common/styles/mixin.less')}";
          @import "${path.join(__dirname, './src/common/styles/var.less')}";`,
      },
    }),
    dropConsole(),
    (config) => {
      // CDN引入扩展包
      config.externals = {
        react: 'React',
        'react-dom': 'ReactDOM',
        'react-router-dom': 'ReactRouterDOM',
        'react-redux': 'ReactRedux',
      };
      // 添加plugins
      config.plugins = config.plugins.concat([
        // 添加process.env.PAGE_LIST
        new webpack.DefinePlugin({
          'process.env.PAGE_LIST': JSON.stringify(pageList),
          'process.env.KA_TPL_ID_PLACE':process.env.KA_TPL_ID_PLACE,
          'process.env.KA_TPL_ID_SPOT':process.env.KA_TPL_ID_SPOT,
          'process.env.KA_CATEGORY_ID_PLACE':process.env.KA_CATEGORY_ID_PLACE,
          'process.env.KA_CATEGORY_ID_SPOT':process.env.KA_CATEGORY_ID_SPOT,
          'process.env.NODE_TYPE':JSON.stringify(process.env.NODE_TYPE),
          'process.env.KUNLUN_URL':JSON.stringify(process.env.KUNLUN_URL),
          'process.env.RESOURCE_SERVICE_URL':JSON.stringify(process.env.RESOURCE_SERVICE_URL),
          'process.env.LHB_ADMIN_URL':JSON.stringify(process.env.LHB_ADMIN_URL),
          'process.env.SENTRY_DSN':JSON.stringify(process.env.SENTRY_DSN),
          'process.env.NODE_ENV':JSON.stringify(process.env.NODE_ENV),
          'process.env.IM_URL':JSON.stringify(process.env.IM_URL),
          'process.env.LOCXX_WAP_URL':JSON.stringify(process.env.LOCXX_WAP_URL),
          'process.env.LCN_WEB_URL':JSON.stringify(process.env.LCN_WEB_URL),
          'process.env.CRM_URL':JSON.stringify(process.env.CRM_URL),
        }),
        // 添加打包进度条
        new ProgressBarPlugin(),
        // antd dayjs替换moment以优化打包大小-日期组件使用方式不变
        new AntdDayjsWebpackPlugin(),
      ]);
      if (isProd) {
        // 预演、线上开启source-map
        if (process.env.NODE_TYPE === 'se' || process.env.NODE_TYPE === 'pe') {
          config.devtool = 'source-map';
        } else {
          config.devtool = false;
        }
        // https://stackoverflow.com/questions/51971857/mini-css-extract-plugin-warning-in-chunk-chunkname-mini-css-extract-plugin-con/67579319#67579319
        // https://github.com/webpack-contrib/mini-css-extract-plugin/issues/250#issuecomment-415345126
        const targetPlugin = config.plugins.find((pluginItem) => pluginItem.constructor.name === 'MiniCssExtractPlugin');
        targetPlugin && (targetPlugin.options.ignoreOrder = true);
      }
      return config;
    },
  ),
  devServer: overrideDevServer(config => {
    return {
      ...config,
      client: { // Uncaught runtime errors
        overlay: false
      }
    }
  })
};
