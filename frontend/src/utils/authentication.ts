import axios from "axios";
import { API_URL } from "./constants";

async function authenticate(username: string, password: string) {
    let response = await axios({
        method: 'post',
        url: API_URL + 'api/token/',
        data: {
          username: username,
          password: password
        }
    });
    return response.data;
}

async function reauthenticate(refresh_token: string) {
    let response = await axios({
        method: 'post',
        url: API_URL + 'api/token/refresh/',
        data: {
          refresh: refresh_token
        }
    });
    return response.data;
}

export { authenticate, reauthenticate }