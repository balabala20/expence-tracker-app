import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import income from './income';
import expense from './expense';
import goals from './goals'; // 1. Import the new reducer

export default combineReducers({
  alert,
  auth,
  income,
  expense,
  goals, // 2. Add it here
});