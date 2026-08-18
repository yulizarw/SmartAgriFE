// const initialState = {
//   status: null,
//   history: [],
//   pagination: null,

//   overrideResult: null,
//   resumeResult: null,

//   error: null,
// };

// export const irrigationReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case "SUCCESS_GET_IRRIGATION_STATUS":
//       return {
//         ...state,
//         status: action.payload?.data || null,
//         error: null,
//       };

//     case "ERROR_GET_IRRIGATION_STATUS":
//       return {
//         ...state,
//         error: action.payload,
//       };

//     case "SUCCESS_GET_IRRIGATION_HISTORY":
//       return {
//         ...state,
//         history: Array.isArray(action.payload?.data) ? action.payload.data : [],
//         pagination: action.payload?.pagination || null,
//         error: null,
//       };

//     case "ERROR_GET_IRRIGATION_HISTORY":
//       return {
//         ...state,
//         error: action.payload,
//       };

//     case "SUCCESS_OVERRIDE_IRRIGATION":
//       return {
//         ...state,
//         overrideResult: action.payload,
//         error: null,
//       };

//     case "ERROR_OVERRIDE_IRRIGATION":
//       return {
//         ...state,
//         error: action.payload,
//       };

//     case "SUCCESS_RESUME_AUTO_IRRIGATION":
//       return {
//         ...state,
//         resumeResult: action.payload,
//         error: null,
//       };

//     case "ERROR_RESUME_AUTO_IRRIGATION":
//       return {
//         ...state,
//         error: action.payload,
//       };

//     default:
//       return state;
//   }
// };

const initialState = {
  status: null,

  history: [],

  pagination: {
    page: 1,
    limit: 20,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },

  overrideResult: null,

  resumeResult: null,

  error: null,
};

export const irrigationReducer= (state = initialState, action) =>{
  switch (action.type) {
    // =========================================================
    // STATUS
    // =========================================================

    case "SUCCESS_GET_IRRIGATION_STATUS":
      return {
        ...state,

        status: action.payload?.data || null,

        error: null,
      };

    case "ERROR_GET_IRRIGATION_STATUS":
      return {
        ...state,

        error: action.payload,
      };

    // =========================================================
    // HISTORY
    // =========================================================

    case "SUCCESS_GET_IRRIGATION_HISTORY":
      return {
        ...state,

        history: Array.isArray(action.payload?.data) ? action.payload.data : [],

        pagination: action.payload?.pagination || {
          page: 1,
          limit: 20,
          totalItems: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },

        error: null,
      };

    case "ERROR_GET_IRRIGATION_HISTORY":
      return {
        ...state,

        error: action.payload,
      };

    // =========================================================
    // OVERRIDE
    // =========================================================

    case "SUCCESS_OVERRIDE_IRRIGATION":
      return {
        ...state,

        overrideResult: action.payload,

        error: null,
      };

    case "ERROR_OVERRIDE_IRRIGATION":
      return {
        ...state,

        error: action.payload,
      };

    // =========================================================
    // RESUME AUTO
    // =========================================================

    case "SUCCESS_RESUME_AUTO_IRRIGATION":
      return {
        ...state,

        resumeResult: action.payload,

        error: null,
      };

    case "ERROR_RESUME_AUTO_IRRIGATION":
      return {
        ...state,

        error: action.payload,
      };

    default:
      return state;
  }
}