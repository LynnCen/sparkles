export interface menuData {
  title: string;
  path: string;
  subData: {
    subtitle: string;
    subPath: string;
    depData?: {
      subtitle: string;
      subPath: string;
    }[];
  }[];
}
export interface Store {
  headerKey: number;
  menuData: Array<menuData>;
}
export interface Search {
  searchState: boolean;
  searchItemData: { subtitle: string; subPath: string }[];
}
export interface headerData {
  title: string;
  path: string;
  key: number;
  menuData?: Array<menuData>;
}
