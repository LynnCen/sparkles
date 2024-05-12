// <%=displayName%>
import { FC } from 'react';
<% if(demoPath) { %>import Demo from '<%=demoPath%>';<% } %>

const Component:FC = () => {

  const isCustomPage: any = <%=isCustomPage%>; // 是否自定义文档页面，如果是，不展示组件模板内容
  const propComments: any = <%=propComments%>;

  const filterDefaultValue = (str) => {
    if (typeof str === 'boolean' || typeof str === 'number') {
      return str;
    } else {
      return str || '--';
    }
  };

  return <div className='component-doc'>
    {isCustomPage ? <% if(demoPath) { %><Demo/><% } %><% if(!demoPath) { %>null<% } %> : <>
      <div className='mb-10 fs-18'><%=comName%> <%=displayName%></div>

      <h2>组件描述</h2>
      <pre className='mt-5'><%=description%><% if(!description) { %>-<% } %></pre>

      <h2>组件示例</h2>
      <% if(demoPath) { %><Demo/><% } %><% if(!demoPath) { %><div className='color-warning'>暂无组件 Demo，请完善~~</div><% } %>

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

