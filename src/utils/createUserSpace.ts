import { AloneUserSpace } from '@/ts_pkc/ts-baselib';
import { setUserSpace } from '@/userspace';
import { useEffect } from 'react';
import { baseURL } from './constants';
import LocalStorage from './localStorage';

const useCreateUserSpace = () => {

    useEffect(() => {
        const us = new AloneUserSpace(new LocalStorage(), baseURL)
        us.init().then(() => setUserSpace(us))
    }, [])

}

export default useCreateUserSpace


