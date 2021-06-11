import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type RoomState = {
  count: number
}

const initialState: RoomState = {
  count: 0
}

export const countSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    add(state, action: PayloadAction<{ num: number }>) {
      state.count += action.payload.num
    },
  },
})