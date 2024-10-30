import { combineReducers, legacy_createStore as createStore } from 'redux'
import authReducer from './reducers/authReducer'

const initialState = {
  sidebarShow: true,
  sidebarUnfoldable: false,
  theme: 'light',
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    case 'setSidebarShow':
      return { ...state, sidebarShow: rest.sidebarShow }
    case 'setSidebarUnfoldable':
      return { ...state, sidebarUnfoldable: rest.sidebarUnfoldable }
    default:
      return state
  }
}

const reducers = combineReducers({
  changeState,
  authReducer,
})

const store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
)
export default store
