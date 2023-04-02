import { AloneUserSpace, AloneUserSpaceSync, DB, MemoryStorage } from "@/ts_pkc/ts-baselib";
import { baseURL } from "@/utils/constants";
import LocalStorage from "@/utils/localStorage";


const userspace: {current: AloneUserSpace | null} = {
    current: createUserSpace() 
};

function createUserSpace (): AloneUserSpace  {
    const us = new AloneUserSpace(new LocalStorage(), baseURL)
    // us.globalDB = new DB('global', new MemoryStorage()) 
    return us
}

export function setUserSpace (us: AloneUserSpace | null) {
    userspace.current = us
}


export default userspace;