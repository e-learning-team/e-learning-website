import axios from 'axios';
import { apiRefreshToken } from './refreshToken';
import { useDispatch, useSelector } from "react-redux";
import { logout, updateToken } from '../store/User/userSlice';
import { store } from '../store/configureStore';
import { apiLogOut } from './user';
const instance = axios.create({
    baseURL: 'https://haovo.cloud/e-learning/api',
    'Content-Type': 'application/json',
});
let isRefreshing = false;
instance.interceptors.request.use(function (config) {
    const accessToken = store.getState().user.token;
    if (accessToken && config.headers.hasOwnProperty('Authorization'))
        config.headers = {
            ...config.headers,
            'Authorization': `Bearer ${accessToken}`
        };
    return config;
}, function (error) {
    console.log("request---" + error);
    return Promise.reject(error);
});

instance.interceptors.response.use(async function (response) {
    if (response?.data?.status == 0 && response?.data?.message == "JWT_ERROR") {
        console.log("---JWT_ERROR---");
        await apiLogOut();
        store.dispatch(logout());
    }
    return response?.data;
}, async function (error) {

    console.log("response status code---" + error.response.status);
    console.log("response config---" + error.config);
    const prevRequest = error?.config;
    if (error.response && error?.response?.status === 401 && !prevRequest?.sent) {
        prevRequest.sent = true;

        if (!isRefreshing) {
            isRefreshing = true;
            try {
                const resp = await apiRefreshToken();

                if (resp?.data?.token) {
                    store.dispatch(updateToken(resp?.data?.token));
                    // Retry the failed request with the new token
                    prevRequest.headers['Authorization'] = `Bearer ${resp.data.token}`;
                    return instance(prevRequest);
                } else {
                    store.dispatch(logout());
                }
            } catch (refreshError) {
                console.log("Refresh token request failed:", refreshError);
                store.dispatch(logout());
            } finally {
                isRefreshing = false;
            }
        } else {
            // If another request is already refreshing the token, wait for that request to complete
            await new Promise(resolve => {
                const interval = setInterval(() => {
                    if (!isRefreshing) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 100);
            });
            // Retry the failed request with the new token
            return instance(prevRequest);
        }
    }
    return Promise.reject(error);
});

export default instance;