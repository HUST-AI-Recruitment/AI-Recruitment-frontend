import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  id: 0,
  actionType: 'add',
}

const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {
    setJob: (state, action) => {
      state.id = action.payload.id
      state.actionType = action.payload.actionType
    },
    clearJob: (state) => {
      state.id = 0
      state.actionType = 'add'
    },
  },
})

export const { setJob, clearJob } = jobSlice.actions

export default jobSlice.reducer
