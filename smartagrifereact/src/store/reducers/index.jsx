import { combineReducers } from "redux";
import { userReducers } from './userReducers';
import {farmReducers} from './farmReducers';
import { cropReducers } from "./cropReducers";
import { deviceReducers } from "./deviceReducers";
import { geeReducers } from "./geeReducers";
import { weatherReducers } from "./weatherReducers";
import {irrigationReducer} from "./irrigationReducer"


export default combineReducers({
    userReducers,
    farmReducers,
    cropReducers,
    deviceReducers,
    geeReducers,
    weatherReducers,
    irrigation:irrigationReducer
})
