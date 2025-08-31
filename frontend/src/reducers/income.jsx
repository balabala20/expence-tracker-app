import { GET_INCOMES, INCOME_ERROR, ADD_INCOME, DELETE_INCOME, UPDATE_INCOME } from '../actions/types';

const initialState = { incomes: [], loading: true, error: {} };

function incomeReducer(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case GET_INCOMES:
            return { ...state, incomes: payload, loading: false };
        case ADD_INCOME:
            return { ...state, incomes: [payload, ...state.incomes], loading: false };
        case DELETE_INCOME:
            return { ...state, incomes: state.incomes.filter(income => income._id !== payload), loading: false };
        case UPDATE_INCOME:
            return { ...state, incomes: state.incomes.map(income => income._id === payload._id ? payload : income), loading: false };
        case INCOME_ERROR:
            return { ...state, error: payload, loading: false };
        default:
            return state;
    }
}

export default incomeReducer;
