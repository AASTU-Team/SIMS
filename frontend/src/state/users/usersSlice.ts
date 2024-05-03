import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
// import type { RootState } from '../store'

interface UserState {
    name: string,
    email: string,
    role: string,
    id: string
}

const initialState: UserState = {
    name: "Yabsera Haile",
    email: "haileyabsera3@gmail.com",
    role: "Admin",
    id: "ETS0660/12"
}

export const userSlice = createSlice({
  name: 'user',

  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state= action.payload
    },
  },
})

export const { setUser } = userSlice.actions


export default userSlice.reducer