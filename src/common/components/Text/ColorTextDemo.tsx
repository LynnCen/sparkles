import { FC } from 'react';
import ColorText from 'src/common/components/Text/ColorText';

const Component:FC = () => {

  const colorMap = {
    'default': 'primary',
    'submitted': 'warning',
    'approved': 'success',
    'rejected': 'danger',
    'blue': 'blue',
    'green': 'green',
    'orange': 'orange',
    'red': 'red',
    'gray': 'gray',
    '#FF861D': '#FF861D',
    '#006AFF': '#006AFF',
    '#67C239': '#67C239',
    '#F5222D': '#F5222D',
    '#BFBFBF': '#BFBFBF',
    'rgb(255, 134, 29)': 'rgb(255, 134, 29)',
  };

  return (<div>
    <h3>基础用法</h3>
    <ColorText value='颜色文本 #FF861D' colorKey='#FF861D' colorMap={colorMap} />
    <ColorText value='颜色文本 submitted' colorKey='submitted' colorMap={colorMap} />
    <ColorText value='颜色文本 blue' colorKey='blue' colorMap={colorMap} />

    <h3>文本显示颜色</h3>
    <ColorText value='颜色文本 blue' colorKey='blue' colorMap={colorMap} isTextColor />

    <h3>不显示圆点</h3>
    <ColorText value='颜色文本 blue' colorKey='blue' colorMap={colorMap} dot={false} />
    <ColorText value='颜色文本 blue' colorKey='blue' colorMap={colorMap} dot={false} isTextColor />
  </div>);
};

export default Component;
