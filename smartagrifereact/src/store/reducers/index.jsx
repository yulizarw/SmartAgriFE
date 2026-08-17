import { combineReducers } from "redux";
import { userReducers } from './userReducers';
import {farmReducers} from './farmReducers';
import { cropReducers } from "./cropReducers";
// import { kaprodiReducers } from './kaprodiReducers'
// import { adminReducers } from "./adminReducers";
// import { dikjarReducers } from "./dikjarReducers";
// import { dospemReducers } from "./dospemReducers";
// import { mahasiswaReducers } from "./mahasiswaReducers";
// import { pembimbingInstansiReducers } from "./pembimbingInstansiReducers"

export default combineReducers({
    userReducers,
    farmReducers,
    cropReducers
    // adminReducers,
    // dikjarReducers,
    // dospemReducers,
    // mahasiswaReducers,
    // pembimbingInstansiReducers,
})