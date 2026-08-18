import axios from "../../config/axios";

export const listDevice = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get("/devices/fetch");

      dispatch({
        type: "SUCCESS_GET_DEVICES",
        payload: data,
      });

      return data;
    } catch (err) {
      dispatch({
        type: "ERROR_GET_DEVICES",
        payload: err,
      });

      throw err;
    }
  };
};

export const searchSensorDevice = (deviceId) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`/devices/fetch-sensors/${deviceId}`);
      dispatch({
        type: "SUCCESS_GET_SENSOR_DEVICES",
        payload: data,
      });

      return data;
    } catch (err) {
      dispatch({
        type: "ERROR_GET_SENSOR_DEVICES",
        payload: err,
      });

      throw err;
    }
  };
};

export const createDevice = (access_token, payload) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.post("patriot/create-device", payload, {
        headers: {
          access_token,
        },
      });
      dispatch({
        type: "SUCCESS_CREATE_DEVICES",
        payload: data,
      });

      return data;
    } catch (err) {
      dispatch({
        type: "ERROR_CREATE_DEVICES",
        payload: err,
      });

      throw err;
    }
  };
};

export const createSensor = (payload) => {
  return async (dispatch) => {
    try {
      // console.log(access_token,'aksi')
      const { data } = await axios.post("patriot/create-sensor", payload, {
        headers: {
          access_token: payload.access_token,
        },
      });
      dispatch({
        type: "SUCCESS_CREATE_SENSOR",
        payload: data,
      });

      return data;
    } catch (err) {
      dispatch({
        type: "ERROR_CREATE_SENSOR",
        payload: err,
      });

      throw err;
    }
  };
};

export const listAllSensor = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get("devices/fetch-sensors");

      dispatch({
        type: "SUCCESS_GET_SENSOR",
        payload: data,
      });

      return data;
    } catch (err) {
      dispatch({
        type: "ERROR_GET_SENSOR",
        payload: err,
      });

      throw err;
    }
  };
};

export const getAllReading = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get("iot/get-reading");
      dispatch({
        type: "SUCCESS_GET_READINGS",
        payload: data,
      });

      return data;
    } catch (err) {
      dispatch({
        type: "ERROR_GET_READINGS",
        payload: err,
      });

      throw err;
    }
  };
};

export const collectDevice = (id) => {
  return async (dispatch) => {
    try {
      const { data } = await axios(`iot/reading/${id}`);
      console.log(data)
      dispatch({
        type: "SUCCESS_GET_READINGS_PER_DEVICE",
        payload: data,
      });

      return data;
    } catch (err) {
      dispatch({
        type: "ERROR_READINGS",
        payload: err,
      });

      throw err;
    }
  };
};
