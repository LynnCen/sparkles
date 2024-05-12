import { configureStore } from '@reduxjs/toolkit';
import common from './common';
const pageList: any = process.env.PAGE_LIST;
const storeMap: {[p: string]: any} = {};
if (pageList && pageList.length) {
  pageList.forEach((page: any) => {
    const relativePath = page.relativePath.split('/pages/');
    const currentStoreConfig = require(`../views/${relativePath[0]}/store/index.ts`).default;
    storeMap[relativePath[0]] = currentStoreConfig;
  });
}

// 合并多个值
export default configureStore({
  reducer: {
    common,
    ...storeMap
  },
});
