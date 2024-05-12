/**
 * @Description 导入弹窗
 */
import { getCityConfigLastExcel, postCityConfigImportExcel } from '@/common/api/system';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import V2ImportModal from '@/common/components/SpecialBusiness/V2ImportModal';
import { downloadFile } from '@lhb/func';
import { useMethods } from '@lhb/hook';
import { FC, useState } from 'react';

interface Props {
  visible: boolean; // 弹窗显示
  setVisible: (vis: boolean) => void; // 控制弹窗可见
  refresh: () => void; // 刷新前置列表
}

const ImportModal: FC<Props> = ({ visible, setVisible, refresh }) => {
  const [loading, setLoading] = useState<boolean>(false); // 上传锁
  const [lock, setLock] = useState<boolean>(false); // 下载锁

  const methods = useMethods({
    /**
     * @description 导入城市数据类型
     */
    onSubmitExcel(data) {
      setLoading(true);
      return new Promise(async (res) => {
        // 在这里做接口处理，然后通过 res(true) 来异步关闭弹窗
        try {
          const { url, name } = data.file[0] || {};
          const isOk = await postCityConfigImportExcel({ url, name });
          if (isOk) {
            setLoading(false);
            V2Message.success('导入成功');
            refresh();
            res(true);
          } else {
            setLoading(false);
            V2Message.error('导入失败');
            res(false);
          }
        } catch (error) {
          setLoading(false);
          // 手动 reject Promise
          res(false);
        }
      });
    },

    /**
     * @description 获取上一次导入的城市配置数据类型
     */
    async download() {
      if (lock) {
        return;
      }
      setLock(true);
      const res = await getCityConfigLastExcel();
      downloadFile({
        url: res.url,
      });
      setLock(false);
    },
  });
  // 在这里编写组件的逻辑和渲染
  return (
    <div>
      <V2ImportModal
        visible={visible}
        setVisible={setVisible}
        title='导入城市数据类型'
        firstStageTitle='第一步：下载当前数据，并基于此数据修改后再导入'
        secondStageTitle='第二步：请上传要导入的文件'
        assets={[{ name: '城市类型基础数据.xlsx' }]}
        onSubmitExcel={methods.onSubmitExcel}
        modalConfig={{
          confirmLoading: loading,
        }}
        downloadModuleProps={{
          fileDownloadDisabled: true,
          onClickDownload() {
            methods.download();
          },
        }}
      />
    </div>
  );
};

export default ImportModal;
