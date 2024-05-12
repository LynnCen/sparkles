/**
 * @Description 我的收藏入口
 */

import { FC, useState } from 'react';
import CollectDrawer from '../CollectDrawer';
// import cs from 'classnames';
// import styles from './entry.module.less';

const Entrance: FC<any> = ({
  customEntry, // 可以自定义进入我的收藏列表按钮部分
  setIsSync,
}) => {
  const [openCollect, setOpenCollect] = useState(false);

  return (
    <>
      {
        customEntry || <div className='c-006 fs-12 pointer' onClick={() => {
          setOpenCollect(true);
          setIsSync(false);
        }}>
          我的收藏
        </div>
      }

      <CollectDrawer
        open={openCollect}
        setOpen={setOpenCollect}
        setIsSync={setIsSync}
      />
    </>
  );
};

export default Entrance;
