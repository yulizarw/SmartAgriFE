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
import { SensorMonitoring } from "./screen/SensorMonitoring";
import { Gee } from "./screen/Gee";
import { Recommendation } from "./screen/Recommendation";
import { Irrigation } from "./screen/Irrigation";
import { Devices } from "./screen/Devices";
import { GIS } from "./screen/GIS";
import { Crop } from "./screen/Crop";

//router guard
import ProtectedRoute from "./helper/ProtectedRoute";
import LoginProtectedRoute from "./helper/LoginProtectedRoute";

// redux
import { Provider, useSelector } from "react-redux";
import store from "./store/index";

import { createDevice, createSensor,listAllSensor,listDevice, getAllReading, collectDevice } from "../src/store/action/deviceAction";
import { testGeeConnection, analyzeEarthObservation } from "./store/action/geeAction";

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

          <Route
            path="/sensors"
            element={
              <ProtectedRoute authLogin={authLogin}>
                <SensorMonitoring logOutFunction={logOutFunction} listDevice={listDevice} getAllReading={getAllReading} collectDevice={collectDevice} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/climate"
            element={
              <ProtectedRoute authLogin={authLogin}>
                <Gee logOutFunction={logOutFunction} testGeeConnection={testGeeConnection} analyzeEarthObservation={analyzeEarthObservation} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recommendations"
            element={
              <ProtectedRoute authLogin={authLogin}>
                <Recommendation logOutFunction={logOutFunction} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/irrigation"
            element={
              <ProtectedRoute authLogin={authLogin}>
                <Irrigation logOutFunction={logOutFunction} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/devices"
            element={
              <ProtectedRoute authLogin={authLogin}>
                <Devices logOutFunction={logOutFunction} createDevice={createDevice} createSensor={createSensor} listAllSensor={listAllSensor} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gis"
            element={
              <ProtectedRoute authLogin={authLogin}>
                <GIS logOutFunction={logOutFunction} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/crop"
            element={
              <ProtectedRoute authLogin={authLogin}>
                <Crop logOutFunction={logOutFunction}  />
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
