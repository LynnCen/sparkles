export interface DynamicRatioValue {
  name: string;
  label: string;
  propertyId: string;
  propertyOptionList: any;
}

export interface DynamicRatioProps {
  value: DynamicRatioValue;
  onChange?: (value: DynamicRatioValue) => void;
}

// export interface DynamicRadioValue {
//   name: string;
//   label: string;
//   propertyId: string;
//   propertyOptionList: any;
//   restriction:any
// }

// export interface DynamicRadioProps {
//   value?: DynamicRadioValue;
//   onChange?: (value: DynamicRadioValue) => void;
//   prop: any;
// }

export interface DynamicUploadProps {
  value?: any;
  onChange?: (value: any) => void;
  restriction: any;
}

export interface ChannelDescModalInfo {
  id?: number;
  visible: boolean;
}

export interface ChannelDescModalProps {
  channelDescModalInfo: ChannelDescModalInfo;
  setChannelDescModalInfo: Function;
  data: any;
  onChange: Function;
}

export interface FloorInfoModalInfo {
  id?: number;
  visible: boolean;
}

export interface FloorInfoModalProps {
  floorInfoModalInfo: FloorInfoModalInfo;
  setFloorInfoModalInfo: Function;
  data: any;
  onChange: Function;
}

export interface FloorDescModalInfo {
  id?: number;
  fileList?: any;
  visible: boolean;
}

export interface FloorDescModalProps {
  floorDescModalInfo: FloorDescModalInfo;
  setFloorDescModalInfo: Function;
  data: any;
  onChange: Function;
}

export interface HistoryPriceModalInfo {
  id?: number;
  time?: any;
  visible: boolean;
}

export interface HistoryPriceModalProps {
  historyPriceModalInfo: HistoryPriceModalInfo;
  setHistoryPriceModalInfo: Function;
  data: any;
  setData:Function;
  onChange: Function;
}
