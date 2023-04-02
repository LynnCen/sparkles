import type { BlStorage } from '@/ts_pkc/ts-baselib';
import { Json } from '@/ts_pkc/ts-json';


class LocalStorage implements BlStorage {
    private readonly storage = localStorage

    async get<T>(key: string, con: T | (new (...args: any[]) => T)): Promise<T | undefined> {
      const has = await this.has(key)
      if (!has) {
        return;
      }
      const item = this.storage.getItem(key);
      // const [res, err] = await new Json().fromJson(item as string, ) 
      // if (!err) {
      //   return res
      // }
      return JSON.parse(item as string);
    }

    async set<T>(key: string, value: T): Promise<void> {    
      let res: string = 
        typeof value === 'string'
          ? value
          : new Json().toJson(value as Object) 

      this.storage.setItem(key, res) 
    }

    async remove(key: string): Promise<void> {
        this.storage.removeItem(key) 
    }

    async has(key: string): Promise<boolean> {
        return this.storage.getItem(key) !== null
    }
}

export default LocalStorage