import { createContext } from "react";

type Context = {
  store: { [k: string]: any }; // config[path], townList, loading, ...
  setStore: (arg) => any; // see ./index.tsx - setStore
  [k: string]: any; // see ./handler.ts
};

export default createContext({ store: {}, setStore: (arg) => arg } as Context);
