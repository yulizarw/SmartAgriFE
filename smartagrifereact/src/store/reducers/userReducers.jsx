const initialState = {
    userLogin: JSON.parse(localStorage.getItem("userLogin")) || null,
}

export const userReducers = (state = initialState, { type, payload }) => {
    switch (type) {
        case"USER_LOGIN":
            return {...state, userLogin: payload}
        case "USER_LOGOUT":
            return initialState;
        default:
            return state
    }
}