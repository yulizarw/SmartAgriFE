import axios from "../../config/axios";

/*
|--------------------------------------------------------------------------
| GET ALL FARMS
|--------------------------------------------------------------------------
*/

export const fetchFarms = (access_token) => {
  return async (dispatch) => {
    try {
      
      const { data } = await axios.get("/patriot/list-farm"
        ,{
        headers:{
          access_token
        }
      }
    );

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

export const addFarm = ({farmData, access_token}) => {
  return async (dispatch) => {

   
    try {
      const { data } = await axios.post("patriot/create-farm", farmData, {
        headers: {
          access_token,
        },
      });

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

export const updateFarm = (id, farmData,access_token) => {
  return async (dispatch) => {
    console.log(id)
    try {
      const { data } = await axios.patch(`patriot/update-farm/${id}`, farmData, {
        headers: {
          access_token,
        },
      });

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

export const deleteFarm = (id,access_token) => {
  return async (dispatch) => {
    try {
      await axios.delete(`patriot/delete-farm/${id}`, {
        headers: {
          access_token,
        },
      });

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
