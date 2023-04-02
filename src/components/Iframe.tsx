import { useEffect, useRef } from "react";

export const Iframe = ({ onLoad, ...rest }) => {
  const ifr = useRef({});
  useEffect(
    () => {
      ifr.current && ifr.current.addEventListener("load", onLoad);
    },
    [ifr]
  );
  return (
    <iframe ref={ifr} width="100%" height="100%" frameBorder="0" {...rest} />
  );
};
