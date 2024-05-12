/**
 * @Description 地图相关的context，用来跨组件通信
 * 目前的使用场景：
 * 1、工具箱在标记/测距等需要在地图上触发点击事件时和地图上的Marker、地图自身等点击事件冲突的解决方案，通过标记当前工具箱的操作，地图上的点击事件有选择的进行触发
 */
import * as React from 'react';

/**
 * 用法：
 * import { useContext } from 'react';
 * import MapHelpfulContext from '@/common/components/AMap/MapHelpfulContext';
 * const helpfulContext: Record<string, any> = useContext(MapHelpfulContext);
 */

const MapHelpfulContext = React.createContext<any>({});

export const MapHelpfulContextProvider: React.FC<{ helpInfo: any, stateEvent: Function }> = ({
  children,
  helpInfo,
  stateEvent
}) => (

  // 一个 React 组件可以订阅 context 的变更
  <MapHelpfulContext.Consumer>
    {() => (
      <MapHelpfulContext.Provider value={{
        stateData: helpInfo,
        stateEvent: stateEvent
      }}>{children}</MapHelpfulContext.Provider>
    )}
  </MapHelpfulContext.Consumer>
);

export default MapHelpfulContext;
