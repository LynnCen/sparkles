import { getFlowSelection, getFlowTaskDetail } from '@/common/api/flowEngine';
import styles from './entry.module.less';
import { matchQuery } from '@lhb/func';
import { useEffect, useState } from 'react';
import { useMethods } from '@lhb/hook';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import V2Container from '@/common/components/Data/V2Container';
import FlowDetailContainer from './components/FlowDetailContainer';


const FlowEngineModules = () => {
  const appId = matchQuery(location.search, 'appId'); // 应用id
  const tenantId = matchQuery(location.search, 'tenantId'); // 租户id
  const id = matchQuery(location.search, 'id'); // 模版id

  const [mainHeight, setMainHeight] = useState<number>(0);
  const [data, setData] = useState<any>({}); // 模版详情
  const [flowTemplateSelection, setFlowTemplateSelection] = useState<any>({}); // 表单筛选选项

  // 获取表单筛选选项
  const getFlowSelectionData = () => {
    getFlowSelection().then((res: any) => {
      setFlowTemplateSelection(res);
    });
  };


  const methods = useMethods({
    getDetail() {
      getFlowTaskDetail(id).then((res:any) => {
        setData(res);
      });
    }
  });

  useEffect(() => {
    if (id) {
      methods.getDetail();
    }

  }, [id]);

  useEffect(() => {
    if (!flowTemplateSelection.length) {
      getFlowSelectionData();
    }
  }, []);

  return (
    <>
      <V2Container
        className={styles.container}
        style={{ height: 'calc(100vh - 88px)' }}
        emitMainHeight={(h) => setMainHeight(h)}
        extraContent={{
          top: <>
            <Breadcrumb className={styles.breadcrumb}>
              <Breadcrumb.Item>
                <Link to={`/flowEngine/flowList?appId=${appId}&tenantId=${tenantId}`}>流程配置列表</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>流程配置</Breadcrumb.Item>
            </Breadcrumb>
          </>
        }}>
        <FlowDetailContainer
          mainHeight={mainHeight}
          data={data}
        />
      </V2Container>
    </>
  );
};


export default FlowEngineModules;


