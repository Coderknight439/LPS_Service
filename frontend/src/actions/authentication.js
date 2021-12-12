import * as http from '../http';
import jwt_decode from 'jwt-decode';
import setAuthToken from '../setAuthToken';
import {GET_ERRORS, SET_CURRENT_USER, UPDATE_CURRENT_USER} from './types';
import axios from 'axios';
import {headers} from "../utils";

export const loginUser = (user, updateLoggedInStatus) => dispatch => {
    axios.post('/o/login/', user, {
        headers: headers
    })
            .then(res => {
                const { access_token, refresh_token } = res.data;
                localStorage.setItem('jwtToken', access_token);
                localStorage.setItem('refreshToken', refresh_token);
                setAuthToken(access_token);
                const decoded = jwt_decode(access_token);
                dispatch(setCurrentUser(decoded));
            })
            .catch(err => {
                dispatch({
                    type: GET_ERRORS,
                    payload: err?.response?.data
                });
            });
    updateLoggedInStatus();
};

export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    }
};

export const updateCurrentUserData = (decoded) => dispatch => {
    const access_token = localStorage.getItem('jwtToken');
    const existing_data = jwt_decode(access_token);
    existing_data['data'] = {...existing_data.data, ...decoded};
    dispatch(setCurrentUser(existing_data));
};

export const removeExistingErrors = decoded => {
    return {
        type: GET_ERRORS,
        payload: decoded
    }
}

export const logoutUser = (history) => dispatch => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('refreshToken');
    setAuthToken(false);
    dispatch(setCurrentUser({}));
    dispatch(removeExistingErrors({}));
    history?history.push('/'):window.location.href = '/';
};

export const refreshJWT = (history) => dispatch => {
    const refreshToken = localStorage.getItem('refreshToken');
    http.post('/o/refresh_token/', {'token': refreshToken}, {headers: headers})
            .then(res => {
                const { access_token } = res.data;
                localStorage.setItem('jwtToken', access_token);
                setAuthToken(access_token);
                const decoded = jwt_decode(access_token);
                dispatch(setCurrentUser(decoded));
            })
            .catch(err => {
                dispatch({
                    type: GET_ERRORS,
                    payload: err.response.data
                });
                dispatch(logoutUser())
            });
    
}