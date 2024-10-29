import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  token: localStorage.getItem('token') || null,
  username: localStorage.getItem('username') || null,
  role: localStorage.getItem('role') || null,
  id: localStorage.getItem('id') || null,
  expire: localStorage.getItem('expire') || null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthData: (state, action) => {
      state.token = action.payload.token
      state.username = action.payload.username
      state.id = action.payload.id
      state.expire = action.payload.expire
      state.role = action.payload.role
    },
    clearAuthData: (state) => {
      state.token = null
      state.username = null
      state.id = null
      state.expire = null
      state.role = null
    },
  },
})

export const { setAuthData, clearAuthData } = authSlice.actions

export default authSlice.reducer
