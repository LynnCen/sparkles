/**
 * @Description : 懒加载组件，将可视窗口外的组件包裹在此组件中，可使组件滚动到在可视窗口内时才加载
 */
import { Spin } from 'antd';
import { Suspense, useState, useRef, useEffect, ReactNode, FC } from 'react';

interface LazyLoadProps{
  /**
   * @description slot插槽
   */
  children: ReactNode;
   /**
   * @description 加载时的占位组件
   * @default <Spin/>
   */
  fallback?: NonNullable<ReactNode>;
}

const LazyLoad:FC<LazyLoadProps> = ({
  fallback = <Spin/>,
  children
}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref :any = useRef();

  useEffect(() => {
    // IntersectionObserver是一个构造函数，用来监听目标元素是否进入视图区域
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { // 如果说进入视图区域
          setIsIntersecting(true); // 设置为true，渲染组件
          observer.disconnect(); // 取消监听
        }
      },
      {
        root: null,
        threshold: 0,
      }
    );

    observer.observe(ref.current);

    // 卸载时取消监听，防止内存泄漏
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {isIntersecting ? (
        <Suspense fallback={fallback}>{children}</Suspense>
      ) : (
        <div ref={ref}></div>
      )}
    </>
  );
};

export default LazyLoad;
