import { combineReducers } from "redux";
import { userReducers } from './userReducers';
import {farmReducers} from './farmReducers'
// import { kaprodiReducers } from './kaprodiReducers'
// import { adminReducers } from "./adminReducers";
// import { dikjarReducers } from "./dikjarReducers";
// import { dospemReducers } from "./dospemReducers";
// import { mahasiswaReducers } from "./mahasiswaReducers";
// import { pembimbingInstansiReducers } from "./pembimbingInstansiReducers"

export default combineReducers({
    userReducers,
    farmReducers
    // adminReducers,
    // dikjarReducers,
    // dospemReducers,
    // mahasiswaReducers,
    // pembimbingInstansiReducers,
})