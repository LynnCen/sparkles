import { useState } from 'react';

function useVisible(initVisible: boolean | (() => boolean)) {
  const [visible, setVisible] = useState<boolean>(initVisible);

  // 显示弹窗
  const onShow = () => {
    setVisible(true);
  };

  // 隐藏弹窗
  const onHidden = () => {
    setVisible(false);
  };

  return { visible, onShow, onHidden };
};

export default useVisible;
