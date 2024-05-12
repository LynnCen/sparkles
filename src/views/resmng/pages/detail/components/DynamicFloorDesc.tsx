// import { ConfirmModal } from '@/common/components/Modal/ConfirmModal';
// import Operate from '@/common/components/Operate';
// import { useMethods } from '@lhb/hook';
import { /* Button, Space, */Image, Table } from 'antd';
import { FC/*, useState*/ } from 'react';
// import { FloorDescModalInfo } from '../ts-config';
// import FloorDescModal from './Modal/FloorDescModal';
import { deepCopy } from '@lhb/func';
import { QiniuImageUrl } from '@/common/utils/qiniu';

// !!! 暂时不要删除文件内的注释代码 0202资源服务wap开发了楼层平面图功能，对PC端有影响，暂时隐藏新增、编辑、删除功能

// const operateList = [
//   {
//     isBatch: false,
//     event: 'edit',
//     name: '编辑',
//     text: '新建',
//     func: 'handleEdit',
//   },
//   {
//     isBatch: false,
//     event: 'delete',
//     name: '删除',
//     text: '删除',
//     func: 'handleDelete',
//   },
// ];

const DynamicFloorDesc: FC<any> = ({ value/*, onChange*/ }) => {
  const columns = [
    { key: 'floor', dataIndex: 'floor', title: '所在楼层' },
    {
      key: 'picture',
      title: '楼层平面图',
      render: (value, record) => {
        return (
          <>
            {record.picture.map((item) => {
              return <Image width={100} src={QiniuImageUrl(item.url)} key={Math.random()} />;
            })}
          </>
        );
      },
    },
    // {
    //   key: 'permissions',
    //   title: '操作',
    //   render: (value, record) => (
    //     <Operate operateList={operateList} onClick={(btn: any) => methods[btn.func](record)} />
    //   ),
    // },
  ];
  // const [floorDescModalInfo, setFloorDescModalInfo] = useState<FloorDescModalInfo>({ visible: false });
  // const [data, setData] = useState<any>([]);

  // const { add, ...methods } = useMethods({
  //   add() {
  //     setFloorDescModalInfo({ visible: true });
  //   },
  //   // 编辑
  //   handleEdit(record: any) {
  //     setFloorDescModalInfo({ ...record, visible: true });
  //   },
  //   // 删除
  //   handleDelete(record: any) {
  //     ConfirmModal({
  //       onSure: (modal) => {
  //         const filterData = data.filter((item) => item.id !== record.id);
  //         setData(filterData);
  //         modal.destroy();
  //       },
  //     });
  //   },
  // });

  return (
    <>
      {/* <Space style={{ marginBottom: 10 }}>
        <Button type='primary' onClick={add}>
          新增
        </Button>
      </Space> */}
      <Table rowKey='id' dataSource={value ? deepCopy(value.floorDescriptionList) : []} columns={columns} pagination={false} size='small' />
      {/* <FloorDescModal
        data={data}
        onChange={onChange}
        floorDescModalInfo={floorDescModalInfo}
        setFloorDescModalInfo={setFloorDescModalInfo}
      /> */}
    </>
  );
};

export default DynamicFloorDesc;
