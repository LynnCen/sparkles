import { Form, Modal, Spin, message } from 'antd';
import { FC, useState, useEffect } from 'react';
import styles from './index.module.less';
import { post } from '@/common/request';
import { downloadFile } from '@lhb/func';
import { getImportRecords } from '@/common/api/fishtogether';
import V2FormUpload from '@/common/components/Form/V2FormUpload/V2FormUpload';
import V2Title from '@/common/components/Feedback/V2Title';
import V2Form from '@/common/components/Form/V2Form';
import IconFont from '@/common/components/IconFont';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
interface FormData {
  url: Array<any>;
}

const ImportChancePointHistoryModal: FC<any> = ({
  visible, // 控制上传Modal的显示
  closeHandle, // 关闭弹窗,并刷新列表
  confirmHandle, // 上传成功后刷新列表
  importChancePointId,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [isLock, setIsLock] = useState<boolean>(false);
  const [history, setHistory] = useState<any>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [dynamicWidth, setDynamicWidth] = useState<number>(336);

  // 机会点导入：https://yapi.lanhanba.com/project/497/interface/api/52933
  const importFile = async (params: any) => {
    await post('/yn/chancePoint/import', params, true);
    confirmHandle();
    message.success('导入完成');
  };

  // 导入状态判断：https://yapi.lanhanba.com/project/497/interface/api/52926
  const importCheck = async (params: any) => {
    setIsLock(true);
    setLoading(true);
    try {
      const result = await post('/yn/chancePoint/import/status', params, true);
      setIsLock(false);
      setLoading(false);
      if (result?.status === 1) {
        message.warn('当前导入的数据和上一版数据完全一致，请确认导入数据是否正确');
      } else {
        V2Confirm({
          onSure: () => importFile(params),
          content: '当前导入的数据和上一版数据不一致，请确认导入数据是否正确',
          zIndex: 1003
        });
      }
    } catch (e) {
      setIsLock(false);
      setLoading(false);
    }
  };

  const customDownload = () => {
    setLoading(true);
    // 导出模板: https://yapi.lanhanba.com/project/497/interface/api/52947
    post('/yn/point/template/export', { chancePointId: importChancePointId }, { isZeus: true })
      .then((values) => {
        downloadFile({
          url: values.url,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const submitHandle = () => {
    form.validateFields().then(async (values: FormData) => {
      if (isLock) return;

      const { url: urlArr } = values;
      if (!urlArr) {
        message.warn('请上传要导入的文件');
        return;
      }
      const target = urlArr[0] || {};
      const { url, name } = target;
      const urlStr = `${url}?attname=${name}`;
      const param = { url: urlStr, excelName: name, chancePointId: importChancePointId };
      importCheck(param);
    });
  };
  const cancelHandle = () => {
    closeHandle();
  };

  const formatName = (name: string) => {
    if (name && name.length > 10) {
      let fileName = name.split('.')[0];
      if (fileName.length > 8) {
        fileName = fileName.substring(0, 8) + '...';
      }
      return fileName + ' .' + name.split('.')[1];
    }
    return '-';
  };

  const formatDate = (date: string) => {
    if (date && date.length) {
      return date.replace('T', ' ').replaceAll('-', '.');
    }
    return '-';
  };

  const loadHistory = () => {
    // https://yapi.lanhanba.com/project/497/interface/api/52940
    // get('/yn/chancePoint/import/records', { id: importChancePointId }, true).then((values) => {
    getImportRecords({ id: importChancePointId }).then((values) => {
      if (values && values.length) {
        setHistory(values || []);
        setDynamicWidth(720);
        setShowHistory(true);
      } else {
        setHistory([]);
        setShowHistory(false);
        setDynamicWidth(336);
      }
    });
  };

  const onDownload = (url: string) => {
    downloadFile({
      url: url,
    });
  };

  useEffect(() => {
    if (visible) {
      loadHistory();
      form.resetFields();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <Modal
      forceRender
      title={'导入机会点'}
      open={visible}
      destroyOnClose={true}
      onOk={submitHandle}
      wrapClassName={styles.exportModal}
      onCancel={cancelHandle}
      width={dynamicWidth}
      zIndex={1002} // 第二个drawer是1001
    >
      <Spin spinning={loading}>
        <div className={styles.importExcel}>
          <div className={styles.left}>
            <V2Form form={form} name='form' colon={false}>
              <V2Title divider type='H2' text='第一步' className='mb-8'/>
              <div className='fn-14 mt-4 mb-4'>请根据导入模版的格式整理需要导入的数据</div>
              <div className={styles.template}>
                <IconFont iconHref='icon-file_icon_excel' className={styles.iconSize} />
                <span className='ml-3'>机会点模版</span>
                <IconFont
                  iconHref='icondownload'
                  className='color-primary-operate right mr-40 pt-3 fn-16'
                  onClick={customDownload}
                />
              </div>
              <V2Title divider type='H2' text='第二步' className='mb-8' />
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
          {showHistory && (
            <div className={styles.right}>
              <div className='fn-14'>历史记录</div>
              <div className={styles.records}>
                {history.map((item, idx) => (
                  <div className={styles.item} key={idx}>
                    <span>
                      {formatDate(item.createdAt)} {formatName(item.name)}
                    </span>
                    <div className='right pt-3'>
                      <IconFont
                        iconHref='icondownload'
                        className='color-primary-operate right fn-14'
                        onClick={() => onDownload(item.url)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Spin>
    </Modal>
  );
};
export default ImportChancePointHistoryModal;
