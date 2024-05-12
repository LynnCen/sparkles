import * as React from 'react';
import { DictionaryListItem, DictionaryData } from './ts-config';

const DictionaryDataContext = React.createContext<Array<DictionaryListItem>>([]);

export const DictionaryDataContextProvider: React.FC<DictionaryData> = ({ children, dictionaryData }) => (
  // 一个 React 组件可以订阅 context 的变更
  <DictionaryDataContext.Consumer>
    {defaultData => (
      <DictionaryDataContext.Provider value={dictionaryData || defaultData}>{children}</DictionaryDataContext.Provider>
    )}
  </DictionaryDataContext.Consumer>
);

export default DictionaryDataContext;
