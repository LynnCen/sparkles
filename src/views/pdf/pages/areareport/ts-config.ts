

// pdf渲染时的分组模块
// export enum ModuleName {
//   MODULE_1 = 1, // 封面 + 整体评价
//   MODULE_2, // 机会点
//   MODULE_3, // 人口客群 + 经营门店
//   MODULE_4, // 周边配套
//   MODULE_5, // 尾页
// }

export enum AreaReportModule {
  MODULE_1 = 1, // 除了周边配套 + 尾页的其他页面
  MODULE_2 = 2 // 周边配套 + 尾页
}

export const ChildreClass = 'business-item-pdf';
export const ARE_AREPORT_CONTAINER_CLASS = 'business-area-pdf';


type PromiseFulfilledResult<T> = {
  status: 'fulfilled';
  value: T;
};

type PromiseRejectedResult = {
  status: 'rejected';
  reason: any;
};

type PromiseResult<T> = PromiseFulfilledResult<T> | PromiseRejectedResult;

// 判断一个对象中的属性是否为undefined或者''
function verifyAreEmpty(obj: Record<string, any>): boolean {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (obj[key] !== undefined && obj[key] !== '') {
        return false;
      }
    }
  }
  return true;
}
// 处理人口客群数据
export const transformDemographicBase = (demographicDetail) => {
  // 客群数据
  const userGroup = {
    description: demographicDetail?.populationIntroduction,
    sexRate: demographicDetail?.sexRate,
    ageRate: demographicDetail?.ageRate
  };
    // 消费数据
  const consumer = {
    description: demographicDetail?.consumptionIntroduction,
  };
  demographicDetail?.distributions?.forEach((item) => {
    if (item.type === '学历') {
      userGroup['educational'] = item.parts.map((part) => ({ name: part.name, value: part.rate }));
    } else if (item.type === '消费水平') {
      consumer['consumeLevel'] = item.parts.map((part) => ({ name: part.name, value: part.rate }));
      // const maxDigit = findMaxItemByValue(consumer['consumeLevel']);
      //   consumer.description! += `客群画像中${maxDigit.name}消费水平最高，`;
    } else if (item.type === '餐饮消费水平') {
      consumer['foodConsumeLevel'] = item.parts.map((part) => ({ name: part.name, value: part.rate }));
      // const maxDigit = findMaxItemByValue(consumer['foodConsumeLevel']);
      //   consumer.description! += `餐饮消费${maxDigit.name}占比最高为${maxDigit.value}，`;
    } else if (item.type === '居住社区房价等级') {
      consumer['housePrice'] = item.parts.map((part) => ({ name: part.name, value: part.rate }));
      // const maxDigit = findMaxItemByValue(consumer['housePrice']);
      //   consumer.description! += `房价${maxDigit.name}的占比最高。`;
    }
  });
  const isEmptyUserGroup = verifyAreEmpty(userGroup);
  const isEmptyConsumer = verifyAreEmpty(consumer);

  Reflect.set(userGroup, 'isShowPage', !isEmptyUserGroup);
  Reflect.set(consumer, 'isShowPage', !isEmptyConsumer);
  return {
    isShowModule: !isEmptyUserGroup || !isEmptyConsumer,
    userGroup,
    consumer
  };
};

// 处理经营门店数据
export const transformOperateAStore = (detail, oldStoreDetail) => {
  const termBusinessList = (detail?.businessDistributions as []).find((item:any) => item.tenantIndustryFlag) || {};
  const oldStoreDetailData = {
    oldStoreDetail,
    isShowPage: oldStoreDetail?.pois.length > 0
  };
  const operateAStoreChartData = {
    isBusiness: detail.resourceMallFlag,
    description: detail?.businessDistributionsIntroPDF || '-',
    stockBusinessList: detail?.businessDistributions || [],
    foodTermBusinessList: termBusinessList
    // 原有逻辑
    // (termBusinessList && termBusinessList[0]) || {}
  };
  const isEmptyStoreChartData = verifyAreEmpty(operateAStoreChartData);
  const isEmptyoldStoreDetail = verifyAreEmpty(oldStoreDetailData);

  Reflect.set(operateAStoreChartData, 'isShowPage', !isEmptyStoreChartData);
  return {
    isShowModule: !isEmptyStoreChartData || !isEmptyoldStoreDetail,
    operateAStoreChartData,
    oldStoreDetail: oldStoreDetailData
  };
};

// 处理周配套数据
export const transormSurround = (detail, surroundPageDetail) => {
  const surroundingInfo = detail?.surroundingInfoVO ?? {};
  const isEmptySurroundingInfo = verifyAreEmpty(surroundingInfo);
  Reflect.set(surroundingInfo, 'isShowPage', !isEmptySurroundingInfo);
  return {
    isShowModule: !isEmptySurroundingInfo || surroundPageDetail?.length > 0,
    surroundingInfo,
    surroundMapPageDetail: surroundPageDetail
  };
};

// 换下位置
export const checkSettled = <T>(result: PromiseResult<T>): T | false => {
  if (result.status === 'fulfilled') return result.value;
  return false;
};
