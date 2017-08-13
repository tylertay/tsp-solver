import { SET_LOADING, SET_ROUTE_SEQUENCE } from '../actions/types';

export default (state = false, action) => {
  switch (action.type) {
    case SET_LOADING:
      return action.payload;
    case SET_ROUTE_SEQUENCE:
      return false;
    default:
      return state;
  }
};
