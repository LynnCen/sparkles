// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';
import { parse } from 'url';
import { ItemType, ItemParamsType } from '@/pages/NearbyProperty/data';

// mock tableListDataSource
const genList = (current: number, pageSize: number) => {
  const tableListDataSource: ItemType[] = [];

  for (let i = 0; i < pageSize; i += 1) {
    const index = (current - 1) * 10 + i;

    tableListDataSource.push({
      itime: 1607058715,
      name: 'Test sınıflandırması ',
      _id: index,
    });
  }
  tableListDataSource.reverse();
  return tableListDataSource;
};

let tableListDataSource = genList(1, 100);

function getList(req: Request, res: Response, u: string) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }
  const { current = 1, pageSize = 10 } = req.query;
  const params = (parse(realUrl, true).query as unknown) as ItemParamsType;

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

function postList(req: Request, res: Response, u: string, b: Request) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }

  const body = (b && b.body) || req.body;
  const { method, name, _id } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      // eslint-disable-next-line no-underscore-dangle
      tableListDataSource = tableListDataSource.filter((item) => _id.indexOf(item._id) === -1);
      break;
    case 'post':
      (() => {
        const newRule = {
          _id: tableListDataSource.length + 1,
          itime: Date.now() / 1000,
          name,
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
            newRule = { ...item, name };
            return { ...item, name };
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
  'GET /api/nearby_property': getList,
  'POST /api/nearby_property': postList,
};
