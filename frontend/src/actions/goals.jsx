import { GET_GOALS, ADD_GOAL, DELETE_GOAL, UPDATE_GOAL_DETAILS, UPDATE_GOAL_PROGRESS, GOAL_ERROR } from './types';
import { setAlert } from './alert';
import * as api from '../api';

export const getGoals = () => async (dispatch) => {
  try {
    const data = await api.getGoals();
    dispatch({ type: GET_GOALS, payload: data });
  } catch (err) {
    dispatch({ type: GOAL_ERROR, payload: { msg: 'Failed to fetch goals.' } });
  }
};

export const addGoal = (formData) => async (dispatch) => {
  try {
    const data = await api.addGoal(formData);
    dispatch({ type: ADD_GOAL, payload: data });
    dispatch(setAlert('Goal Added', 'success'));
  } catch (err) {
    dispatch({ type: GOAL_ERROR, payload: { msg: 'Failed to add goal.' } });
  }
};

export const deleteGoal = (id) => async (dispatch) => {
  try {
    await api.deleteGoal(id);
    dispatch({ type: DELETE_GOAL, payload: id });
    dispatch(setAlert('Goal Removed', 'success'));
  } catch (err) {
    dispatch({ type: GOAL_ERROR, payload: { msg: 'Failed to remove goal.' } });
  }
};

export const updateGoalDetails = (id, formData) => async (dispatch) => {
    try {
        const data = await api.updateGoalDetails(id, formData);
        dispatch({ type: UPDATE_GOAL_DETAILS, payload: data });
        dispatch(setAlert('Goal Updated', 'success'));
    } catch (err) {
        dispatch({ type: GOAL_ERROR, payload: { msg: 'Failed to update goal.' } });
    }
};

export const updateGoalProgress = (id, currentAmount) => async (dispatch) => {
  try {
    const data = await api.updateGoalProgress(id, currentAmount);
    dispatch({ type: UPDATE_GOAL_PROGRESS, payload: data });
    dispatch(setAlert('Goal Progress Updated', 'success'));
  } catch (err) {
    dispatch({ type: GOAL_ERROR, payload: { msg: 'Failed to update goal progress.' } });
  }
};