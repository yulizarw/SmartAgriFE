const initialState ={
    cropHome : {},
    analyzeHome : {},
    listCrop :[]
}

export const cropReducers= (state=initialState,action) =>{
    switch(action.type){
        case "SUCCESS_CROP_HOME":
            return{
                ...state,
                cropHome:action.payload
            }
        case "SUCCESS_ANALYZE_HOME":
            return {
                ...state,
                analyzeHome:action.payload
            }
        case "SUCCESS_GET_LIST":
            return {
                ...state,
                listCrop:action.payload
            }
        // case "SUCCESS_CREATE_CROP":
        //     return{
        //         ...state,
        //         listCrop:
        //     }
        default:
            return state
    }
}