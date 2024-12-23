import { createStore, combineReducers } from 'redux';
import { positionsReducer } from './positions/reducer';

const rootReducer = combineReducers({
  positions: positionsReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export const store = createStore(rootReducer);