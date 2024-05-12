import { TabsProps } from 'antd';

interface option{
  key: any,
  label: any,
};

export interface StateTabProps extends TabsProps {
  options: Array<option>
}
