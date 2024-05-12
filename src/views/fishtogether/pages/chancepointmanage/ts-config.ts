export interface MockDemo {
  a: Function;
}

export interface ImportModalValuesProps {
  visible: boolean;
  id?: number; // 机会点id
}

export interface ImportModalProps {
  importInfo: ImportModalValuesProps;
  setImportInfo: Function;
}
