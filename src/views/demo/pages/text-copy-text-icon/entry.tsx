// 复制文本图标
import { FC } from 'react';
import Demo from 'src/common/components/Text/CopyTextIconDemo';

const Component:FC = () => {

  const isCustomPage: any = false; // 是否自定义文档页面，如果是，不展示组件模板内容
  const propComments: any = [{"name":"value","description":"","type":"string | number","defaultValue":"","required":false},{"name":"duration","description":"","type":"number","defaultValue":"2000","required":false},{"name":"showMessage","description":"","type":"boolean","defaultValue":"false","required":false},{"name":"message","description":"","type":"string","defaultValue":"","required":false},{"name":"tip","description":"","type":"string | number","defaultValue":"点击复制","required":false},{"name":"className","description":"","type":"any","defaultValue":null,"required":false},{"name":"onSuccess","description":"","type":"Function","defaultValue":null,"required":false}];

  const filterDefaultValue = (str) => {
    if (typeof str === 'boolean' || typeof str === 'number') {
      return str;
    } else {
      return str || '--';
    }
  };

  return <div className='component-doc'>
    {isCustomPage ? <Demo/> : <>
      <div className='mb-10 fs-18'>CopyTextIcon 复制文本图标</div>

      <h2>组件描述</h2>
      <pre className='mt-5'>复制文本图标</pre>

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

