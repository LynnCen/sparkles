/**
 * @Description 重命名
 */
import { FC } from 'react';
import { Space } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import ShowMore from '@/common/components/Data/ShowMore';
// import cs from 'classnames';
// import styles from './entry.module.less';

const Rechristen: FC<any> = ({
  row, // 行数据
  setRechristenData
}) => {

  return (
    <>
      <Space size={10}>
        <div className='ellipsis'>
          <ShowMore
            maxWidth='70px'
            text={row.anotherName}
          />
        </div>
        <EditOutlined
          onClick={() => setRechristenData({ open: true, data: row })}
          className='pointer'
        />
      </Space>
    </>
  );
};

export default Rechristen;
