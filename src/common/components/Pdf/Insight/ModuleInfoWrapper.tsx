import React, { FC } from 'react';
import { Divider } from 'antd';

interface ModuleInfoWrapperProps {
  className?: string;
  title?: string;
  children?: React.ReactNode;
  hasDivider?: boolean;
}
const ModuleInfoWrapper: FC<ModuleInfoWrapperProps> = ({
  className,
  title,
  children,
  hasDivider = true
}) => {
  return (
    <div className={className} style={{ width: '100%' }}>
      <div className='fs-19 bold'>
        { title }
      </div>
      {children}
      {
        hasDivider && <Divider style={{ borderColor: 'rgba(255,255,255,0.23)' }}/>
      }
    </div>
  );
};

export default ModuleInfoWrapper;
