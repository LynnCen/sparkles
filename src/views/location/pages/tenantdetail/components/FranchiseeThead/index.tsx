/**
 * @Description 加盟商列表表头配置
 */

import { FC, useEffect, useState } from 'react';
import { Spin, Button } from 'antd';
import { franchiseeTableThead, franchiseeTableImport } from '@/common/api/location';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import V2ImportModal from 'src/common/components/SpecialBusiness/V2ImportModal/index';
import V2Message from '@/common/components/Others/V2Hint/V2Message';

const FranchiseeThead: FC<any> = ({
  tenantId
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [files, setFiles] = useState<any[]>([]); // 最新的模版
  const [importVisible, setImportVisible] = useState<boolean>(false);
  const [requesting, setRequesting] = useState<boolean>(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    setLoading(true); // 其他地方调用了loadHistory
    franchiseeTableThead({
      tenantId,
    }).then((res) => {
      let file: any = {
        url: 'https://staticres.linhuiba.com/project-custom/locationpc/file/表头配置模板.xlsx',
        urlName: '表头配置模板.xlsx'
      };
      if (res) {
        file = res;
      }
      const { url, urlName } = file;
      setFiles([{
        url,
        name: urlName
      }]);
    }).finally(() => {
      setLoading(false);
    });
  };
  // 确定导入
  const submitHandle = (data) => {
    const { file } = data || {};
    const { name, url } = file?.[0] || {};
    if (!(name && url)) {
      V2Message.error('上传组件异常，未获取到上传后的的地址');
      return;
    }
    setRequesting(true);
    const params = {
      tenantId,
      url,
      urlName: name,
    };
    franchiseeTableImport(params).then(() => {
      V2Message.success('导入成功');
      setImportVisible(false);
      // 更新列表
      loadHistory();
    }).finally(() => {
      setRequesting(false);
    });
  };

  return (
    <>
      <Spin spinning={loading}>
        <Button
          type='primary'
          onClick={() => setImportVisible(true)}
        >
          导入模块信息
        </Button>

        <V2DetailItem
          type='files'
          filePreviewHide
          assets={files}
          valueStyle={{
            width: '300px'
          }}
        />
      </Spin>
      {/* 导入弹窗 */}
      <V2ImportModal
        title='导入模版信息'
        visible={importVisible}
        setVisible={setImportVisible}
        assets={files}
        onSubmitExcel={submitHandle}
        modalConfig={{ confirmLoading: requesting }}
        formConfig={{ layout: 'horizontal' }}
      />
    </>
  );
};

export default FranchiseeThead;
