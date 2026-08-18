import axios from "../../config/axios";

export const testGeeConnection = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get("gee/test");
      dispatch({
        type: "SUCCESS_TEST_CONNECTION",
        payload: data,
      });

      return data;
    } catch (err) {
      dispatch({
        type: "ERROR_TEST_CONNECTION",
        payload: err,
      });

      throw err;
    }
  };
};

export const analyzeEarthObservation = (params) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.post("gee/history");
      dispatch({
        type: "SUCCESS_SAVE_GEE",
        payload: data,
      });

      return data;
    } catch (err) {
      dispatch({
        type: "ERROR_SAVE_GEE",
        payload: err,
      });

      throw err;
    }
  };
};

export const getGeeHistories = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get("gee/get-history");
      dispatch({
        type: "SUCCESS_GET_HISTORY",
        payload: data.data,
      });
      return data.data;
    } catch (err) {
      dispatch({
        type: "ERROR_GET_HISTORY",
        payload: err,
      });

      throw err;
    }
  };
};
