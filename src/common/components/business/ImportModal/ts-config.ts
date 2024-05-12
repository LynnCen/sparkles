import { ReactNode } from 'react';

export interface ImportModalProps{
  visible:boolean,
  closeHandle:()=>void,
  onSuccess?:()=>void,
  importFile?:(obj:any)=>void,
  title:string,
  fileName:string,
  extraParams?:any,
  maxCount?:number,
  size?:number,
  children?:ReactNode,
  importCheck?:any,
  customFunc?:any,
  accept?:string,
  tips?: ReactNode
  url?:any;
}
