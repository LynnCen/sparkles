import { FC, useState } from 'react';
import styles from './entry.module.less';
import { useMethods } from '@lhb/hook';
import Filter from './components/Filter';
import ModelOperate from './components/Modal/ModelOperate';
import { ModelModalValuesProps } from './ts-config';
import Operate from '@/common/components/Operate';
import V2Container from '@/common/components/Data/V2Container';
import V2Table from '@/common/components/Data/V2Table';
import ShowMore from '@/common/components/Data/ShowMore';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import { ConfirmModal } from '@/common/components/Modal/ConfirmModal';
import { get, post } from '@/common/request';
import { Form } from 'antd';
import { refactorPermissions } from '@lhb/func';
const SurroundModelConfig: FC<any> = () => {
  const [searchForm] = Form.useForm();
  const [mainHeight, setMainHeight] = useState<any>();
  const [operateModel, setOperateModel] = useState<ModelModalValuesProps>({
    visible: false,
  });
  const [operateList, setOperateList] = useState<any>([]);
  const [params, setParams] = useState({});
  const [editData, setEditData] = useState<any>({
    visible: false,
    data: {},
  });

  const methods = useMethods({
    onSearch(values) {
      // 为了让查询动态化
      const _params = searchForm.getFieldsValue();
      setParams({
        ..._params,
        ...values,
      });
    },
    showEdit(visible = false, data: any = {}) {
      setEditData({
        ...editData,
        visible,
        data,
      });
    },
    handleCreate() {
      setOperateModel({ visible: true });
    },

    async fetchData(params) {
      // https://yapi.lanhanba.com/project/331/interface/api/34329
      const { meta, objectList, totalNum } = await get('/surround/model/list', params, {
        isMock: false,
        mockId: 331,
        mockSuffix: '/api',
        needHint: true,
        proxyApi: '/blaster',
      });

      if (meta && meta.permissions && meta.permissions.length) {
        const list = refactorPermissions(meta.permissions);
        const operateList = list.map((item) => {
          const res: any = {
            name: item.text,
            event: item.event,
            func: item.func,
            type: item.isBatch ? 'default' : 'primary',
          };
          return res;
        });
        setOperateList(operateList);
      }

      return {
        dataSource: objectList || [],
        count: totalNum,
      };
    },
    handleDelete(record) {
      ConfirmModal({
        onSure: (modal) => {
          post('/surround/model/delete', { id: record.id }, { proxyApi: '/blaster' }).then(() => {
            modal.destroy();
            methods.onSearch();
          });
        },
      });
    },
    handleUpdate(record) {
      setOperateModel({ visible: true, ...record });
    },
    handleSetting(record) {
      dispatchNavigate('/location/surroundmodelconfigdetail?id=' + record.id);
    },
  });

  const columns = [
    { title: '模型名称', key: 'name', dragChecked: true },
    { title: '模型ID', key: 'id', dragChecked: true },
    { title: '模型描述', key: 'description', width: 250, render: (text) => <ShowMore maxWidth='200px' text={text} />, dragChecked: true },
    {
      title: '操作',
      key: 'permissions',
      width: 'auto',
      dragChecked: true,
      render: (value: any, record) => (
        <Operate
          showBtnCount={4}
          operateList={refactorPermissions(value)}
          onClick={(btn: any) => {
            methods[btn.func](record);
          }}
        />
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <V2Container
        className={styles.content}
        style={{ height: 'calc(100vh - 88px)' }}
        emitMainHeight={(h) => setMainHeight(h)}
        extraContent={{
          top: <>
            <Filter onSearch={methods.onSearch} searchForm={searchForm}/>
            <div style={{ marginBottom: '10px' }}>
              <Operate operateList={operateList} onClick={(btn) => methods[btn.func](params)} />
            </div>
          </>

        }}
      >
        <V2Table
          rowKey='id'
          filters={params}
          defaultColumns={columns}
          onFetch={methods.fetchData}
          scroll={{ x: 'max-content', y: mainHeight - 80 - 42 }}
        />
        <ModelOperate setOperateModel={setOperateModel} operateModel={operateModel} onSearch={methods.onSearch} />
      </V2Container>
    </div>
  );
};

export default SurroundModelConfig;
