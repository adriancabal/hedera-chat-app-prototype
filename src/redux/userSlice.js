import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: "",
    hederaClient: null,
    smartContractId: "",
    socket: null,
  },
  reducers: {
    setUser: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.currentUser = action.payload;
    },
    setHederaClient: (state, action) => {
        state.hederaClient = action.payload;
    },
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setSmartContractId: (state, action) => {
        state.smartContractId = action.payload;
    },
    resetUser: (state) => {
      state.currentUser = "";
    },
  },
})

// Action creators are generated for each case reducer function
export const { setHederaClient, setSmartContractId, setUser, setSocket, resetUser } = userSlice.actions

export default userSlice.reducer