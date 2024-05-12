/**
 * @Description 可包含上传历史的导入组件
 * TODO 待自测
 */

import { FC, useRef } from 'react';
import { Modal, Form, Row, Col } from 'antd';
import { Bucket, bucketMappingDomain } from '@/common/enums/qiniu';
import { ImportModalProps } from './ts-config';
import { get, post } from '@/common/request/index';
import { isArray, isUndef } from '@lhb/func';
import V2Form from '@/common/components/Form/V2Form';
import V2Title from '@/common/components/Feedback/V2Title';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import V2FormUpload from '@/common/components/Form/V2FormUpload/V2FormUpload';
import styles from './index.module.less';

const methodMap = {
  get,
  post,
};
const ImportModal: FC<ImportModalProps> = ({
  // formRef,
  title = '导入',
  isOpen,
  modalWidth = 340,
  defaultSpan = 24,
  rightSpan = 12,
  firstStepContent,
  firstStepTemplateContent,
  templateAssets = [],
  firstStepHint = '请根据导入模版的格式整理需要导入的数据',
  secondStepHint = '请上传要导入的文件',
  v2TitleProps,
  V2DetailItemProps,
  rightSlot,
  modalProps,
  uploadFetchConfig,
  uploadConfig,
  uploadProps,
  customUploadFetch,
  finallyData,
  closeModal,
}) => {
  const [form] = Form.useForm();
  const submitLockRef = useRef(false);
  const onValuesChange = (changedValues: any) => {
    const { url } = changedValues;
    if (isUndef(url)) return;
    // 重置未上传后上传文件的验证状态（未上传文件点确定，上传文件后验证信息消失）
    form.validateFields(['url']);
  };
  // 关闭弹窗
  const onCancel = () => {
    closeModal();
    console.log('@@@123');
    form.resetFields();
  };

  // 确定
  const onOk = () => {
    form.validateFields().then((values: any) => {
      // 加锁
      if (submitLockRef.current) return;
      submitLockRef.current = true;
      // 自定义处理上传逻辑
      if (customUploadFetch) {
        // 通过回调函数处理弹窗内的逻辑
        customUploadFetch(values, (res) => {
          const { isError } = res || {};
          submitLockRef.current = false;
          // 出错时只关闭锁
          if (isError) return;
          // 处理弹窗
          onCancel();
        });
        return;
      }
      const { url } = values;
      if (!isArray(url)) return;
      const isMultiple = isArray(url) && url.length > 1; // 是否是上传多个
      // 使用组件默认的上传逻辑
      const {
        method = 'post',
        extraParams = {}, // 接口请求时的额外的参数
        uploadUrl, // 接口请求的url
        extraConfig, // 请求时的配置项
        uploadIsString, // 请求接口时是否只传给接口url的值
        urlFieldsName = 'url', // 传给接口的字段名
        urlNameFieldsName = 'name', // 传给接口的url对应名称字段名
      } = uploadFetchConfig || {};
      let urlVal: string | any[] = url[0]?.url;
      // 可上传多个
      if (isMultiple) {
        // 接口只要url的字符串数组
        if (uploadIsString) urlVal = url.map((item: any) => item.url);
        // 对象数组传给接口
        urlVal = url;
      }
      const params: any = {
        [urlFieldsName]: urlVal,
        [urlNameFieldsName]: url[0]?.name, // 注意接口如果不要上传链接的名字时，需要让接口加一下
        ...extraParams,
      };
      // 接口
      const methodType = methodMap[method];

      methodType(uploadUrl, params, extraConfig)
        .then((res: any) => {
          finallyData && finallyData(res);
          onCancel();
        })
        .finally(() => {
          submitLockRef.current = false;
        });
    });
  };

  return (
    <Modal title={title} open={isOpen} width={modalWidth} onCancel={onCancel} onOk={onOk} {...modalProps}>
      <Row gutter={24}>
        {/* 根据右侧是否显示上传历史决定span */}
        <Col span={rightSlot ? 24 - rightSpan : defaultSpan}>
          <V2Form form={form} onValuesChange={onValuesChange}>
            {
              // 自定义第一步内容 || 使用默认的结构
              firstStepContent || (
                <>
                  {/* 第一步 */}
                  <V2Title divider type='H2' text='第一步' {...v2TitleProps} />
                  {/* 提示语 */}
                  <div className='mt-8'>{firstStepHint}</div>

                  {
                    // 自定义模板
                    firstStepTemplateContent || (
                      <div className={styles.item}>
                        {/* 模板部分 */}
                        <V2DetailItem type='files' filePreviewHide assets={templateAssets} {...V2DetailItemProps} />
                      </div>
                    )
                  }
                </>
              )
            }
            {/* 第二步 */}
            <V2Title divider type='H2' text='第二步' className='mt-28' {...v2TitleProps} />
            {/* 提示语 */}
            <div className='mt-8'>{secondStepHint}</div>
            <div className='mt-4'>
              <V2FormUpload
                label=''
                tipConfig={{ show: false }}
                name='url'
                uploadType='file'
                rules={[{ required: true, message: '请上传文件' }]}
                config={{
                  maxCount: 1,
                  size: 3,
                  accept: '.xlsx, .xls',
                  qiniuParams: {
                    domain: bucketMappingDomain['linhuiba-file'],
                    bucket: Bucket.File,
                  },
                  fileType: ['xls', 'xlsx'],
                }}
                formItemConfig={{
                  validateTrigger: 'onSubmit', // 防止弹窗打开时就默认校验
                }}
                {...uploadConfig}
                {...uploadProps}
              />
            </div>
          </V2Form>
        </Col>
        {/* 右侧内容 */}
        {rightSlot ? <Col span={rightSpan}>{rightSlot}</Col> : null}
      </Row>
    </Modal>
  );
};

export default ImportModal;
