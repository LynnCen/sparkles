/**
 * @Description 卡片项
 */
import { FC } from 'react';
import { isNotEmpty } from '@lhb/func';
// import cs from 'classnames';
// import styles from './entry.module.less';

const CardItem: FC<any> = ({
  item
}) => {

  return (
    <div className='ct'>
      <div className='fs-16 bold'>
        { isNotEmpty(item?.value) ? item?.value : '-' }
      </div>
      <div className='fs-12 c-999 mt-6'>
        { item?.label }
      </div>
    </div>
  );
};

export default CardItem;
