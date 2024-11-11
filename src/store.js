import { combineReducers, legacy_createStore as createStore } from 'redux'
import authReducer from './reducers/authReducer'
import jobReducer from './reducers/jobReducer'

const initialState = {
  sidebarShow: true,
  sidebarUnfoldable: false,
  theme: 'light',
  seeMyOwnJobs: false,
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    case 'setSidebarShow':
      return { ...state, sidebarShow: rest.sidebarShow }
    case 'setSidebarUnfoldable':
      return { ...state, sidebarUnfoldable: rest.sidebarUnfoldable }
    case 'setSeeMyOwnJobs':
      return { ...state, seeMyOwnJobs: rest.seeMyOwnJobs }
    default:
      return state
  }
}

const reducers = combineReducers({
  changeState,
  authReducer,
  jobReducer,
})

const store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
)
export default store
