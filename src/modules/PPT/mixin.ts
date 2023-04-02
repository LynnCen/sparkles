import PlanService from "../../services/PlanService";
import { swap } from "../../utils/common";
import { warnHandler } from "../Modal/MarkerModal";

export type sortMenuParams = {
  type: number;
  fatherId: number;
  list: Array<any>;
  index: number;
  move: 1 | -1; // up | down
  reverse?: 1 | 0;
};
export function sortMenu({ type, fatherId, list, index, move, reverse = 0 }: sortMenuParams) {
  let j;
  if (!list[(j = index)].id || !list[(j = index - move)].id) {
    warnHandler(this, "请保存后再移动~");
    return Promise.reject(j);
  }
  return PlanService.SortMenu({
    type,
    move: move > 0 ? 1 - reverse : reverse,
    id: list[index].id,
    fatherId
  }).then(r => {
    if (r) {
      list[index] = list.splice(index - move, 1, list[index])[0];
      swap(list[index], list[index - move], "index");
      return list;
    } else return Promise.reject(false);
  });
}
export function method(...args) {
  return function(target) {
    if (args.length) {
      args.forEach(key => {
        exports[key] && Object.assign(target.prototype, { [key]: exports[key] });
      });
    }
  };
}
