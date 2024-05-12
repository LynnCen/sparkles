/**
 * @Description 拓店模板-详细信息-表单配置抽屉页
 */
import { useMethods } from '@lhb/hook';
import { FC, useState } from 'react';
import { Divider, Space } from 'antd';
import StoreTemplateEdit from './StoreTemplateEdit';
// import { PropertyTreeDrawInfo } from './ts-config';
// import FieldTreeDraw from './FieldTree/index';
import FieldTreeDraw from '@/common/business/Location/SelectPropertyModal';
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import styles from './entry.module.less';

const FormConfig: FC<any> = ({ tenantId, editDraw, setEditDraw }) => {
  const { visible, templateId } = editDraw;
  const [params, setParams] = useState<any>({});
  const [expandedRowKeys, setExpandedRowKeys] = useState<any>([]);
  const [propertyTreeDrawInfo, setPropertyTreeDrawInfo] = useState<any>({
    categoryTemplateId: null, // 模板id
    categoryPropertyGroupId: null, // 属性所在的二级分组id
    visible: false,
    rowKey: null, // 二级分组的key（前端生成的）
    rowData: [], // 二级分组下的所有属性（对应二级分组下的children）
  });

  const methods = useMethods({
    onSearch() {
      setParams({});
    },

    handleCancel: () => {
      setEditDraw({ visible: false, templateId: '' });
    },
  });

  return (
    <div>
      <V2Drawer
        className={styles.drawer}
        open={visible}
        onClose={methods.handleCancel}
        destroyOnClose
        contentWrapperStyle={{
          width: '70%',
          minWidth: '1108px',
          maxWidth: '1152px',
        }}
        title={
          <>
            <Space className='mt-16 ml-40'>
              <span style={{ fontSize: '20px' }}>详细信息编辑</span>
            </Space>
            <Divider className='mt-16 mb-0'/>
          </>
        }
      >
        {/* 表单页配置 */}
        <div className='mt-16'>
          {/* 配置字段后的分组Table */}
          <StoreTemplateEdit
            tenantId={tenantId}
            templateId={templateId}
            params={params}
            onSearch={() => {
              methods.onSearch();
            }}
            propertyTreeDrawInfo={propertyTreeDrawInfo}
            setPropertyTreeDrawInfo={setPropertyTreeDrawInfo}
            expandedRowKeys={expandedRowKeys}
            setExpandedRowKeys={setExpandedRowKeys}
          />
          {/* 添加字段的弹窗 */}
          <FieldTreeDraw
            templateId={templateId}
            onSearch={methods.onSearch}
            propertyTreeDrawInfo={propertyTreeDrawInfo}
            setPropertyTreeDrawInfo={setPropertyTreeDrawInfo}
            setExpandedRowKeys={setExpandedRowKeys}
          />
        </div>
      </V2Drawer>
    </div>
  );
};
export default FormConfig;
