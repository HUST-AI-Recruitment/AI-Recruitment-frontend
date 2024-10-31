import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  token: localStorage.getItem('token') || null,
  username: localStorage.getItem('username') || null,
  role: parseInt(localStorage.getItem('role')) || null,
  userid: parseInt(localStorage.getItem('userid')) || null,
  expire: parseInt(localStorage.getItem('expire')) || null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthData: (state, action) => {
      state.token = action.payload.token
      state.username = action.payload.username
      state.userid = action.payload.userid
      state.expire = action.payload.expire
      state.role = action.payload.role
    },
    clearAuthData: (state) => {
      state.token = null
      state.username = null
      state.userid = null
      state.expire = null
      state.role = null
    },
    setUsername: (state, action) => {
      state.username = action.payload
    },
    setUserid: (state, action) => {
      state.userid = action.payload
    },
  },
})

export const { setAuthData, clearAuthData, setUsername, setUserid } = authSlice.actions

export default authSlice.reducer
