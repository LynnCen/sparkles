/**
 * @Description 拓店模板的配置抽屉页
 */
import { useMethods } from '@lhb/hook';
import { FC, useState } from 'react';
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import { Divider, Space } from 'antd';
import IconFont from '@/common/components/IconFont';
import styles from './entry.module.less';
import DetailPageConfig from './DetailPageConfig';
import FormConfig from './FormConfig';

const StoreTemplateDraw: FC<any> = ({ editDraw, setEditDraw, tenantId }) => {
  const { visible, name, templateId } = editDraw;
  const [formConfigDraw, setFormConfigDraw] = useState<any>({ visible: false, templateId: '' });

  const methods = useMethods({
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
              <IconFont style={{ fontSize: '24px' }} iconHref='icon-logotu' />
              <span style={{ fontSize: '20px' }}>{name}</span>
            </Space>
            <Divider className='mt-16 mb-0'/>
          </>
        }
      >
        <FormConfig
          tenantId={tenantId}
          editDraw={formConfigDraw}
          setEditDraw={setFormConfigDraw}
        />
        {/* 详情页配置 */}
        <div className='mt-16'>
          <DetailPageConfig
            id={editDraw.id}
            tenantId={tenantId}
            templateId={templateId}
            setFormConfigDraw={setFormConfigDraw}
          />
        </div>
      </V2Drawer>
    </div>
  );
};
export default StoreTemplateDraw;
