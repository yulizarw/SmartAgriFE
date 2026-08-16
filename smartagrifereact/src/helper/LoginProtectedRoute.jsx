// import React, { useEffect, useState } from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';

// const LoginProtectedRoute = ({ component: Component, authLogin, ...rest }) => {
//     return (
//         <>
//             <Route {...rest} render={
//                 props => {
//                     if (!authLogin) {
//                         return <Component {...rest} {...props} />
//                     } else {
//                         return <Navigate to={
//                             {
//                                 pathname: '/home',
//                                 state: {
//                                     from: props.location
//                                 }
//                             }
//                         } />
//                     }
//                 }
//             } />
//         </>
//     )
// }
// export default LoginProtectedRoute;

import React from "react";
import { Navigate } from "react-router-dom";

const LoginProtectedRoute = ({
    authLogin,
    children
}) => {

    // Jika SUDAH login,
    // jangan boleh kembali ke halaman login
    if (authLogin) {
        return (
            <Navigate
                to="/home"
                replace
            />
        );

    }

    // Jika BELUM login,
    // tampilkan halaman login
    return children;
};

export default LoginProtectedRoute;