const initialState = {
  farms: [],
  loading: false,
  error: null,
};

export const farmReducers = (state = initialState, action) => {
  switch (action.type) {
    case "GET_FARMS":
      return {
        ...state,
        farms: action.payload,
      };

    case "ADD_FARM":
      return {
        ...state,
        farms: [...state.farms, action.payload],
      };

    case "UPDATE_FARM":
      return {
        ...state,

        farms: state.farms.map((farm) =>
          farm.id === action.payload.id ? action.payload : farm,
        ),
      };

    case "DELETE_FARM":
      return {
        ...state,

        farms: state.farms.filter((farm) => farm.id !== action.payload),
      };

    default:
      return state;
  }
};


