import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
/**
 * @param onSure 确定
 * @param icon icon
 * @param title  标题
 * @param content  内容
 */
export const ConfirmModal = ({
  onSure,
  icon = <ExclamationCircleOutlined />,
  title = '提示',
  content = '此操作将永久删除该数据, 是否继续？',
}) => {
  const modal = Modal.confirm({
    title: title,
    content: content,
    icon: icon,
    okText: '确定',
    cancelText: '取消',
    onOk: () => onSure(modal),
  });
};
