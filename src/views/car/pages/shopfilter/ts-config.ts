export interface MockDemo {
  a: Function;
}
export interface TargetChild {
  metaCode: string,
  metaType: string,
  metaTypeCode: string,
  nameCh: string,
  nameEng: string | null,
  lbsDataType?: number
  label?: string,
  value?: number,
}
export interface Target {
  metaType: string,
  metaTypeCode: string,
  children: Array<TargetChild>
}
