import React, { FC } from 'react';
import MatchNode from './Node';

interface RenderProps {
  config?:any,
  pRef?:any
}

const Render:FC<RenderProps> = ({ config, pRef }) => {
  return (
    <React.Fragment>
      <MatchNode pRef={pRef} config={config} />
      {config.childNode && <Render pRef={config} config={config.childNode} />}
    </React.Fragment>
  );
};

export default Render;
