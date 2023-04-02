import {ServiceMsg, ServicePageList} from "./BaseModel";

// export interface MonitorPageListMsg extends ServiceMsg<MonitorPageList> {
//
// }
//
// export interface MonitorPageList extends ServicePageList<PassagewayModel> {
//
// }

// export interface MonitorModel {
//   id?: number;
//   name: string;
//   cameraType: number;
//   gpsX: number;
//   gpsY: number;
// }

export interface MonitorTreeModel extends ServiceMsg<MonitorData> {

}

export interface MonitorData {
  organizationList: OrganizationModel[];
  equVoList: CountList;
}

export interface CountList {
  count: number;
  list: EquVoModel[];
}

export interface OrganizationModel {
  id: number;
  nodeType: number;
  oid: string;
  name: string;
  icon: string;
  orgType: string;
  isParent: true,
  parentId: string;
  orgCode: string;
  sort: number;
  orgSn: string;
  sn: string;
  domainId: number;
}

export interface EquVoModel {
  equipment: EquipmentModel;
  passagewayList: PassagewayModel[];
}

export interface EquipmentModel {
  id: number;
  nodeType: number;
  eid: string;
  name: string;
  icon: string;
  online: string;
  isParent: true,
  parentId: string;
  orgCode: string;
  orgType: null,
  sort: number;
  category: string;
  deviceId: string;
  intelFlag: number;
  manufacturer: string;
  subType: string;
  ip: string;
}

export interface PassagewayModel {
  id: number;
  nodeType: number;
  pid: string;
  channeLLd: string;
  name: string;
  icon: string;
  orgCode: string;
  orgType: string;
  online: string;
  status: number;
  sort: number;
  cameraType: string;
  cameraFunctions: string;
  isParent: false,
  parentId: null,
  deviceCode: string;
  channelSeq: number;
  channelType: string;
  gpsX: number;
  gpsY: number;
  unitType: string;
  paasId: string;
  intelState: number;
}

// 录像响应内容
export interface recordListModel {
  channelSeq: number,
  playbackType: number,
  records: records[]
}

export interface records {
  location: string,
  file: string,
  beginTime: string,
  endTime: string,
  recordType: string,
  recordSubType: string,
  videoStream: string,
  size: number,
  locked: boolean
}
