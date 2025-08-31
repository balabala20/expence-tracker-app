import { GET_EXPENSES, EXPENSE_ERROR, ADD_EXPENSE, DELETE_EXPENSE, UPDATE_EXPENSE } from './types';
import { setAlert } from './alert';
import * as api from '../api';

export const getExpenses = () => async dispatch => {
    try {
        const data = await api.getExpenses();
        dispatch({ type: GET_EXPENSES, payload: data });
    } catch (err) {
        dispatch({ type: EXPENSE_ERROR, payload: { msg: 'Failed to fetch expenses.' } });
    }
};

export const addExpense = formData => async dispatch => {
    try {
        const data = await api.addExpense(formData);
        dispatch({ type: ADD_EXPENSE, payload: data });
        dispatch(setAlert('Expense Added', 'success'));
    } catch (err) {
        dispatch({ type: EXPENSE_ERROR, payload: { msg: 'Failed to add expense.' } });
    }
};

export const deleteExpense = id => async dispatch => {
    try {
        await api.deleteExpense(id);
        dispatch({ type: DELETE_EXPENSE, payload: id });
        dispatch(setAlert('Expense Removed', 'success'));
    } catch (err) {
        dispatch({ type: EXPENSE_ERROR, payload: { msg: 'Failed to remove expense.' } });
    }
};

export const updateExpense = (id, formData) => async dispatch => {
    try {
        const data = await api.updateExpense(id, formData);
        dispatch({ type: UPDATE_EXPENSE, payload: data });
        dispatch(setAlert('Expense Updated', 'success'));
    } catch (err) {
        dispatch({ type: EXPENSE_ERROR, payload: { msg: 'Failed to update expense.' } });
    }
};