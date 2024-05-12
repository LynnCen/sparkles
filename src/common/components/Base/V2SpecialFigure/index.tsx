import React from 'react';
import V2SuperEllipse from './components/V2SuperEllipse';
export interface V2SpecialFigureProps {
  /**
   * @description 图形类别，superEllipse：超椭圆
   */
  type?: string;
  /**
   * @description 图形的配置，不同type的图形配置略有不同，详细请查看下方文档 “图形配置”
   */
  graphConfig?: any;
}
/**
* @description 便捷文档地址
* @see https://reactpc.lanhanba.net/components/base/v2special-figure
*/
const V2SpecialFigure: React.FC<V2SpecialFigureProps> = ({
  type = 'superEllipse',
  graphConfig = {},
}) => {
  if (type === 'superEllipse') {
    return <V2SuperEllipse {...graphConfig}/>;
  }
  return <>参数错误</>;
};

export default V2SpecialFigure;
