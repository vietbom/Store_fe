import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:8017/api",
    withCredentials:true
})