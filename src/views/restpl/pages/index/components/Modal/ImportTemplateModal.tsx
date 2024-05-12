/**
 * @Description 导入模板弹窗
 */
import { FC, useState } from 'react';
import { Form, Modal, message } from 'antd';
import V2Form from '@/common/components/Form/V2Form';
import V2FormUpload from '@/common/components/Form/V2FormUpload/V2FormUpload';
import { Bucket, bucketMappingDomain } from '@/common/enums/qiniu';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useMethods } from '@lhb/hook';
import V2Table from '@/common/components/Data/V2Table';
import { post } from '@/common/request';



const ImportTemplateModal: FC<any> = ({
  modalData = {},
  setImportTemplateModalData,
  successCb
}) => {
  const [form] = Form.useForm();
  const [checkModalData, setCheckModalData] = useState<any>({
    visible: false,
    data: []
  });

  const defaultColumns = [
    { key: 'identification', title: '属性标识', dragChecked: true, dragDisabled: true },
    { key: 'name', title: '属性名', dragTitle: '年龄', dragChecked: true },
    { key: 'controlType', title: '控件类型', dragChecked: true, whiteTooltip: true },
    { key: 'options', title: '属性配置', dragChecked: true, render: (text:any[]) => text.join(',') },
  ];


  const methods = useMethods({
    handleImportModalClose() {
      setImportTemplateModalData({
        ...modalData,
        visible: false,
      });
      form.resetFields();
    },
    handleImport() {
      form.validateFields().then((values) => {
        const params :any = {
          url: values.url[0].url,
          templateId: modalData.data.templateId,
        };
        // https://yapi.lanhanba.com/project/321/interface/api/54536
        post('/categoryTemplate/checkImportProp', params).then((res:any) => {
          // 有返回列表，就打开列表弹窗，需要确认导入
          if (res?.length) {
            setCheckModalData({
              ...checkModalData,
              visible: true,
              data: res,
              url: values.url[0].url,
            });
          } else {
            // 没有就直接导入
            const params:any = {
              templateId: modalData.data.templateId,
              url: values.url[0].url
            };
            // https://yapi.lanhanba.com/project/321/interface/api/54529
            post('/categoryTemplate/import', params).then(() => {
              message.success('导入成功');
              this.handleImportModalClose();
              successCb?.();
            });
          }
        });
      });
    },
    handleCheckModalClose() {
      setCheckModalData({
        ...checkModalData,
        visible: false,
      });
    },
    handleCheckModalOk() {
      const params:any = {
        templateId: modalData.data.templateId,
        url: checkModalData.url
      };
      // https://yapi.lanhanba.com/project/321/interface/api/54529
      post('/categoryTemplate/import', params).then(() => {
        message.success('导入成功');
        this.handleCheckModalClose();
        this.handleImportModalClose();
        successCb?.();
      });
    },
    loadData() {
      return {
        dataSource: checkModalData.data,
        count: checkModalData.data.length,
      };
    }
  });


  return (
    <>
      <Modal
        title='导入模版'
        open={modalData.visible}
        maskClosable={false}
        onCancel={methods.handleImportModalClose}
        onOk={methods.handleImport}
      >
        <V2Form form={form}>
          <div className='color-warning mt-10 mb-10'>
            <ExclamationCircleOutlined className='mr-5'/>
          当前导入模板将完全覆盖原配置，请谨慎操作
          </div>
          <V2FormUpload
            label=''
            tipConfig={{ show: false }}
            name='url'
            uploadType='file'
            rules={[{ required: true, message: '请上传文件' }]}
            config={{
              maxCount: 1,
              size: 5,
              accept: '.json',
              qiniuParams: {
                domain: bucketMappingDomain['linhuiba-temp'],
                bucket: Bucket.Temp,
              },
              fileType: ['json'],
            }}/>

        </V2Form>
      </Modal>
      <Modal
        title='存在需新增的属性'
        open={checkModalData.visible}
        maskClosable={false}
        okText='继续导入'
        width={720}
        cancelText='取消导入'
        onCancel={methods.handleCheckModalClose}
        onOk={methods.handleCheckModalOk}
      >
        <div className='mt-10 mb-10'>
        请确认是否继续导入，继续导入将自动新增如下属性：
        </div>
        <V2Table
          rowKey='name'
          type='easy'
          pagination={false}
          defaultColumns={defaultColumns}
          onFetch={methods.loadData}
          hideColumnPlaceholder
          scroll={{ x: 'max-content', y: 300 }}
        />
      </Modal>
    </>
  );
};

export default ImportTemplateModal;
