import React from "react";

interface contextProps {
  store: {
    headerKey: number;
    menuData: {
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
    }[];
  };
  searchStore: {
    searchState: boolean;
    searchItemData: { subtitle: string; subPath: string }[];
  };
  setSearchStore: ({}) => void;

  setStore: ({}) => void;

  [k: string]: any;
}
const defaultContext: contextProps = {
  defaultActiveKey: ["1"],
  store: {
    headerKey: 4,
    menuData: [],
  },
  setStore: () => void 0,
  searchStore: {
    searchState: false,
    searchItemData: [],
  },
  setSearchStore: ({}) => void 0,
};
const Store = React.createContext(defaultContext);
export default Store;
