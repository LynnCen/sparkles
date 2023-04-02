/*
 ** 获取权限中已选择的节点权限
 */

function filterAllSelected(arr: any[], acc = []) {
  arr.forEach((node) => {
    if (node.children) {
      filterAllSelected(node.children, acc);
    }
    if (node.is_select) {
      // @ts-ignore
      acc.push(node.key);
    }
  });
  return acc;
}

/*
 ** {key1: value1, key1: value2} => {key1: [value1, value2]}
 */
function identify<R>(x: R) {
  return x;
}

function collectionOfSameKey(arr: Record<string, string>[]): Record<string, number[]> {
  const allKeys: string[] = Array.from(new Set(arr.map((item) => Object.keys(item)[0])));

  const accum: Record<string, number[]>[] = allKeys.map((item) => ({ [item]: [] }));
  const resArr = arr.reduce((acc, cur) => {
    const curKey: string = Object.keys(cur)[0];
    return acc.map((item) => {
      if (Object.keys(item)[0] === curKey) {
        return { [curKey]: item[curKey].concat(Number(cur[curKey])).filter(identify) };
      }
      return { ...item };
    });
  }, accum);

  return resArr
    .filter((access) => access[Object.keys(access)[0]].length)
    .reduce((acc, cur) => ({ ...acc, ...cur }), {});
}

/*
 ** 将后端权限数据转化成antd/Tree组件的treeData格式array<{key, title, children, [disabled, selectable]}>
 */

// @ts-ignore
function convert(arr: any[], parentKey?: string) {
  const childrenKey = 'permission';
  const titleKey = 'name';
  
  return arr.map((data) => {
    // data = {...data, checkable: false}
    
    if (data.children && data.children.length > 0) {
      return {
        ...data,
        children: convert(data.children, data.key),
        title: data[titleKey] || data.label || data.name,
      };
    }

    if (
      (data[childrenKey] && data[childrenKey].length > 0)
    ) {
      return {
        ...data,
        children: convert(data[childrenKey], data.key),
        title: data[titleKey] || data.label || data.name,
      };
    }

    return {
      ...data,
      title: data[titleKey] || data.label || data.name,
      key: data.key || `${parentKey}-${data.value}`,
    };
  });  
}

function generateAuthList(checkedKeysValue: string[]) {

  const formVal: Record<string, string>[] = checkedKeysValue.map((checked: string) => {
    const arr = checked.split('-');
    return { [arr[0]]: arr[1] };
  });

  return collectionOfSameKey(formVal);
}

function getAllAuths(arr: any[], acc = []) {
  
 for(const node of arr) {
    if (node.children) {
      getAllAuths(node.children, acc);
    }
    // @ts-ignore
    acc.push(node.key);
  };
  return acc;
}

export { filterAllSelected, collectionOfSameKey, convert, generateAuthList, getAllAuths };
