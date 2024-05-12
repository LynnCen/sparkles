import { Form, Modal, Spin, message } from 'antd';
import { FC, useState, useEffect } from 'react';
import styles from './index.module.less';
import { downloadFile, isArray } from '@lhb/func';
import V2FormUpload from '@/common/components/Form/V2FormUpload/V2FormUpload';
import V2Title from '@/common/components/Feedback/V2Title';
import V2Form from '@/common/components/Form/V2Form';
import IconFont from '@/common/components/IconFont';
import { importChancePointTable } from '@/common/api/location';
import { DownloadOutlined } from '@ant-design/icons';
import { dynamicTemplateType } from '../ts-config';
interface FormData {
  url: Array<any>;
}

const StoreOperationModal: FC<any> = ({
  modalInfo, // 控制上传Modal的显示
  closeHandle, // 关闭弹窗,并刷新列表
  tenantId,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  const cancelHandle = () => {
    closeHandle();
  };

  const download = () => {
    if (modalInfo.isModule) {
      // 模块信息Modal模版
      downloadFile({
        name: '机会点表头模板',
        url: `https://staticres.linhuiba.com/project-custom/locationpc/file/机会点表头模板.xlsx`
      });
    } else {
      // 选址地图表头Modal模版
      downloadFile({
        name: '机会点表头模板',
        url: `https://staticres.linhuiba.com/project-custom/locationpc/file/机会点表头模板.xlsx`
      });
    }

  };

  const submitHandle = () => {
    form.validateFields().then(async (values: FormData) => {
      if (loading) return;
      const { url: urlArr } = values;
      if (!(isArray(urlArr) && urlArr.length)) {
        message.warn('请上传要导入的文件');
        return;
      }
      const target = urlArr[0] || {};
      const { url, name } = target;
      const param = {
        url,
        urlName: name,
        tenantId,
        dynamicTemplateType: modalInfo.isModule ? dynamicTemplateType.changePoint : dynamicTemplateType.siteSelection
      };
      setLoading(true);

      await importChancePointTable(param).then(() => {
        closeHandle();
        message.success('导入完成');
      }).finally(() => {
        setLoading(false);
      });
    });
  };


  useEffect(() => {
    if (modalInfo.visible) {
      form.resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalInfo.visible]);

  return (
    <Modal
      forceRender
      title={modalInfo.isModule ? '导入模块信息' : '导入选址地图表头'}
      open={modalInfo.visible}
      destroyOnClose={true}
      onOk={submitHandle}
      wrapClassName={styles.importModal}
      onCancel={cancelHandle}
      width={336}
    >
      <Spin spinning={loading}>
        <div className={styles.importExcel}>

          <V2Form form={form} name='form' colon={false}>
            <V2Title divider type='H2' text='第一步' />
            <div className='fn-14 mt-4 mb-12'>请根据导入模版的格式整理需要导入的数据</div>
            <div className={styles.template}>
              <IconFont iconHref='icon-file_icon_excel' className={styles.iconSize} />
              <span className='ml-3'>机会点表头模板.xlsx</span>
              <span className='right'><DownloadOutlined onClick={download}/></span>
            </div>
            <V2Title divider type='H2' text='第二步' className='mb-4' />
            <V2FormUpload
              label='请上传要导入的文件'
              name='url'
              uploadType='file'
              config={{
                size: 3,
                maxCount: 1,
                fileType: ['xlsx', 'xls'],
              }}
            />
          </V2Form>

        </div>
      </Spin>
    </Modal>
  );
};
export default StoreOperationModal;
