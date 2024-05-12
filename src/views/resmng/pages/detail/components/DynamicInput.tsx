import { InputProps } from 'antd';
import Input from 'rc-input';
import { FC } from 'react';

interface DynamicInputProps extends InputProps {

}

const DynamicInput: FC<DynamicInputProps> = (props) => {
  return (<Input {...props}/>);

};

export default DynamicInput;
