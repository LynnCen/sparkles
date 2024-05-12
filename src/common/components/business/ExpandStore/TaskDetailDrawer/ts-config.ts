/** 地址区域对象类型 */
export interface AddressType {
  provinceId: number
  provinceName: string
  cityId: number
  cityName: string
  districtId: number
  districtName: string
}

/** 地址区域对象处理 */
export function shortAddressName(address: AddressType): string {
  if (!address) return '-';

  const { provinceName, cityName, districtName } = address;
  let formattedAddress = '';

  if (provinceName) {
    formattedAddress += provinceName;
  }

  if (cityName && cityName !== provinceName) {
    formattedAddress += ` - ${cityName}`;
  }

  if (districtName && districtName !== cityName) {
    formattedAddress += ` - ${districtName}`;
  }

  return formattedAddress;
}

// 任务状态 status(1:进行中 2:已完成 3:已变更 4:已关闭)
export enum TaskStatus {
  WaitAssign = 10, // 待指派
  Processing = 20, // 进行中
  Changed = 30, // 已变更
  Complete = 40, // 已完成
  Closed = 50, // 已关闭
}

/** 任务状态颜色值 */
export const TaskStatusColor = {
  [TaskStatus.WaitAssign]: {
    background: 'rgba(146,165,202,0.07)',
    color: '#222222',
  },
  [TaskStatus.Processing]: {
    background: 'rgba(255, 134, 29, 0.06)',
    color: '#FF861D'
  },
  [TaskStatus.Changed]: {
    background: 'rgba(245, 63, 63, 0.08)',
    color: '#F53F3F',
  },
  [TaskStatus.Complete]: {
    background: 'rgba(0, 153, 99, 0.06)',
    color: '#009963',
  },
  [TaskStatus.Closed]: {
    background: 'rgba(146, 165, 202, 0.07)',
    color: '#7886A1',
  },
};

// 机会点状态
export enum ChanceStatus {
  // Draft = 0, // 草稿
  WaitApprove = 100, // 代审批（待匹配）
  Approving = 200, // 审批中
  Pass = 300, // 通过
  Reject = 400, // 未通过
  WaitReport = 500, // 待提报
  Estimating = 600, // 评估中
  Estimated = 700, // 评估通过
  EstimateFail = 800, // 评估未通过
  Signing = 900, // 签约中
  Complete = 1000, // 已落位
  Close = 1100, // 已关闭
}
/** 机会点状态颜色值 */
export const ChancePointStatusColor = {
  [ChanceStatus.WaitApprove]: '#222222',
  [ChanceStatus.Approving]: '#FF861D',
  [ChanceStatus.Pass]: '#009963',
  [ChanceStatus.Reject]: '#F53F3F',
  [ChanceStatus.WaitReport]: '#222222',
  [ChanceStatus.Estimating]: '#FF861D',
  [ChanceStatus.Estimated]: '#009963',
  [ChanceStatus.EstimateFail]: '#F53F3F',
  [ChanceStatus.Signing]: '#FF861D',
  [ChanceStatus.Complete]: '#009963',
  [ChanceStatus.Close]: '#999999',
};
