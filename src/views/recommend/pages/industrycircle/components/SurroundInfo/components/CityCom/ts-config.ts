/**
 * @Description
 */

/**
 * @description 行政区板块内容
 * @param result
 * @return
 */
export const getDistrictBlock = (result) => [
  {
    name: '行政区名称',
    value: result?.districtName,
  },
  {
    name: '常住人口数',
    value: result?.population,
    unit: '万人',
  },
  {
    name: '常住人口全市占比',
    value: result?.populationRate,
    unit: '%',
  },
  {
    name: '行政区GDP',
    value: result?.gdp,
    unit: '亿元',
  },
  {
    name: '流动人口数',
    value: result?.flowPopulation,
    unit: '万人',
  },
  {
    name: '行政区住房均价',
    value: result?.avgHousePrice,
    unit: '元',
  },
];
