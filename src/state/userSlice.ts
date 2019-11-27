import { createSlice } from "@reduxjs/toolkit"

export interface UserDataState {
  name: string
  citizenCardNumber: string
  email: string
  phone: string
  disclaimerShown: boolean
}

const initialState: UserDataState = {
  name: "",
  citizenCardNumber: "",
  email: "",
  phone: "",
  disclaimerShown: false,
}

const userDataSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    setDisclaimerShown(state) {
      state.disclaimerShown = true
    },
  },
})

export const { setDisclaimerShown } = userDataSlice.actions
export const reducer = userDataSlice.reducer
