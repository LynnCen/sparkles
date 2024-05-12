import V2Table from '@/common/components/Data/V2Table';
import styles from './entry.module.less';
import V2Container from '@/common/components/Data/V2Container';
import SearchForm from '@/common/components/Form/SearchForm';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import { useState } from 'react';
import { useMethods } from '@lhb/hook';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2Operate from '@/common/components/Others/V2Operate';
import { refactorPermissions } from '@lhb/func';
import { postCheckSpotDeviceExport, postCheckSpotDeviceImport, postCheckSpotDevicePage } from '@/common/api/flow';
import V2ImportModal from '@/common/components/SpecialBusiness/V2ImportModal';
import EditModal from './components/EditModal';

const assets = [
  { url: 'https://middle-file.linhuiba.com/Fk8KGNReipd_lPywyEMuuWMgcmo4', name: '设备录入模板.xls' },
];

/** 踩点设备管理是否可用 */
export const devicesEnableOptions = [
  { label: '是', value: 1 },
  { label: '否', value: 0 },
];


const Devices = () => {
  const [mainHeight, setMainHeight] = useState<number>(0);
  const [filters, setFilters] = useState<{ [x: string]: string }>({});
  const [importModalVisible, setImportModalVisible] = useState<boolean>(false);
  const [permission, setPermission] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editModalData, setEditModalData] = useState<any>({ visible: false });

  const defaultColumns: any[] = [
    { key: 'sourceCode', title: '设备源码', dragChecked: true, dragDisabled: false, width: 140 },
    { key: 'encryptCode', title: 'location加密码', dragChecked: true, dragDisabled: false, width: 320 },
    { key: 'serialNum', title: ' location设备码', dragChecked: true, dragDisabled: false },
    { key: 'purchaseDate', title: '采购日期', dragChecked: true, dragDisabled: false, width: 160 },
    { key: 'creator', title: '录入人', dragChecked: true, dragDisabled: false, width: 140 },
    { key: 'enable', title: '是否可用', dragChecked: true, dragDisabled: false, width: 120, render: (_:number|string) => Number(_) === 1 ? '是' : '否' },
    { key: 'permissions', title: '操作', dragChecked: true, dragDisabled: false, whiteTooltip: true,
      width: 120,
      render: (val: any[], record: any) => (
        <V2Operate
          operateList={refactorPermissions(val)}
          onClick={(btn: any) => methods[btn.func](record)}
        />
      ), },
  ];



  const methods = useMethods({
    async onFetch(params: any) {
      const data:any = await postCheckSpotDevicePage(params);
      const _permission = refactorPermissions(data?.meta.permissions, [], (item) => {
        return {
          ...item,
          type: 'primary'
        };
      }) || [];
      setPermission(_permission);
      return {
        dataSource: data?.objectList || [],
        count: data?.totalNum || 0,
      };
    },
    onSearch(values: { [x: string]: string }) {
      const trimmedObj = Object.fromEntries(
        Object.entries(values).map(([key, value]) => [key, value?.trim()])
      );
      setFilters(trimmedObj);
    },
    /** 导入 */
    handleImport() {
      setImportModalVisible(true);
    },
    /** 导出 */
    handleExport() {
      postCheckSpotDeviceExport({ ...filters }).then((url:string) => {
        window.open(url);
      });
    },
    /** 导入弹窗事件 */
    onSubmitExcel(data) {
      setLoading(true);
      return new Promise((res) => {
        // 在这里做接口处理，然后通过 res(true) 来异步关闭弹窗
        const url = data.file.length ? data.file[0].url : undefined;
        postCheckSpotDeviceImport({ url: url })
          .then(() => {
            res(true);
            setLoading(false);
            methods.onSearch({});
          })
          .finally(() => {
            res(false);
            setLoading(false);
          });
      });
    },
    /** 编辑 */
    handleUpdate(row:any) {
      setEditModalData({
        ...editModalData,
        data: row,
        id: row.id,
        visible: true
      });
    }
  });

  return <>
    <V2Container
      className={styles.devices}
      emitMainHeight={(h) => setMainHeight(h)}
      style={{ height: 'calc(100vh - 88px)' }}
      extraContent={{
        top: <>
          <SearchForm
            onSearch={methods.onSearch}
          >
            <V2FormInput label='设备源码' name='sourceCode' />
            <V2FormInput label='location加密码' name='encryptCode' />
            <V2FormInput label='location设备码' name='serialNum' />
            <V2FormSelect label='是否可用' name='enable' options={devicesEnableOptions} />
          </SearchForm>
          <div className='mb-12'>
            <V2Operate
              operateList={refactorPermissions(permission)}
              onClick={(btn: any) => methods[btn.func]()}
            />
          </div>
        </>,
      }}>
      <V2Table
        rowKey='id'
        filters={filters}
        // 勿删! 64：分页模块总大小、52:分页模块减去paddingBottom的值、42:table头部
        scroll={{ y: mainHeight - 64 - 42 - 16 }}
        defaultColumns={defaultColumns}
        onFetch={methods.onFetch}
        emptyRender={true}
      />
    </V2Container>
    <V2ImportModal
      visible={importModalVisible}
      setVisible={setImportModalVisible}
      title='导入设备'
      assets={assets}
      onSubmitExcel={methods.onSubmitExcel}
      modalConfig={{
        confirmLoading: loading
      }}
      // 如果不是qiniu文件，那就自定义下载功能
      // downloadModuleProps={{
      //   fileDownloadDisabled: true,
      //   onClickDownload() {
      //     // 在这里自定义下载
      //   }
      // }}
    />
    <EditModal
      modalData={editModalData}
      setModalData={setEditModalData}
      successCb={methods.onSearch}
    />
  </>;
};

export default Devices;
