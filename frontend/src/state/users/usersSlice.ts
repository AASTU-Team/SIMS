import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
// import type { RootState } from '../store'

interface UserState {
    name: string,
    email: string,
    role: string,
    roles:string[],
    id: string,
    _id:string
}

const initialState: UserState = {
    name: "Loading",
    email: "loading",
    role: "loading",
    roles:[],
    id: "loading",
    _id: "loading"
}

export const userSlice = createSlice({
  name: 'user',

  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      console.log(action.payload)
      state= action.payload
      return state
    },
  },
})


export const { setUser } = userSlice.actions


export default userSlice.reducer