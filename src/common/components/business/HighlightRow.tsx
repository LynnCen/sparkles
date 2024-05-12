/**
 * @Description 业务场景：搜索时的高亮展示
 */
import { FC, Fragment } from 'react';
// import { Tooltip } from 'antd';
import cs from 'classnames';

const HighlightRow: FC<any> = ({
  text, // 展示行内容
  keywords, // 关键词
  className = '', // 容器的className
  wrapperStyle = {}, // 容器的style样式
  highlightClassName = 'c-006', // 高亮的关键词className
  highlightStyle = {}, // 高亮的关键词style
}) => {

  const prominentStr = (str: string) => { // 高亮显示
    if (keywords) {
      const matchedText = str.indexOf(keywords) > -1 ? keywords : '';
      const words = str.split(keywords);

      return <div
        className={className}
        style={wrapperStyle}>
        {
          words.map((itm: any, index: number) => <Fragment key={index}>
            {
              index === words.length - 1 ? <span>{itm}</span> : <>
                <span>{itm}</span>
                <span
                  className={highlightClassName}
                  style={highlightStyle}
                >
                  {matchedText}
                </span>
              </>
            }
          </Fragment>
          )
        }
        {/* <span>{pre}</span>
        <span
          className={highlightClassName}
          style={highlightStyle}>
          {cur}
        </span>
        <span>{after}</span> */}
      </div>;
    }
    return str;
  };

  return (
    <div className={cs('c-222 fs-14')} title={text}>
      {prominentStr(text)}
    </div>
  );
};

export default HighlightRow;
