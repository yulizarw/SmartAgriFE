// import React, { useEffect, useState } from 'react';
// import { Route, Navigate } from 'react-router-dom';

// const ProtectedRoute = ({ component: Component, authLogin, ...rest }) => {
//     console.log(authLogin)
//     return (
//         <>
//         <Route {...rest} render={
//             props => {
//                 if (authLogin) {
//                     console.log('masuk')
//                     return <Component {...rest} {...props} />
//                 } else {
//                     return <Navigate to={
//                         {
//                             pathname: '/',
//                             state: {
//                                 from: props.location
//                             }
//                         }
//                     } />
//                 }
//             }
//         } />
//         </>
//     )
// }

// export default ProtectedRoute;

import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ authLogin, children }) => {
  // =========================================
  // BELUM LOGIN
  // Redirect ke halaman login
  // =========================================

  if (!authLogin) {
    return <Navigate to="/" replace />;
  }

  // =========================================
  // SUDAH LOGIN
  // Izinkan masuk ke halaman
  // =========================================

  return children;
};

export default ProtectedRoute;
