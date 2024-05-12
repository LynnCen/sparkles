import { FC } from 'react';
import { Empty } from 'antd';
import { EmptyExtraProps } from './ts-config';

/**
 * 空状态
 * @description 空状态时的展位组件，属性基于 <a href="https://ant.design/components/empty-cn#api" target="_blank">Ant Design Empty 空状态
</a>。
 * @category Basic
 * @demo
import Empty from 'src/common/components/Empty/index';

<Empty description='页面不见啦~' />
 */
const CustomerEmpty: FC<EmptyExtraProps> = ({ description = '暂无数据', config }) => {
  return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={description} {...config} />;
};

export default CustomerEmpty;
