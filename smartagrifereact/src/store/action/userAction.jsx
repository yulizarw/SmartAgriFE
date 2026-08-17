import axios from "../../config/axios";

// export const fetchLogin = (userInfo) => {
//     return (dispatch) => {
//         console.log(userInfo)
//         axios.post(`/user/login`, {
//             email: userInfo.email,
//             password: userInfo.password
//         })
//             .then(({ data }) => {
//                 var userData = data
//                 localStorage.setItem('access_token', userData.access_token)
//                 if (data.user) {
//                   localStorage.setItem("user", JSON.stringify(data.user));
//                 }
//                 dispatch({ type: "USER_LOGIN", payload: userData })
//             })
//             .catch(err => {
//                 alert('Login Gagal')
//             })
//     }
// }


export const fetchLogin = (formData) => {
  return async (dispatch) => {
    try {
      
      const { data } = await axios.post("/user/login", {
        email: formData.email,
        password: formData.password,
      });
     
      // Simpan token
      localStorage.setItem("access_token", data.access_token);

      // Simpan data user kalau tersedia
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
     
      dispatch({
        type: "USER_LOGIN",
        payload: data,
      });

      return {
        success: true,
        data,
      };
    } catch (err) {
      console.error("LOGIN ERROR:", err);

      // Pastikan token lama tidak menyebabkan
      // user dianggap masih login
      localStorage.removeItem("access_token");

      dispatch({
        type: "USER_LOGIN_FAILED",
      });

      return {
        success: false,
        message: err.response?.data?.message || "Email atau password salah",
      };
    }
  };
};

export const logOut = () => {
  return (dispatch) => {
    dispatch({ type: "USER_LOGOUT" });
  };
};

// export const registerUser = (payload) => {
//     return (dispatch) => {

//     }
// }
