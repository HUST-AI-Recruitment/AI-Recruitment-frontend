import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  token: localStorage.getItem('token') || null,
  username: localStorage.getItem('username') || null,
  role: localStorage.getItem('role') || null,
  userid: localStorage.getItem('userid') || null,
  expire: localStorage.getItem('expire') || null,
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
  },
})

export const { setAuthData, clearAuthData } = authSlice.actions

export default authSlice.reducer
