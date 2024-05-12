/**
 * @Description 展开/收起按钮
 */

import { FC } from 'react';
import IconFont from '@/common/components/IconFont';

const ExpandButton: FC<any> = ({
  isExpand,
  setIsExpand
}) => {
  return (
    <div onClick={() => setIsExpand(!isExpand)} className='pointer'>
      <span className='fs-14 c-132 mr-5'>{isExpand ? '收起' : '展开'}</span>
      {isExpand ? <IconFont
        iconHref='iconic_zhankai_seven'
        style={{ width: '12px', height: '12px' }} /> : <IconFont
        iconHref='iconic_shouqi_seven'
        style={{ width: '12px', height: '12px' }} />}
    </div>
  );
};
export default ExpandButton;
