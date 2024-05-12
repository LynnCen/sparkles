// 颜色图标文本
import { FC } from 'react';
import Demo from 'src/common/components/Text/ColorTextDemo';

const Component:FC = () => {

  const isCustomPage: any = false; // 是否自定义文档页面，如果是，不展示组件模板内容
  const propComments: any = [{"name":"value","description":"文本","type":"string | number","defaultValue":"","required":false},{"name":"colorKey","description":"颜色表中的颜色键名，用来查找该值对应的颜色，默认使用 value","type":"string | number","defaultValue":"null","required":false},{"name":"colorMap","description":"颜色映射表，除了以下颜色外，其他需要自定义：primary/success/warning/danger/info/blue/green/orange/red/gray\n<br>\n可以传入颜色英文或者色值，如 #409EFF，rgb(64, 158, 255)","type":"Record<string, any>","defaultValue":"{}","required":false},{"name":"defaultColor","description":"默认颜色，除了以下颜色外，其他需要自定义：primary/success/warning/danger/info/blue/green/orange/red/gray\n<br>\n可以传入颜色英文或者色值，如 #409EFF，rgb(64, 158, 255)","type":"string","defaultValue":"","required":false},{"name":"dot","description":"是否显示圆点","type":"boolean","defaultValue":"true","required":false},{"name":"isTextColor","description":"文本是否显示颜色","type":"boolean","defaultValue":"false","required":false}];

  const filterDefaultValue = (str) => {
    if (typeof str === 'boolean' || typeof str === 'number') {
      return str;
    } else {
      return str || '--';
    }
  };

  return <div className='component-doc'>
    {isCustomPage ? <Demo/> : <>
      <div className='mb-10 fs-18'>ColorText 颜色图标文本</div>

      <h2>组件描述</h2>
      <pre className='mt-5'>状态文本左侧显示圆点图标，常用于状态显示。</pre>

      <h2>组件示例</h2>
      <Demo/>

      {Array.isArray(propComments) && propComments.length ? (<>
        <h2>API 信息</h2>
        <div className='api-block'>
          <table className='doc-table'>
            <thead>
              <tr>
                <td>参数</td>
                <td>说明</td>
                <td>类型</td>
                <td>默认值</td>
              </tr>
            </thead>
            <tbody>
              {propComments.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td dangerouslySetInnerHTML={{__html: item.description}}></td>
                  <td><code>{item.type}</code></td>
                  <td><code>{filterDefaultValue(item.defaultValue)}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>) : null}
    </>}
  </div>;
};

export default Component;

