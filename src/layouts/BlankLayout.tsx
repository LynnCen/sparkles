import React, { useEffect } from 'react';
import { useDispatch } from 'umi';
import { setUserSpace } from '@/userspace';


const Layout: React.FC = ({ children }) => {

//    const dispatch = useDispatch()

//    useEffect(() => {
//     return () => {
//         if (location.pathname !== '/user/login') {
//             if (dispatch) {
//                 dispatch({
//                   type: 'user/fetchCurrent',
//                 });
//               }   
//         }
//     }
//    })

   return <>{children}</>
};

export default Layout;
