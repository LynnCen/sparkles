export function findMaxItemByValue(items) {
  // 确保数组不为空
  if (items.length === 0) {
    return null;
  }

  // 使用 reduce 方法找到 value 最大的项
  return items.reduce((max, item) => {
    return item.value > max.value ? item : max;
  }, items[0]); // 初始值为数组的第一项
}
