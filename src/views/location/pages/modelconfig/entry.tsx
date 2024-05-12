import { FC, useState } from 'react';
import styles from './entry.module.less';
import TableList from './components/TableList';
import { useMethods } from '@lhb/hook';
import Filter from './components/Filter';
import ModelOperate from './components/Modal/ModelOperate';
import { ModelModalValuesProps, TabStatus } from './ts-config';
import Operate from '@/common/components/Operate';
import { Form } from 'antd';
import V2Tabs from '@/common/components/Data/V2Tabs';
import V2Container from '@/common/components/Data/V2Container';
const ModelConfig: FC<any> = () => {
  const [searchForm] = Form.useForm();
  const [mainHeight, setMainHeight] = useState<number>(0);
  const [activeKey, setActiveKey] = useState<string>(TabStatus.RECOMMENDED_AREA_MODEL);
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
      setOperateModel({
        visible: true,
      });
    },
  });

  const items = [
    {
      key: '1',
      label: `推荐区域模型`,
      children: <TableList
        add={methods.addHandle}
        onSearch={() => {
          methods.onSearch();
        }}
        setOperateList={setOperateList}
        setOperateModel={setOperateModel}
        params={params}
        // setOperateId={setOperateId}
        showEdit={methods.showEdit}
        mainHeight={mainHeight}
      />
    },
  ];

  return (
    <>
      <V2Container
        className={styles.container}
        // style={{ height: '600px' }}
        style={{ height: 'calc(100vh - 88px)' }}
        emitMainHeight={(h) => setMainHeight(h)}
        extraContent={{
          top: <>
            <Filter onSearch={methods.onSearch} searchForm={searchForm}/>

          </>,
        }}>
        <V2Tabs
          items={items}
          activeKey={activeKey}
          destroyInactiveTabPane
          onChange={setActiveKey} tabBarExtraContent={{
            right: <Operate operateList={operateList} onClick={(btn) => methods[btn.func]()} />
          }}/>
      </V2Container>
      <ModelOperate
        setOperateModel={setOperateModel}
        operateModel={operateModel}
        onSearch={methods.onSearch}
        type={activeKey}
      />
    </>
  );
};

export default ModelConfig;
