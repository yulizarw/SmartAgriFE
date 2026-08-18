import { combineReducers } from "redux";
import { userReducers } from './userReducers';
import {farmReducers} from './farmReducers';
import { cropReducers } from "./cropReducers";
import { deviceReducers } from "./deviceReducers";


export default combineReducers({
    userReducers,
    farmReducers,
    cropReducers,
    deviceReducers
})
