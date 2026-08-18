import { listAllSensor } from "../action/deviceAction";

const initialState = {
  listDevices: [],
  sensorDevices: [],
  listAllSensors: [],
  allReadings :[]
};

export const deviceReducers = (state = initialState, action) => {
  switch (action.type) {
    case "SUCCESS_GET_DEVICES":
      return {
        ...state,
        listDevices: action.payload,
      };
    case "SUCCESS_GET_SENSOR_DEVICES":
      return {
        ...state,
        sensorDevices: action.payload,
      };
    case "SUCCESS_GET_SENSOR":
      return {
        ...state,
        listAllSensors: action.payload,
      };
    case "SUCCESS_GET_READINGS":
      return{
        ...state,
        allReadings:action.payload
      }
    default:
      return state;
  }
};
