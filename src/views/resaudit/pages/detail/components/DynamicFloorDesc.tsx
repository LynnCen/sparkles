import { Image, Table } from 'antd';
import { FC } from 'react';
import { deepCopy } from '@lhb/func';
import { QiniuImageUrl } from '@/common/utils/qiniu';

const DynamicFloorDesc: FC<any> = ({ value }) => {
  const data = JSON.parse(value);

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
    }
  ];

  return (
    <>
      <Table
        rowKey='id'
        dataSource={data && data.floorDescriptionList ? deepCopy(data.floorDescriptionList) : []}
        columns={columns}
        pagination={false}
        size='small' />
    </>
  );
};

export default DynamicFloorDesc;
