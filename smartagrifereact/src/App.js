import React, { useState, useEffect } from "react";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Redirect,
  Navigate,
} from "react-router-dom";

// screen
import { Login } from "./screen/Login";
import { Home } from "./screen/Home";
import { Register } from "./screen/Register";
import {Farm} from "./screen/Farm"
import {CropHealth} from "./screen/CropHealth"

//router guard
import ProtectedRoute from "./helper/ProtectedRoute";
import LoginProtectedRoute from "./helper/LoginProtectedRoute";

// redux
import { Provider, useSelector } from "react-redux";
import store from "./store/index";

function App() {
  // const [authLogin, setAuthLogin] = useState(false);
  const [authLogin, setAuthLogin] = useState(
    !!localStorage.getItem("access_token"),
  );

  const loginFunction = () => {
    setAuthLogin(true);
  };
  const logOutFunction = () => {
    setAuthLogin(false)
  }
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <LoginProtectedRoute authLogin={authLogin}>
                <Login loginFunction={loginFunction} />
              </LoginProtectedRoute>
            }
          />
          <Route
            exact
            path="/home"
            element={
              <ProtectedRoute authLogin={authLogin}>
                <Home logOutFunction={logOutFunction} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farm"
            element={
              <ProtectedRoute authLogin={authLogin}>
                <Farm logOutFunction={logOutFunction} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/crop-health"
            element={
              <ProtectedRoute authLogin={authLogin}>
                <CropHealth logOutFunction={logOutFunction} />
              </ProtectedRoute>
            }
          />

          {/* <LoginProtectedRoute></LoginProtectedRoute> */}
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
