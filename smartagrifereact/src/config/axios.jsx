import axios from 'axios'

const instance = axios.create({
  // baseURL:'http://localhost:3001/'
  baseURL: "http://16.170.252.125",
});

export default instance