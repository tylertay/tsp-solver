import { combineReducers } from 'redux';
import routeSequence from './route_sequence';
import loading from './loading';

export default combineReducers({
  routeSequence,
  loading
});
