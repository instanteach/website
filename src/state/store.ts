import {applyMiddleware, combineReducers, createStore} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import reducers from './reducers'


export default createStore(combineReducers(reducers), {}, composeWithDevTools(applyMiddleware(thunk)))