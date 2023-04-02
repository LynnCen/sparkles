import { VersionLog } from "./service";

export interface ItemType {
  id: string;
  lang: string;
  download_url: string,
  is_forced: number,
  logs: VersionLog[],
  version?: string;
  status?: number;
  type?: number;
  create_time: number;
}


interface LogType {
  title: string;
  log: string[];
}

export interface ItemParamsType {
  page?: number;
  row?: number;
}

interface LogType {
  title: string,
  log: string[]
}

export interface VersionInfo {
  _id: string,
  log_url: string,
  android_url: string ,
  ios_log: LogType[],
  android_log: LogType[],
  ios_forced: number,
  android_forced: number,
  ios_audit: number,
  android_audit: number,
  lang: string,
  version: string,
  type: number,
  apk: string,
  status: number,
  ver: number,
  utime: number,
  itime: number
} 

export type UpdateVersionInfo = Omit<VersionInfo, 'ios_audit' | 'android_audit'>   



