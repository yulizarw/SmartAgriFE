const initialState ={
    saveHistory:{},
    geeHistories:[]
};

export const geeReducers =(state=initialState,action) => {
    switch (action.type) {
      case "SUCCESS_SAVE_GEE":
        return {
          ...state,
          saveHistory: action.payload,
        };
      case "SUCCESS_GET_HISTORY":
        return {
            ...state,
            geeHistories:action.payload
        }
      default:
        return state;
    }
}