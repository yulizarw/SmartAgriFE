import axios from "../../config/axios";

export const getWeatherForecasts =()=> {
    return async (dispatch) => {
        try {
            const {data} = await axios.get("gee/get-weather-history")
             dispatch({
               type: "SUCCESS_GET_FORECAST",
               payload: data.data,
             });

             return data.data;
        } catch (err) {
          dispatch({
            type: "ERROR_GET_FORECAST",
            payload: err,
          });

          throw err;
        }
    }
}