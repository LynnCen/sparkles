//
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Children, FC, ReactNode, useEffect, useRef, useState } from 'react';
import './index.less';

interface SliderProps {
  items: ReactNode[];
  children?: ReactNode;
  empty?: ReactNode;
  width?: any;
  height?: any;
}

const Slider: FC<SliderProps> = ({ items, children, empty, width = 400, height = 320 }) => {
  const list = Children.toArray(items);
  const [count, setCount] = useState<number>(0);
  const timeOut = useRef<any>();

  const handleLeft = () => {
    if (count === items.length - 1) {
      setCount(0);
      return;
    }

    setCount(count + 1);
  };

  const handleRight = () => {
    if (count === 0) {
      setCount(items.length - 1);
      return;
    }

    setCount(count - 1);
  };

  useEffect(() => {
    // start();
    return clear;
  }, []);

  // const start = () => {
  //   // clear();
  //   timeOut.current = setInterval(() => {
  //     if (count === items.length - 1) {
  //       setCount(0);
  //     }

  //     setCount(count + 1);
  //   }, 300);
  // };

  const clear = () => {
    clearInterval(timeOut.current as any);
  };

  return (
    <div className='slider'>
      <div className='slider-wrapper' style={{ height }}>
        {
          list.length > 1 && (
            <div className='slider-block-left slider-block' onClick={handleLeft} >
              <RightOutlined />
            </div>
          )
        }
        {
          list.length > 1 && (
            <div className='slider-block-right slider-block' onClick={handleRight}>
              <LeftOutlined />
            </div>
          )
        }
        <div className='slider-content'>
          {list[count] ? list[count]
            : (<div className='empty' style={{ width }}>
              {empty}
            </div>)
          }
          <div className='slider-actions'>{children}</div>
        </div>
      </div>
    </div>
  );



};

export default Slider;
