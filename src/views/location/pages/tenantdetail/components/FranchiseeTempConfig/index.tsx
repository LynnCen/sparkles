/**
 * @Description 拓店模板配置
 */
import { FC, useState, useRef } from 'react';
import { useMethods } from '@lhb/hook';
import V2Container from '@/common/components/Data/V2Container';
import { Button } from 'antd';
import Filter from './components/Filter';
import TemplateEdit from './components/TemplateEdit';
import TemplateList from './components/TemplateList';
import { StoreTemplateModalValuesProps } from './ts-config';
// import StoreTemplateDraw from './StoreTemplateDraw';

const FranchiseeTempConfig: FC<any> = ({ tenantId, mainHeight }) => {
  // 拓店模版配置 筛选
  const [storeParams, setStoreParams] = useState({ tenantId });
  const [operateStoreTemplate, setOperateStoreTemplate] = useState<StoreTemplateModalValuesProps>({
    visible: false,
  });
  const wrapperRref: any = useRef(null); // 容器dom

  const methods = useMethods({
    onSearch(values) {
      setStoreParams({ ...values });
    },
  });
  return (
    <div ref={wrapperRref}>
      <V2Container
        style={{ height: mainHeight }}
        extraContent={{
          top: (
            <>
              {/* 顶部筛选项 */}
              <Filter tenantId={tenantId} onSearch={(values) => setStoreParams({ ...values })} />
              {/* 操作按钮-新增模板 */}
              <Button type='primary' className='mb-16' onClick={() => setOperateStoreTemplate({ visible: true })}>
                新增模板
              </Button>
            </>
          ),
        }}
      >
        {/* 模板列表 */}
        <TemplateList
          onSearch={() => {
            methods.onSearch();
          }}
          setOperateStoreTemplate={setOperateStoreTemplate}
          params={storeParams}
        />
      </V2Container>
      {/* 模板配置抽屉 */}
      {/* <StoreTemplateDraw editDraw={editDraw} setEditDraw={setEditDraw} tenantId={tenantId}/> */}
      {/* 模板编辑弹窗 */}
      <TemplateEdit
        setOperateStoreTemplate={setOperateStoreTemplate}
        operateStoreTemplate={operateStoreTemplate}
        onSearch={methods.onSearch}
        tenantId={tenantId}
      />
    </div>
  );
};

export default FranchiseeTempConfig;
