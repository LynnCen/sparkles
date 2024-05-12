/**
 * @Description 拓店模板配置
 */
import { FC, useState, useRef } from 'react';
import StoreTemplateList from './StoreTemplateList';
import { useMethods } from '@lhb/hook';
import StoreTemplateFilter from './StoreTemplateFilter';
import V2Container from '@/common/components/Data/V2Container';
import { Button } from 'antd';
import StoreTemplateOperate from './Modal/StoreTemplateOperate';
import { StoreTemplateModalValuesProps, UploadExcelModalValuesProps } from './ts-config';
import StoreTemplateDraw from './StoreTemplateDraw';
import UploadExcelOperate from './Modal/UploadExcelOperate';

const SystemStore: FC<any> = ({ tenantId, mainHeight }) => {
  // 拓店模版配置 筛选
  const [storeParams, setStoreParams] = useState({ tenantId });
  const [editDraw, setEditDraw] = useState<any>({ visible: false });
  const [operateStoreTemplate, setOperateStoreTemplate] = useState<StoreTemplateModalValuesProps>({
    visible: false,
  });
  const [operateUploadExcel, setOperateUploadExcel] = useState<UploadExcelModalValuesProps>({
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
              <StoreTemplateFilter tenantId={tenantId} onSearch={(values) => setStoreParams({ ...values })} />
              {/* 操作按钮-新增模板 */}
              <Button type='primary' className='mb-16' onClick={() => setOperateStoreTemplate({ visible: true })}>
                新增模板
              </Button>
            </>
          ),
        }}
      >
        {/* 模板列表 */}
        <StoreTemplateList
          onSearch={() => {
            methods.onSearch();
          }}
          setEditDraw={setEditDraw}
          setOperateStoreTemplate={setOperateStoreTemplate}
          setOperateUploadExcel={setOperateUploadExcel}
          params={storeParams}
        />
      </V2Container>
      {/* 模板配置抽屉 */}
      <StoreTemplateDraw editDraw={editDraw} setEditDraw={setEditDraw} tenantId={tenantId}/>
      {/* 模板编辑弹窗 */}
      <StoreTemplateOperate
        setOperateStoreTemplate={setOperateStoreTemplate}
        operateStoreTemplate={operateStoreTemplate}
        onSearch={methods.onSearch}
        tenantId={tenantId}
      />
      {/* 模板Excel弹窗 */}
      <UploadExcelOperate
        operateUploadExcel={operateUploadExcel}
        setOperateUploadExcel={setOperateUploadExcel}
        onSearch={methods.onSearch}
      />
    </div>
  );
};

export default SystemStore;
