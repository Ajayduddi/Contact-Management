import axios from 'axios'
import { Api } from '../constants/constants'

const api = axios.create({
    baseURL: Api.BASE_URL,
    withCredentials: true,
    headers: {
        'Authorization': localStorage.getItem('token')
    },

});

class loginService {

    static instance = null;

    // create a single ton instance
    constructor() {
        if (loginService.instance) {
            return loginService.instance;
        }

        loginService.instance = this;
    }

    // method to get the instance
    static getInstance() {
        if (!loginService.instance) {
            loginService.instance = new loginService();
        }
        return loginService.instance;
    }

    login = async (data) => {
        try {
            const response = await api.post(Api.API_ENDPOINT.LOGIN, data);
            return response.data;
        } catch (error) {
            console.error("Login Error:", error.response.data.message);
            return null;
        }
    };

    createUser = async (data) => {
        try {
            const response = await api.post(Api.API_ENDPOINT.CREATE_USER, data);
            return response.data;
        } catch (error) {
            throw new Error(JSON.stringify(error.response.data.message))
        }
    };

    isAuth = async () => {
        try {
            const response = await api.get(Api.API_ENDPOINT.IS_AUTH);
            return response.data.result;
        } catch (error) {
            console.error("Auth Check Error:", error.response.data.message);
            throw new Error("null")
        }
    };

}

export default loginService.getInstance();