import { createSlice } from '@reduxjs/toolkit';

export const usersSlice = createSlice({
  name: 'users',
  initialState: {
    userList: [],
    userMap: {},
  },
  reducers: {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes

    setUserList: (state, action) => {
        state.userList = action.payload;
    },
    setUserMap: (state, action) => {
        state.userMap = action.payload;
    },

    // addUser: (state, action) => {
    //   const msgObj = action.payload;
    //   const userList = state.userList;
    //   const userMap = state.userMap;
    //   state.userList = userList.push(msgObj.user);
    //   state.userMap = userMap[msgObj.user] = {
    //       pw: msgObj.pw,
    //       channels: [],
    //       isLoggedIn: false,
    //   };
    // },
    // addUserDmChannel: (state, action) => {
    //     const msgObj = action.payload;
    //     const channel = msgObj.channel;
    //     const user1 = msgObj.user1;
    //     const user2 = msgObj.user2;
    //     const userMap = state.userMap;
    //     userMap[user1].channels.unshift(channel);
    //     userMap[user2].channels.unshift(channel);
    //     state.userMap = userMap;
    // },
  },
})

// Action creators are generated for each case reducer function
export const { setUserList, setUserMap } = usersSlice.actions

export default usersSlice.reducer