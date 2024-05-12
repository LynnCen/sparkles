/**
 * @Description 批量更新弹窗
 */


import V2ImportModal from '@/common/components/business/V2ImportModal';
import { FC, useEffect, useState } from 'react';
import styles from './index.module.less';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import IconFont from '@/common/components/IconFont';
import { useMethods } from '@lhb/hook';
import { downloadFile, isArray } from '@lhb/func';
import { getUersExcelRecords, getUersExcelUrl, impotUersExcelUrl } from '@/common/api/system';
import V2Message from '@/common/components/Others/V2Hint/V2Message';

interface Props {
  /** 是否显示弹窗 */
  showImportModal:boolean;
  /** 控制是否显示弹窗 */
  setShowImportModal: Function;
  /** 刷新表单 */
  refresh:Function;
}

const BatchUpdateModal: FC<Props> = ({
  showImportModal,
  setShowImportModal,
  refresh
}) => {

  const [importModalWidth, setimportModalWidth] = useState<number>(340); // 导入组件宽度
  const [historyData, setHistoryData] = useState<any[]>([]);
  const templateAssets = [{
    url: '',
    name: '员工信息表.xlsx', },
  ];

  // 获取历史记录信息
  useEffect(() => {
    showImportModal && methods.getHistoy();
  }, [showImportModal]);

  const methods = useMethods({

    /** 获取模版 */
    async getTemplateAssets() {
      const url = await getUersExcelUrl();
      if (!url) return;
      downloadFile({
        url,
        name: '员工信息表.xlsx',
      });
    },

    /** 获取导入历史 */
    getHistoy() {
      getUersExcelRecords({ page: 1, size: 20 }).then(({ data }:any) => {
        if (isArray(data) && data.length) {
          setimportModalWidth(720);
          console.log('data', data);
          setHistoryData(data.slice(0, 5)); // 展示最近的5条
          return;
        }
      });
    },

    /** 自定义上传 */
    async customUploadFetch(values, callbackFn) {
      const target = values?.url?.[0];
      if (!target) return;
      const { url, name } = target;
      // const urlStr = `${url}?attname=${name}`;
      const params = { url, name };
      try {
        const result = await impotUersExcelUrl(params);
        if (result) {
          V2Message.success('更新成功');
          callbackFn && callbackFn();
          refresh();
        } else {
          // 导入失败
          callbackFn({ isError: true });
          V2Message.error('更新失败，请稍后再试。');
        }
      } catch (e) {
        callbackFn({ isError: true });
      }
    },



  });
  // 在这里编写组件的逻辑和渲染
  return (
    <div>
      <V2ImportModal
        title='更新员工信息'
        isOpen={showImportModal}
        closeModal={() => setShowImportModal(false)}
        modalWidth={importModalWidth}
        templateAssets={templateAssets}
        firstStepTemplateContent={
          <div className={styles.item}>
            <V2DetailItem
              type='files'
              filePreviewHide
              fileDownloadHide
              assets={templateAssets}
              rightSlot={{
                icon: <IconFont iconHref='icondownload' className='c-006' />,
                onIconClick: () => methods.getTemplateAssets(),
              }}
            />
          </div>
        }
        rightSlot={
          historyData?.length > 0 ? (
            <>
              {historyData.map((item: any, index: number) => (
                <V2DetailItem
                  key={index + item.name}
                  type='files'
                  assets={[
                    {
                      url: item.url,
                      name: item.name,
                    },
                  ]}
                />
              ))}
            </>
          ) : null
        }
        customUploadFetch={(values, callbackFn) => methods.customUploadFetch(values, callbackFn)}
      />
    </div>
  );
};

export default BatchUpdateModal;
