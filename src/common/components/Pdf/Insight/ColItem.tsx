import React, { FC, useEffect } from 'react';
import { Col } from 'antd';
import { isNotEmpty } from '@lhb/func';
import cs from 'classnames';

interface ColItemProps {
  className?: string;
  label?: string;
  labelVal?: string;
  span?: number;
  unit?: string;
  children?: React.ReactNode;
  hasRB?: boolean;
}

const ColItem: FC<ColItemProps> = ({
  className = 'ct',
  label,
  labelVal,
  unit,
  children,
  span = 8,
  hasRB = true
}) => {

  // const [state, setState] = useState<>();

  useEffect(() => {

  }, []);

  return (
    <Col span={span} className={cs(className, hasRB ? 'rightBr' : '')}>
      { children ||
      <>
        <div className='fs-17 bold'>
          { isNotEmpty(labelVal) ? labelVal : '-' }
          <span className='fs-13 fwNormal'> {unit}</span>
        </div>
        <div className='fs-13 cOpaWhite'>
          {label}
        </div>
      </>
      }
    </Col>
  );
};

export default ColItem;
