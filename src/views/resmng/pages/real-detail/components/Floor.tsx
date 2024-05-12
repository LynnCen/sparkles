import DetailTable from './DetailTable';
import { FC } from 'react';
import { Image } from 'antd';

const { PreviewGroup } = Image;

interface FloorProps {
  columns?: any;
  dataSource?: any[];
}

const Floor: FC<FloorProps> = ({ columns = [], dataSource = [] }) => {
  const newColumns = columns.map(item => {
    const { dataIndex } = item;
    if (dataIndex === 'picture') {
      return {
        ...item,
        render(_: any, record: any) {
          const { picture = [] } = record;
          return (
            <PreviewGroup>
              {picture && picture.map(item => (
                <Image width={60} height={60} src={item.url}></Image>
              ))}
            </PreviewGroup>
          );
        }
      };
    }

    return item;
  });

  return <DetailTable columns={newColumns} dataSource={dataSource}/>;

};

export default Floor;
