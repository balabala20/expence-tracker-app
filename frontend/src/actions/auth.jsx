import axios from 'axios';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT
} from './types';
import setAuthToken from '../utils/setAuthToken';
import { setAlert } from './alert';

const API_URL = 'https://expence-tracker-backend-w1v0.onrender.com' || 'http://localhost:5000';
// Load User - Checks for a token and gets user data
export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get(`${API_URL}/api/auth`);
    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

// Register User
export const register = ({ name, email, password, avatar }) => async dispatch => {
  const config = { headers: { 'Content-Type': 'application/json' } };
  const body = JSON.stringify({ name, email, password, avatar }); // Add avatar

  try {
    // FIX: Use the full API_URL for the registration request
    const res = await axios.post(`${API_URL}/api/auth/register`, body, config);
    dispatch({ type: REGISTER_SUCCESS, payload: res.data });
    dispatch(loadUser());
  } catch (err) {
    const message = err.response.data.msg;
    if (message) {
      dispatch(setAlert(message, 'danger'));
    }
    dispatch({ type: REGISTER_FAIL });
  }
};
// Login User
export const login = (email, password) => async dispatch => {
    const config = { headers: { 'Content-Type': 'application/json' } };
    const body = JSON.stringify({ email, password });
    try {
        const res = await axios.post(`${API_URL}/api/auth/login`, body, config);
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });
        dispatch(loadUser());
    } catch (err) {
        const message = err.response.data.msg;
        if (message) {
          dispatch(setAlert(message, 'danger'));
        }
        dispatch({ type: LOGIN_FAIL });
    }
};

// Logout
export const logout = () => ({ type: LOGOUT });