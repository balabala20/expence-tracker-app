import { GET_INCOMES, INCOME_ERROR, ADD_INCOME, DELETE_INCOME, UPDATE_INCOME } from './types';
import { setAlert } from './alert';
import * as api from '../api';

export const getIncomes = () => async dispatch => {
    try {
        const data = await api.getIncomes();
        dispatch({ type: GET_INCOMES, payload: data });
    } catch (err) {
        dispatch({ type: INCOME_ERROR, payload: { msg: 'Failed to fetch incomes.' } });
    }
};

export const addIncome = formData => async dispatch => {
    try {
        const data = await api.addIncome(formData);
        dispatch({ type: ADD_INCOME, payload: data });
        dispatch(setAlert('Income Added', 'success'));
    } catch (err) {
        dispatch({ type: INCOME_ERROR, payload: { msg: 'Failed to add income.' } });
    }
};

export const deleteIncome = id => async dispatch => {
    try {
        await api.deleteIncome(id);
        dispatch({ type: DELETE_INCOME, payload: id });
        dispatch(setAlert('Income Removed', 'success'));
    } catch (err) {
        dispatch({ type: INCOME_ERROR, payload: { msg: 'Failed to remove income.' } });
    }
};

export const updateIncome = (id, formData) => async dispatch => {
    try {
        const data = await api.updateIncome(id, formData);
        dispatch({ type: UPDATE_INCOME, payload: data });
        dispatch(setAlert('Income Updated', 'success'));
    } catch (err) {
        dispatch({ type: INCOME_ERROR, payload: { msg: 'Failed to update income.' } });
    }
};