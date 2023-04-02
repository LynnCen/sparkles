/*
  var data = [
    { province: '四川', city: '成都', district: '高新区' },
    { province: '四川', city: '成都', district: '天赋' },
    { province: '江苏', city: '南京', district: '鼓楼' },
    { province: '江苏', city: '南京', district: '玄武' },
    { province: '江苏', city: '镇江', district: '京口' },
  ];

  var data2 = [
    { name: 'name1', a: 'a1', b: 'b1', c: 'c1', d: 'd1', e: 'e1', f: 'f1' },
    { name: 'name2', a: 'a2', b: 'b2', c: 'c2', d: 'd2', e: 'e2', f: 'f2' },
    { name: 'name2', a: 'a3', b: 'b3', c: 'c3', d: 'd3', e: 'e3', f: 'f3' },
  ];

  console.log(list2tree(data, 'province/city/district'));
  console.log(list2tree(data2, 'a/b/c'));

  =============algorithm for ant cd======================

 */
function getAllSame(arr, key) {
  const res = new Set((arr || []).map((item) => item[key]));
  return Array.from(res);
}

function getChildrenByKey(data, searchKey) {
  const currentKeys = getAllSame(data, searchKey[0]);
  if (!searchKey.length) return data;
  return currentKeys.map((key) => {
    const newData = data.filter((item1) => item1[searchKey[0]] === key);
    return {
      level: searchKey[0],
      name: key,
      children: getChildrenByKey(
        newData.map((item) => {
          const newItem = { ...item };
          delete newItem[searchKey[0]];
          return newItem;
        }),
        searchKey.slice(1),
      ),
    };
  });
}

function list2tree(arr = [], path = '') {
  const pathArr = path.split('/');
  if (!arr.length || !pathArr.length) return { id: 'root', name: 'root' };
  const struct = getChildrenByKey(arr, pathArr);
  return {
    id: 'root',
    name: 'root',
    children: struct,
  };
}

export default list2tree;
