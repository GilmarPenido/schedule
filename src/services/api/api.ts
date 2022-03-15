import axios from "axios";
import CONSTANTS from "../../constants";


const api = axios.create(/* {
    baseURL: CONSTANTS.IP,
    maxBodyLength: Infinity
} */);

export default api;