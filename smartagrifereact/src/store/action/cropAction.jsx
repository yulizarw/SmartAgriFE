import axios from "../../config/axios";

// get crop health untuk home
export const cropHealthHome = (id) => {
  return async (dispatch) => {
    axios
      .get(`cropHealth/list-crophealth/${id}`)
      .then(({ data }) => {
        dispatch({ type: "SUCCESS_CROP_HOME", payload: data });
      })
      .catch((err) => {
        dispatch({ type: "ERROR_GET_CROP_HOME", payload: err });
      });
  };
};

export const cropHealthAnalyzeHome = ({ farmId, cropId }) => {
  return async (dispatch) => {
    const today = new Date().toISOString().split("T")[0];
    const formData = {
      farmId,
      cropId,
      date: today,
    };

    axios
      .post("cropHealth/analyze", formData)
      .then(({ data }) => {
        dispatch({ type: "SUCCESS_ANALYZE_HOME", payload: data });
      })
      .catch((err) => {
        console.log(err);
        dispatch({ type: "ERROR_ANALYZE_HOME", payload: err });
      });
  };
};

export const cropLists = (access_token) => {
  return async (dispatch) => {
    axios
      .get("patriot/list-crop", {
        headers: {
          access_token,
        },
      })
      .then(({ data }) => {
        dispatch({ type: "SUCCESS_GET_LIST", payload: data });
      })
      .catch((err) => {
        console.log(err);
        dispatch({ type: "ERROR_GET_LIST", payload: err });
      });
  };
};


export const createCrop = (payload, access_token) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.post(`patriot/create-crop`, payload, {
        headers: {
          access_token,
        },
      });

      dispatch({
        type: "SUCCESS_CREATE_CROP",
        payload: data,
      });

      return data;
    } catch (err) {
      console.error("CREATE CROP ERROR:", err);

      dispatch({
        type: "ERROR_CREATE_CROP",
        payload: err,
      });

      throw err;
    }
  };
};

export const updateCrop = (id, payload, access_token) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.patch(`patriot/update-crop/${id}`, payload, {
        headers: {
          access_token,
        },
      });

      dispatch({
        type: "SUCCESS_UPDATE_CROP",
        payload: data,
      });

      return data;
    } catch (err) {
      console.error("UPDATE CROP ERROR:", err);

      dispatch({
        type: "ERROR_UPDATE_CROP",
        payload: err,
      });

      throw err;
    }
  };
};

export const deleteCrop = (id, access_token) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.delete(`patriot/delete-crop/${id}`, {
        headers: {
          access_token,
        },
      });

      dispatch({
        type: "SUCCESS_DELETE_CROP",
        payload: data,
      });

      return data;
    } catch (err) {
      console.error("DELETE CROP ERROR:", err);

      dispatch({
        type: "ERROR_DELETE_CROP",
        payload: err,
      });

      throw err;
    }
  };
};
