import { message } from 'antd';
import { downloadFile, refactorPermissions } from '@lhb/func';
import { FC, useMemo, useState } from 'react';
import { useClientSize, useMethods } from '@lhb/hook';
import { OperateButtonProps, Permission } from '@/common/components/Operate/ts-config';
import styles from '../../entry.module.less';
import Operate from '@/common/components/Operate';
import Table from '@/common/components/FilterTable';
import IconFont from '@/common/components/IconFont';
import ImportModal from '@/common/components/business/ImportModal';
import EditModal from './EditModal';
import { V2Confirm } from '@/common/components/Others/V2Confirm';

const CustomerInfo: FC<any> = () => {
  const [data, setData] = useState<any>(
    [
      {
        'id': 1,
        'name': '注册会员',
        'content': '所有会员',
        'url': '客群分析导入模版.xls',
        'urlAddress':
          'https://file.linhuiba.com/FqHbQ4QnJ0OOCa5wixR7sT8ipHUO?attname=客群分析导入模版.xls',
        'permissions': [
          {
            'event': 'industryMap:updateBrand',
            'name': '编辑'
          },
          {
            'event': 'industryMap:deleteBrand',
            'name': '删除'
          },
          {
            'event': 'industryMap:importBrand',
            'name': '导入'
          },
          {
            'event': 'industryMap:exportBrand',
            'name': '导出'
          }
        ]
      },
      {
        'id': 2,
        'name': '所有会员',
        'content': '活跃会员',
        'url': null,
        'permissions': [
          {
            'event': 'industryMap:updateBrand',
            'name': '编辑'
          },
          {
            'event': 'industryMap:deleteBrand',
            'name': '删除'
          },
          {
            'event': 'industryMap:importBrand',
            'name': '导入'
          },
          {
            'event': 'industryMap:exportBrand',
            'name': '导出'
          }
        ]
      },
      {
        'id': 3,
        'name': '订单收件地址',
        'content': '订单收件地址',
        'url': null,
        'permissions': [
          {
            'event': 'industryMap:updateBrand',
            'name': '编辑'
          },
          {
            'event': 'industryMap:deleteBrand',
            'name': '删除'
          },
          {
            'event': 'industryMap:importBrand',
            'name': '导入'
          },
          {
            'event': 'industryMap:exportBrand',
            'name': '导出'
          }
        ]
      }
    ],

  );
  const columns: any[] = [
    { key: 'id', title: '序号', width: 120, render: (value, record, index) => index + 1 },
    { key: 'name', title: '客群名称', width: 120 },
    { key: 'content', title: '客群简介', width: 200 },
    {
      key: 'url', title: '具体信息', width: 120,
      render: (value) => {
        return (value === null ? '-' : (
          <div className={styles.brandBorder}>
            <IconFont iconHref='icon-file_icon_excel' />
            <span className={styles.brandText}>{value}</span>
          </div>
        ));
      }
    },
    {
      key: 'permissions',
      title: '操作',
      fixed: 'right',
      // width: 200,
      width: 100,

      render: (value: Permission[], record) => (
        <Operate
          operateList={refactorPermissions(value)}
          onClick={(btn: OperateButtonProps) => methods[btn.func as string](record)}
        />
      ),
    },
  ];
  // 顶部按钮
  const [operateExtra, setOperateExtra] = useState<any>([]);
  // 控制导入Modal
  const [showImportModal, setShowImportModal] = useState<any>({
    visible: false,
    id: 0
  });
  // 新增/编辑 Modal
  const [editModal, setEditModal] = useState<any>({
    visible: false,
    id: 0
  });
  // 用于刷新table数据
  const [params, setParams] = useState<any>({});

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

  const methods = useMethods({
    handleUpdateBrand: (record) => {
      setEditModal({
        visible: true,
        id: record.id
      });
    },
    handleDeleteBrand: (record) => {
      V2Confirm({ onSure: (modal) => onDelete(modal, record.id), content: '确定删除该客群信息' });
    },
    handleImportBrand: (record) => {
      setShowImportModal({
        visible: true,
        id: record.id
      });
    },
    handleExportBrand: ({ urlAddress }) => {
      if (!urlAddress) {
        message.warning(`请检查是否已导入过客群数据`);
        return;
      };
      downloadFile({
        name: '客群数据',
        url: urlAddress
      });
    },
    handleCreateBrand: () => {
      setEditModal({
        visible: true,
        id: 0
      });
    },
    handleExportAllBrand: () => {
      // message.warning(`请检查是否已导入过客群数据`);
      let flag = false;
      let index = 1;
      for (let i = 0; i < data.length; i++) {
        if (data[i].urlAddress) {
          flag = true;
          setTimeout(() => {
            downloadFile({
              name: `客群数据${index++}`,
              url: data[i].urlAddress,
            });
          }, 100);
        }
      }
      flag || message.warning(`请检查是否已导入过客群数据`);
    }
  });
  const handleRefresh = () => {
    setParams({});
  };
  const onDelete = (modal, id) => {
    const arr: any = [];
    for (let i = 0; i < data.length; i++) {
      let cur;
      if (data[i].id !== id) {
        cur = data[i];
        arr.push(cur);
      }
    }
    setData(arr);
    message.success('删除成功');
    modal.destroy();
    handleRefresh();
  };
  const loadData = async () => {
    if (!operateList.length) {
      setOperateExtra(
        [
          {
            'event': 'industryMap:createBrand',
            'name': '新增客群信息'
          },
          {
            'event': 'industryMap:exportAllBrand',
            'name': '导出客群信息'
          },
        ]);
    }
    return {
      dataSource: data || [],
      count: data.length
    };
  };
  const closeHandle = () => {
    setShowImportModal({
      visible: false,
      id: 0
    });
    handleRefresh();
  };
  const handleFile = (value, id) => {
    const arr: any = [];
    for (let i = 0; i < data.length; i++) {
      let cur = [];
      if (data[i].id === id) {
        cur = { ...data[i], ...value };
      } else {
        cur = data[i];
      }
      arr.push(cur);
    }
    setData(arr);
    handleRefresh();
  };
  const scrollHeight = useClientSize().height - 350;

  return (
    <div className={styles.brandCon}>
      <Operate
        operateList={operateList}
        onClick={(btn) => methods[btn.func]()}
        classNames={styles.operateBtns}
      />
      <Table
        rowKey='id'
        scroll={{ x: 'max-content', y: scrollHeight }}
        onFetch={loadData}
        filters={params}
        columns={columns}
      />
      <ImportModal
        visible={showImportModal.visible}
        closeHandle={closeHandle}
        title='导入客群数据'
        fileName='客群分析导入模版.xls'
        extraParams={{ brandId: showImportModal.id }}
        customFunc={(value) => handleFile(value, showImportModal.id)}
      />
      <EditModal editModal={editModal} setEditModal={setEditModal} onSuccess={handleRefresh} setData={setData} data={data} />

    </div>
  );
};

export default CustomerInfo;
