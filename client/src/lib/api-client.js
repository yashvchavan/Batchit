import axios from "axios";
import {HOST, SIGNUP_ROUTE} from "../../utils/constants.js";

export const apiClient = axios.create({
    baseURL: HOST,
    withCredentials: true,
});


