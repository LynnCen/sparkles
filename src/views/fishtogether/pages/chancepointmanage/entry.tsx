/**
 * @description 鱼你机会点管理 + 详情（抽屉的展示形式）
 * 注释的部分为代码迁移，暂时保留一个版本，后续没有问题时移除
 */
import cs from 'classnames';
import V2Container from '@/common/components/Data/V2Container';
import Filter from './components/Filter';
import List from './components/List';
// import DetailDrawer from './components/Drawer';
import { useMemo, useState } from 'react';
import { getYNChancepointList } from '@/common/api/fishtogether';
import { message } from 'antd';
// import FormDrawer from './components/FormDrawer';
import SelectTemplateModal from './components/SelectTemplateModal';
import V2Operate from '@/common/components/Others/V2Operate';
import { useMethods } from '@lhb/hook';
// import ImportChancePointHistoryModal from './components/Modal/ImportChancePointHistoryModal';
import PointDetail from '@/common/components/business/Fishtogether/PointDetail';
import { refactorPermissions } from '@lhb/func';

const Tap = () => {
  const [params, setParams] = useState<any>({});
  const [currentId, setCurrentId] = useState<any>();
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [formDrawerData, setFormDrawerData] = useState<any>({
    open: false,
    templateId: '', // 模板id
    id: '', // 编辑时的id
  });

  const [selectTemplateVisible, setSelectTemplateVisible] = useState<boolean>(false);

  // const [importChancePointId, setImportChancePointId] = useState<any>({});

  // 顶部按钮
  const [operateExtra, setOperateExtra] = useState<any>([]);
  const [refreshDetail, setRefreshDetail] = useState<number>(0);

  const operateList: any = useMemo(() => {
    const list = refactorPermissions(operateExtra);
    return list.map((item) => {
      const res: any = {
        name: item.text,
        event: item.event,
        func: item.func,
        type: item.isBatch ? 'default' : 'primary',
      };
      return res;
    });
  }, [operateExtra]);

  const onSearch = (values: any) => {
    setParams(values);
  };

  // 打开详情页时的编辑表单的刷新详情页
  const updateHandle = () => {
    const curVal = refreshDetail + 1;
    setRefreshDetail(curVal);
  };

  const loadData = async (params) => {
    const result: any = await getYNChancepointList(params);
    setOperateExtra(result?.meta?.data?.permissions || []);
    return { dataSource: result.data, count: result?.meta?.total };
  };

  // 查看详情
  const viewDetail = (record: any) => {
    const { id, enable } = record;
    if (!enable) {
      message.warning('不是自己创建的机会点，没有权限查看');
      return;
    }
    setCurrentId(id);
    setDrawerVisible(true);
  };

  const methods = useMethods({
    handleCreate() {
      setSelectTemplateVisible(true);
    },
  });

  return (
    <div className={cs('bg-fff', 'pd-20')}>
      <V2Container
        /*
          减去高度设置120 = 顶部条高度48 + main上下padding各16 + container上下padding各20；
          减去高度大于这个值，页面底部留白大于预期；
          减去高度小于这个值，页面底部留白小于预期，且页面右侧会出现不必要的滚动条；
        */
        style={{ height: 'calc(100vh - 120px)' }}
        extraContent={{
          top: (
            <>
              <Filter onSearch={onSearch} />
              <div className='mb-20'>
                <V2Operate operateList={operateList} onClick={(btn) => methods[btn.func]()} />
              </div>
            </>
          ),
        }}
      >
        <List params={params} loadData={loadData} openDetail={viewDetail} />
        {/* 机会点详情页相关组件，包含机会点详情、编辑机会点、导入审批表 */}
        <PointDetail
          currentId={currentId}
          isPoint={false}
          refreshDetail={refreshDetail}
          importChancePointId={currentId}
          formDrawerData={formDrawerData}
          setDrawerVisible={setDrawerVisible}
          drawerVisible={drawerVisible}
          setFormDrawerData={setFormDrawerData}
          // setImportChancePointId={setImportChancePointId}
          updateHandle={updateHandle}
          onSearch={onSearch}/>
        {/* <DetailDrawer
          id={currentId}
          open={drawerVisible}
          setOpen={setDrawerVisible}
          setImportInfo={setImportModalProps}
          setFormDrawerData={setFormDrawerData}
          onSearch={onSearch}
          refreshDetail={refreshDetail}
          setImportChancePointId={setImportChancePointId}
          // setCloseHandle={setCloseHandle}
        /> */}
        {/* 创建/编辑机会点 */}
        {/* <FormDrawer
          drawerData={formDrawerData}
          onSearch={onSearch}
          update={updateHandle}
          closeHandle={() =>
            setFormDrawerData({
              open: false,
              templateId: '', // 模板id
              id: '', // 编辑时的id
            })
          }
        /> */}
        <SelectTemplateModal
          setVisible={setSelectTemplateVisible}
          visible={selectTemplateVisible}
          setFormDrawerData={setFormDrawerData}
        />
        {/* <ImportModal importInfo={importModalProps} setImportInfo={setImportModalProps} /> */}
        {/* <ImportChancePointHistoryModal
          visible={importModalProps.visible}
          importChancePointId={importChancePointId}
          closeHandle={() => {
            setImportModalProps({ visible: false });
          }}
          confirmHandle={() => {
            setImportModalProps({ visible: false });
            onSearch({});
            updateHandle();
          }}
        /> */}
      </V2Container>
    </div>
  );
};

export default Tap;
