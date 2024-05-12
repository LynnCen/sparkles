import { Space, Row, Col } from 'antd';
import { FC, ReactNode, Key } from 'react';


interface TreeNodeProps {
  title: string;
  icon?: ReactNode;
  onClick?: (key: Key) => void;
}

const TreeNode: FC<TreeNodeProps> = (props) => {
  const { title, icon } = props;

  // const handleMenuClick = (menu: any) => {
  //   const { key } = menu;
  //   onClick?.(key);
  // };

  // const menu = [
  //   {
  //     label: '删除',
  //     key: 'delete',
  //     icon: <DeleteOutlined/>,
  //   },
  // ];

  return (
    <Row gutter={8} justify='space-between'>
      <Col span={24}>
        <Space>
          {icon}
          {title}
        </Space>
      </Col>
      {/* <Col span={4}>
        <Space>
          <Dropdown menu={{ items: menu, onClick: handleMenuClick }} >
            <MoreOutlined />
          </Dropdown>
        </Space>
      </Col> */}
    </Row>
  );
};

export default TreeNode;
