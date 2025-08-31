import { GET_EXPENSES, EXPENSE_ERROR, ADD_EXPENSE, DELETE_EXPENSE, UPDATE_EXPENSE } from '../actions/types';

const initialState = { expenses: [], loading: true, error: {} };

function expenseReducer(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case GET_EXPENSES:
            return { ...state, expenses: payload, loading: false };
        case ADD_EXPENSE:
            return { ...state, expenses: [payload, ...state.expenses], loading: false };
        case DELETE_EXPENSE:
            return { ...state, expenses: state.expenses.filter(expense => expense._id !== payload), loading: false };
        case UPDATE_EXPENSE:
            return { ...state, expenses: state.expenses.map(expense => expense._id === payload._id ? payload : expense), loading: false };
        case EXPENSE_ERROR:
            return { ...state, error: payload, loading: false };
        default:
            return state;
    }
}

export default expenseReducer;
