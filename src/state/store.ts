import {applyMiddleware, combineReducers, createStore} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import ACTIONS from './actions';
import reducers from './reducers'

const cReducers = combineReducers(reducers)

const rootReducers = (state:any, action) => {
	if(action.type === ACTIONS.SESSION_DESTROY) {
		state = undefined
	}
	return cReducers(state, action)
}

export default createStore(rootReducers, {}, composeWithDevTools(applyMiddleware(thunk)))