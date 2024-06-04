import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import lost from './lost'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const appReducer = combineReducers({
    lost
})

const rootReducer = (state, action) => appReducer(state, action)

export const store = createStore(
    rootReducer,
    {},
    // composeEnhancers(applyMiddleware(reduxThunk)),
)

export default store
