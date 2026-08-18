const initialState = {

    weatherForecasts: [],
};

export const weatherReducers =(state=initialState,action) => {
    switch (action.type) {
      case "SUCCESS_GET_FORECAST":
        return {
          ...state,
          weatherForecasts: action.payload,
        };

      default:
        return state;
    }
}