import React from 'react';
const V2SuperEllipse: React.FC<any> = ({
  width = 100,
  height = 100,
  background = '#006AFF',
  ...props
}) => {
  return (
    <div
      style={{
        width,
        height,
        background,
        borderRadius: '43% 57% 43% 57% / 57% 43% 57% 43%',
        transform: 'rotate(-19deg)',
        ...props
      }}
    >
    </div>
  );
};

export default V2SuperEllipse;
