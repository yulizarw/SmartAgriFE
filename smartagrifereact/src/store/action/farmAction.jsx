import axios from "../../config/axios";

/*
|--------------------------------------------------------------------------
| GET ALL FARMS
|--------------------------------------------------------------------------
*/

export const fetchFarms = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get("/farm");

      dispatch({
        type: "GET_FARMS",
        payload: data,
      });
    } catch (error) {
      console.error("GET FARMS ERROR:", error);
    }
  };
};

/*
|--------------------------------------------------------------------------
| ADD FARM
|--------------------------------------------------------------------------
*/

export const addFarm = (farmData) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.post("/farm", farmData);

      dispatch({
        type: "ADD_FARM",
        payload: data,
      });

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("ADD FARM ERROR:", error);

      return {
        success: false,
        error,
      };
    }
  };
};

/*
|--------------------------------------------------------------------------
| UPDATE FARM
|--------------------------------------------------------------------------
*/

export const updateFarm = (id, farmData) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.put(`/farm/${id}`, farmData);

      dispatch({
        type: "UPDATE_FARM",
        payload: data,
      });

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("UPDATE FARM ERROR:", error);

      return {
        success: false,
        error,
      };
    }
  };
};

/*
|--------------------------------------------------------------------------
| DELETE FARM
|--------------------------------------------------------------------------
*/

export const deleteFarm = (id) => {
  return async (dispatch) => {
    try {
      await axios.delete(`/farm/${id}`);

      dispatch({
        type: "DELETE_FARM",
        payload: id,
      });

      return {
        success: true,
      };
    } catch (error) {
      console.error("DELETE FARM ERROR:", error);

      return {
        success: false,
        error,
      };
    }
  };
};
