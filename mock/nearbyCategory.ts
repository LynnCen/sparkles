// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';
import { parse } from 'url';
import { NearbyCategoryType, NearbyCategoryParams } from '@/pages/NearbyCategory/data';

// mock tableListDataSource
const genList = (current: number, pageSize: number) => {
  const tableListDataSource: NearbyCategoryType[] = [];

  for (let i = 0; i < pageSize; i += 1) {
    const index = (current - 1) * 10 + i;

    tableListDataSource.push({
      itime: 1577676176,
      lang: 'global',
      name: 'Gıda',
      region: 'global',
      reorder: 1,
      status: 1,
      thumb: 'https://static.tmmtmm.com.tr/discover/category/202012/04/5fc9d2139eb45.jpg',
      _id: String(index),
    });
  }
  tableListDataSource.reverse();
  return tableListDataSource;
};

let tableListDataSource = genList(1, 100);

function getCategories(req: Request, res: Response, u: string) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }
  const { current = 1, pageSize = 10 } = req.query;
  const params = (parse(realUrl, true).query as unknown) as NearbyCategoryParams;

  const dataSource = [...tableListDataSource].slice(
    ((current as number) - 1) * (pageSize as number),
    (current as number) * (pageSize as number),
  );

  const result = {
    data: dataSource,
    total: tableListDataSource.length,
    success: true,
    pageSize,
    current: parseInt(`${params.current}`, 10) || 1,
  };

  return res.json(result);
}

function postCategory(req: Request, res: Response, u: string, b: Request) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }

  const body = (b && b.body) || req.body;
  const { method, name, _id, region, status, reorder, type } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      // eslint-disable-next-line no-underscore-dangle
      tableListDataSource = tableListDataSource.filter((item) => _id.indexOf(item._id) === -1);
      break;
    case 'post':
      (() => {
        const newRule = {
          _id: String(tableListDataSource.length + 1),
          name,
          region,
          itime: Date.now() / 1000,
          status: status || 0,
          type: type || 0,
          lang: 'en',
          thumb: 'https://static.tmmtmm.com.tr/discover/category/202012/04/5fc9d2139eb45.jpg',
          reorder,
        };
        tableListDataSource.unshift(newRule);
        return res.json(newRule);
      })();
      return;

    case 'update':
      (() => {
        let newRule = {};
        tableListDataSource = tableListDataSource.map((item) => {
          // eslint-disable-next-line no-underscore-dangle
          if (item._id === _id) {
            newRule = { ...item, name, _id, region, status, reorder, type };
            return { ...item, name, _id, region, status, reorder, type };
          }
          return item;
        });
        return res.json(newRule);
      })();
      return;
    default:
      break;
  }

  const result = {
    list: tableListDataSource,
    pagination: {
      total: tableListDataSource.length,
    },
  };

  res.json(result);
}

export default {
  'GET /api/nearby_cate': getCategories,
  'POST /api/nearby_cate': postCategory,
};
