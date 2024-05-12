import { DeleteOutlined, EditOutlined, MoreOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Space, Button, Tooltip, Row, Col, Dropdown } from 'antd';
import { FC, ReactNode, Key } from 'react';


interface TreeNodeProps {
  title: string;
  icon?: ReactNode;
  onClick?: (key: Key) => void;
}

const actions = [
  {
    title: '编辑',
    icon: <EditOutlined />,
    key: 'edit'
  },
];


const TreeNode: FC<TreeNodeProps> = (props) => {
  const { title, icon, onClick } = props;

  const handleMenuClick = (menu: any) => {
    const { key } = menu;
    onClick?.(key);
  };

  const menu = [
    {
      label: '删除',
      key: 'delete',
      icon: <DeleteOutlined/>,
    },
    {
      label: '新增',
      key: 'add',
      icon: <PlusCircleOutlined />,
    },
  ];

  return (
    <Row gutter={8} justify='space-between'>
      <Col span={16}>
        <Space>
          {icon}
          {title}
        </Space>
      </Col>
      <Col span={8}>
        <Space>
          {actions.map(action => {
            const { title, icon, key } = action;
            const handleClick = () => {
              // 阻止冒泡由于点击需要触发列表
              // e.stopPropagation();
              onClick?.(key);
            };
            return (
              <Tooltip
                title={title}
                key={key}>
                <Button
                  size='small'
                  shape='circle'
                  onClick={handleClick}
                  type='text'>
                  {icon}
                </Button>
              </Tooltip>
            );
          })}
          <Dropdown menu={{ items: menu, onClick: handleMenuClick }} >
            <MoreOutlined />
          </Dropdown>
        </Space>
      </Col>
    </Row>
  );
};

export default TreeNode;
