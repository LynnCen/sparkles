// / <reference types="node" />
// / <reference types="react" />
// / <reference types="react-dom" />

declare module '*.module.less' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';

declare module '@lhb/regexp';
declare module 'react-color';
