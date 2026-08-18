// import axios from "../../config/axios";

// // ============================================================
// // GET IRRIGATION STATUS
// // GET /irrigation/status?farmId=7&cropId=15
// // ============================================================

// export const getIrrigationStatus = ({ farmId, cropId }) => {
//   return async (dispatch) => {
//     try {
//       const { data } = await axios.get("irrigation/status", {
//         params: {
//           farmId,
//           cropId,
//         },
//       });

//       dispatch({
//         type: "SUCCESS_GET_IRRIGATION_STATUS",
//         payload: data,
//       });

//       return data;
//     } catch (err) {
//       dispatch({
//         type: "ERROR_GET_IRRIGATION_STATUS",
//         payload: err,
//       });

//       throw err;
//     }
//   };
// };

// // ============================================================
// // GET IRRIGATION HISTORY
// // GET /irrigation/history
// // ============================================================

// export const getIrrigationHistory = ({
//   farmId,
//   cropId,
//   page = 1,
//   limit = 20,
// }) => {
//   return async (dispatch) => {
//     try {
//       const { data } = await axios.get("irrigation/history", {
//         params: {
//           farmId,
//           cropId,
//           page,
//           limit,
//         },
//       });

//       dispatch({
//         type: "SUCCESS_GET_IRRIGATION_HISTORY",
//         payload: data,
//       });

//       return data;
//     } catch (err) {
//       dispatch({
//         type: "ERROR_GET_IRRIGATION_HISTORY",
//         payload: err,
//       });

//       throw err;
//     }
//   };
// };

// // ============================================================
// // OVERRIDE IRRIGATION
// // POST /irrigation/override
// // ============================================================

// export const overrideIrrigation = ({ recommendationId, command }) => {
//   return async (dispatch) => {
//     try {
//       const { data } = await axios.post("irrigation/override", {
//         recommendationId,
//         command,
//       });

//       dispatch({
//         type: "SUCCESS_OVERRIDE_IRRIGATION",
//         payload: data,
//       });

//       return data;
//     } catch (err) {
//       dispatch({
//         type: "ERROR_OVERRIDE_IRRIGATION",
//         payload: err,
//       });

//       throw err;
//     }
//   };
// };

// // ============================================================
// // RESUME AUTO
// // POST /irrigation/resume-auto
// // ============================================================

// export const resumeAutoIrrigation = ({ recommendationId }) => {
//   return async (dispatch) => {
//     try {
//       const { data } = await axios.post("irrigation/resume-auto", {
//         recommendationId,
//       });

//       dispatch({
//         type: "SUCCESS_RESUME_AUTO_IRRIGATION",
//         payload: data,
//       });

//       return data;
//     } catch (err) {
//       dispatch({
//         type: "ERROR_RESUME_AUTO_IRRIGATION",
//         payload: err,
//       });

//       throw err;
//     }
//   };
// };

import axios from "../../config/axios";

// ============================================================
// GET IRRIGATION STATUS
// ============================================================

// export const getIrrigationStatus = ({ farmId, cropId }) => {
//   return async (dispatch) => {
//     try {
//       const { data } = await axios.get("irrigation/status", {
//         params: {
//           farmId,
//           cropId,
//         },
//       });

//       dispatch({
//         type: "SUCCESS_GET_IRRIGATION_STATUS",
//         payload: data,
//       });

//       return data;
//     } catch (err) {
//       dispatch({
//         type: "ERROR_GET_IRRIGATION_STATUS",
//         payload: err,
//       });

//       throw err;
//     }
//   };
// };
export const getIrrigationStatus = ({ farmId, cropId }) => {
  return async (dispatch) => {
    try {
      console.log("1. PARAM STATUS:", {
        farmId,
        cropId,
      });

      const { data } = await axios.get("irrigation/status", {
        params: {
          farmId,
          cropId,
        },
      });

      console.log("2. RESPONSE STATUS:", data);

      dispatch({
        type: "SUCCESS_GET_IRRIGATION_STATUS",
        payload: data,
      });

      console.log("3. SUCCESS DISPATCHED");

      return data;
    } catch (err) {
      console.error("ERROR STATUS:", err?.response?.data || err);

      dispatch({
        type: "ERROR_GET_IRRIGATION_STATUS",
        payload: err,
      });

      throw err;
    }
  };
};
// ============================================================
// GET IRRIGATION HISTORY
// ============================================================

export const getIrrigationHistory = ({
  farmId,
  cropId,
  page = 1,
  limit = 20,
}) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get("irrigation/history", {
        params: {
          farmId,
          cropId,
          page,
          limit,
        },
      });

      dispatch({
        type: "SUCCESS_GET_IRRIGATION_HISTORY",
        payload: data,
      });

      return data;
    } catch (err) {
      dispatch({
        type: "ERROR_GET_IRRIGATION_HISTORY",
        payload: err,
      });

      throw err;
    }
  };
};

// ============================================================
// MANUAL OVERRIDE
// ============================================================

export const overrideIrrigation = ({ recommendationId, command }) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.post("irrigation/override", {
        recommendationId,
        command,
      });

      dispatch({
        type: "SUCCESS_OVERRIDE_IRRIGATION",
        payload: data,
      });

      return data;
    } catch (err) {
      dispatch({
        type: "ERROR_OVERRIDE_IRRIGATION",
        payload: err,
      });

      throw err;
    }
  };
};

// ============================================================
// RESUME AUTO
// ============================================================

export const resumeAutoIrrigation = ({ recommendationId }) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.post("irrigation/resume-auto", {
        recommendationId,
      });

      dispatch({
        type: "SUCCESS_RESUME_AUTO_IRRIGATION",
        payload: data,
      });

      return data;
    } catch (err) {
      dispatch({
        type: "ERROR_RESUME_AUTO_IRRIGATION",
        payload: err,
      });

      throw err;
    }
  };
};