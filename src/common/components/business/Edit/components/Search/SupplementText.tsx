/**
 * @Description 指标提示说明文案
 */

import { FC } from 'react';

interface SupplementTextProps {
  text: string;
}

const SupplementText: FC<SupplementTextProps> = ({
  text
}) => {

  return (
    <div className='fs-14 c-959 pl-20'>
      <div>
        门店取值：统计范围为分公司授权地区
      </div>
      <div className='mt-5'>
        指标说明：{text}
      </div>
    </div>
  );
};

export default SupplementText;
