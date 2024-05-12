import { FC, useState } from 'react';
import styles from './entry.module.less';
import { useMethods } from '@lhb/hook';
import V2Container from '@/common/components/Data/V2Container';
import PageTitle from '@/common/components/business/PageTitle';
import V2Operate from '@/common/components/Others/V2Operate';
import FranchiseeSelectTemplate from '@/common/components/business/ExpandStore/FranchiseeSelectTemplate';
import FranchiseeCreateDrawer from '@/common/components/business/ExpandStore/FranchiseeCreateDrawer';
import FranchiseeDetailDrawer from '@/common/components/business/ExpandStore/FranchiseeDetailDrawer';
import Filter from './components/Filter';
import List from './components/List';
import { isArray, refactorPermissions, refactorSelection } from '@lhb/func';
import { getFranchiseeTemplateList } from '@/common/api/expandStore/franchisee';

const Franchisee: FC<any> = () => {
  const [mainHeight, setMainHeight] = useState<number>(0);
  const [filters, setFilters] = useState<any>(); // 参数变化的时候会触发请求更新table表格
  const [detailData, setDetailData] = useState<any>({
    open: false,
  }); // 加盟商详情数据
  const [selectTemplateData, setSelectTemplateData] = useState<any>({
    open: false,
    options: [],
  });
  const [formDrawerData, setFormDrawerData] = useState<any>({
    open: false,
    templateId: '', // 模板id
    id: '', // 编辑时的id
  });

  /**
   * @description 点击搜索框模糊查询
   * @param fields 搜索框参数
   */
  const onSearch = (value: any) => {
    setFilters({ ...value });
  };

  /**
   * @description 点击名称查看拓店任务详情
   * @param record 当前选中点击某一行的数据
   */
  const onClickDetail = (record: any) => {
    setDetailData({
      open: true,
      id: record.id,
    });
  };

  const methods = useMethods({
    async handleCreate() {
      // 多条模板时需要选择，只有一条时直接使用
      const result: any = await getFranchiseeTemplateList();
      if (isArray(result) && result.length === 1) {
        setFormDrawerData({
          open: true,
          templateId: result[0].id,
          id: '',
        });
      } else if (isArray(result) && result.length > 1) {
        setSelectTemplateData({
          open: true,
          options: refactorSelection(result, { name: 'templateName' }),
        });
      }
    },
  });

  return (
    <div className={styles.container}>
      <V2Container
        // 上下padding各16px  container内部padding上下padding各24px 标题height 48px
        style={{ height: 'calc(100vh - 32px - 48px - 48px)' }}
        emitMainHeight={h => setMainHeight(h)}
        extraContent={{
          top: (
            <>
              <PageTitle content='加盟商管理' extra={
                <V2Operate operateList={refactorPermissions([{
                  event: 'create',
                  name: '新增加盟商',
                }]).map(itm => ({ ...itm, type: 'primary' }))} onClick={(btn) => methods[btn.func]()}/>
              }/>
              <Filter onSearch={onSearch}/>
            </>
          ),
        }}
      >
        <>
          <List
            mainHeight={mainHeight}
            filters={filters}
            onClickDetail={onClickDetail}
          />
          <FranchiseeDetailDrawer
            detailData={detailData}
            setDetailData={setDetailData}
            onSearch={onSearch}
          />
          {/* 模版选择框  */}
          <FranchiseeSelectTemplate
            templateData={selectTemplateData}
            setTemplateData={setSelectTemplateData}
            setFormDrawerData={setFormDrawerData}
          />
          <FranchiseeCreateDrawer
            drawerData={formDrawerData}
            setDrawerData={setFormDrawerData}
            onCreated={() => onSearch({})}
          />
        </>
      </V2Container>
    </div>
  );
};

export default Franchisee;
