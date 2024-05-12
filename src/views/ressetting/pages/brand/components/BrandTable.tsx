import Table from '@/common/components/FilterTable';
import Operate from '@/common/components/Operate';
import { useMethods } from '@lhb/hook';
import { post } from '@/common/request';
import { FC } from 'react';
import { Image } from 'antd';
import { V2Confirm } from '@/common/components/Others/V2Confirm';

const operateList = [
  {
    isBatch: false,
    event: 'edit',
    name: '编辑',
    text: '新建',
    func: 'handleEdit',
  },
  {
    isBatch: false,
    event: 'delete',
    name: '删除',
    text: '删除',
    func: 'handleDelete',
  },
];

const BrandTable: FC<any> = ({ loadData, onSearch, setBrandModalInfo, params }) => {
  const columns = [
    { key: 'name', title: '品牌名称' },
    { key: 'id', title: '品牌ID' },
    {
      key: 'level',
      title: '品牌定位',
      width: 200,
      render: (value, record) => {
        const level: string = record.level;
        if (level && level.includes(']')) {
          const levelArr: any = JSON.parse(level);
          let levelStr = '';
          levelArr.forEach((element) => {
            if (Number(element) === 1) {
              levelStr += '高档 ';
            }
            if (Number(element) === 2) {
              levelStr += '中档 ';
            }
            if (Number(element) === 3) {
              levelStr += '低档 ';
            }
          });
          return levelStr;
        }
        return '-';
      },
    },
    {
      key: 'logo',
      title: '品牌logo',
      width: 200,
      render: (value, record) => (record.logo ? <Image width={100} src={record.logo} /> : '-'),
    },
    {
      key: 'permissions',
      title: '操作',
      width: 200,
      render: (value, record) => (
        <Operate operateList={operateList} onClick={(btn: any) => methods[btn.func](record)} />
      ),
    },
  ];

  const { ...methods } = useMethods({
    // 编辑
    handleEdit(record: any) {
      setBrandModalInfo({ ...record, visible: true });
    },
    // 删除
    handleDelete(record: any) {
      V2Confirm({
        onSure: (modal) => {
          post('/resource/brand/delete', { id: record.id }, true).then(() => {
            modal.destroy();
            onSearch();
          });
        },
        content: '此操作将永久删除该数据, 是否继续？'
      });
    },
  });

  return <Table rowKey='id' onFetch={loadData} pagination={true} columns={columns} filters={params} pageSize={100} />;
};

export default BrandTable;
