import { SET_ROUTE_SEQUENCE } from '../actions/types';

export default (state = {
  route: '',
  timeTaken: {
    hours: '',
    minutes: ''
  }
}, action) => {
  switch (action.type) {
    case SET_ROUTE_SEQUENCE:
      return action.payload;
    default:
      return state;
  }
};
