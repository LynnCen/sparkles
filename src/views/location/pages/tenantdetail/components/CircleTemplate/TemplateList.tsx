import React, {
  useState,
  useRef
} from 'react';
import Operate from '@/common/components/Operate';
import { Button, Typography } from 'antd';

import { post } from '@/common/request';
import { useMethods } from '@lhb/hook';
import { ConfirmModal } from '@/common/components/Modal/ConfirmModal';
import ShowMore from '@/common/components/Data/ShowMore';
import CircleTemplateModal from './CircleTemplateModal';
import { CircleTemplateModalValuesProps } from './ts-config';
import { downloadFile, refactorPermissions } from '@lhb/func';
import V2Table from '@/common/components/Data/V2Table';
import DefineDrawer from './DefineDrawer';
import V2Container from '@/common/components/Data/V2Container';

const { Link } = Typography;

const TemplateList: React.FC<any> = ({ mainHeight, tenantId }) => {
  const [innerMainHeight, setInnerMainHeight] = useState<number>(0);
  const [operateCircleTemplate, setOperateCircleTemplate] = useState<CircleTemplateModalValuesProps>({
    visible: false,
    tenantId,
  });

  const [params, setParams] = useState<any>({});
  const [open, setOpen] = useState(false);// 抽屉开关
  const [id, setId] = useState<number>(0);
  const wrapperRref: any = useRef(null); // 容器dom
  const onSearch = (values?: any) => {
    setParams({ ...values });
  };
  const defaultColumns = [
    {
      title: '模版编号',
      key: 'code',
      dragChecked: true,
      width: 100,
    },
    {
      title: '模版名称',
      key: 'name',
      width: 100,
      dragChecked: true,
      render: (text) => <ShowMore maxWidth='200px' text={text} />,
    },
    {
      title: '说明',
      key: 'remark',
      width: 120,
      dragChecked: true,
      render: (text) => <ShowMore maxWidth='200px' text={text} />,
    },
    {
      title: '导入模版',
      key: 'excelUrl',
      dragChecked: true,
      width: 220,
      render: (text) => (text ? <Link onClick={() => methods.handleLink(text)}>{text}</Link> : '-'),
    },
    {
      title: '操作',
      key: 'permissions',
      width: 200,
      dragChecked: true,
      render: (value: any, record) => (
        <Operate
          showBtnCount={4}
          operateList={refactorPermissions([
            { name: '编辑', event: 'update' },
            { name: '删除', event: 'delete' },
            { name: '模版定义', event: 'define' },
          ])}
          onClick={(btn: any) => {
            methods[btn.func](record);
          }}
        />
      ),
    },
  ];

  const { ...methods } = useMethods({
    handleDefine(record) {
      setOpen(true);
      setId(record.id);
    },

    handleLink(url) {
      downloadFile({
        name: '导入模版',
        url,
      });
    },

    handleUpdate(record) {
      setOperateCircleTemplate({
        visible: true,
        ...record,
      });
    },
    handleCreate() {
      setOperateCircleTemplate({
        visible: true,
        tenantId: tenantId,
      });
    },
    handleDelete(record) {
      ConfirmModal({
        onSure: (modal) => {
          post('/tenant/template/delete', { id: record.id }, { proxyApi: '/blaster' }).then(() => {
            modal.destroy();
            onSearch();
          });
        },
      });
    },
  });

  const loadData = async (params: any) => {
    // https://yapi.lanhanba.com/project/289/interface/api/47123
    const data = await post(
      '/tenant/template/pages',
      { ...params, tenantId },
      { proxyApi: '/blaster', needCancel: false, isMock: false, needHint: true, mockId: 289 }
    );

    return {
      dataSource: data.objectList,
      count: data.totalNum,
    };
  };

  return (
    <>
      <div ref={wrapperRref}>
        <V2Container
          style={{ height: mainHeight }}
          emitMainHeight={(h) => setInnerMainHeight(h)}
          extraContent={{
            top: <Button type='primary' className='mb-16' onClick={methods.handleCreate}>
              新增模版
            </Button>
          }}
        >
          <V2Table
            onFetch={loadData}
            filters={params}
            defaultColumns={defaultColumns}
            tableSortModule='locSAASLocationTenantDetailTemplateList'
            rowKey='id'
            // 勿删! 64：分页模块总大小、48分页模块减去paddingBottom的值、42是table头部
            scroll={{ y: innerMainHeight - 48 - 42 }}
          />
        </V2Container>
      </div>
      <CircleTemplateModal
        operateCircleTemplate={operateCircleTemplate}
        setOperateCircleTemplate={setOperateCircleTemplate}
        onSearch={onSearch}
      />
      {open && <DefineDrawer
        open={open}
        setOpen={setOpen}
        id={id}
        onSearch={onSearch}
      />}
    </>
  );
};

export default TemplateList;
