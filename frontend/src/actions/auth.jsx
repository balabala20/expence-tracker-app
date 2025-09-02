import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT
} from './types';
import { setAlert } from './alert';
import * as api from '../api';

// Load User
export const loadUser = () => async dispatch => {
  try {
    const user = await api.loadUser();
    dispatch({
      type: USER_LOADED,
      payload: user
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

// Register User
export const register = ({ name, email, password, avatar }) => async dispatch => {
  try {
    const res = await api.register({ name, email, password, avatar });
    dispatch({ type: REGISTER_SUCCESS, payload: res });
    dispatch(loadUser());
  } catch (err) {
    dispatch(setAlert(err.message, 'danger'));
    dispatch({ type: REGISTER_FAIL });
  }
};

// Login User
export const login = (email, password) => async dispatch => {
    try {
        const res = await api.login(email, password);
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res
        });
        dispatch(loadUser());
    } catch (err) {
        dispatch(setAlert(err.message, 'danger'));
        dispatch({ type: LOGIN_FAIL });
    }
};

// Logout
export const logout = () => async dispatch => {
  await api.logout();
  dispatch({ type: LOGOUT });
};