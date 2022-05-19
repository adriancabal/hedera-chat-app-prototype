import { createSlice } from '@reduxjs/toolkit';

export const channelsSlice = createSlice({
  name: 'channels',
  initialState: {
    deletedChannelList: [],
    dmChannelMap: {},
    groupChannelMap: {},
    dmChannelList: [],
    groupChannelList: [],
  },
  reducers: {
    setDeletedChannelList: (state, action) => {
        state.deletedChannelList = action.payload;
    },
    setDmChannelList: (state, action) => {
        state.dmChannelList = action.payload;
    },
    setGroupChannelList: (state, action) => {
        state.groupChannelList = action.payload;
    },
    setDmChannelMap: (state, action) => {
        state.dmChannelMap = action.payload;
    },
    setGroupChannelMap: (state, action) => {
        state.groupChannelMap = action.payload;
    },

    // addDm: (state, action) => {
    //   const msgObj = action.payload;
    //   const dmChannelMap = state.dmChannelMap;
    //   const dmChannelList = state.dmChannelList;
    //   dmChannelList.unshift(msgObj.channel);
    //   dmChannelMap[msgObj.channel] = {
    //     users: [msgObj.user1, msgObj.user2],
    //     };
    //   state.dmChannelList = dmChannelList;
    //   state.dmChannelMap = dmChannelMap;
    // },
    // addGroup: (state, action) => {
    //     const msgObj = action.payload;
    //     const channel = msgObj.channel;
    //     const creator = msgObj.creator;
    //     const name = msgObj.name;
    //     const groupUsers = msgObj.users;
    //     const groupChannelMap = state.groupChannelMap;
    //     const groupChannelList = state.groupChannelList;

    //     groupChannelMap[channel] = {
    //         creator: creator,
    //         name: name,
    //         users: groupUsers,
    //     };
    //     groupChannelList.unshift(channel);

    //     state.groupChannelMap = groupChannelMap;
    //     state.groupChannelList = groupChannelList;
    // },
    // deleteGroup: (state, action) => {
    //     const msgObj = action.payload;
    //     const channel = msgObj.channel;
    //     const groupChannelMap = state.groupChannelMap;
    //     const groupChannelList = state.groupChannelList;
    //     const groupChannel = groupChannelMap[channel];
    //     const groupUsers = groupChannel.users;
    //     delete groupChannelMap[channel];
    // },
  },
})

// Action creators are generated for each case reducer function
export const { setDeletedChannelList, setDmChannelList, setGroupChannelList, setDmChannelMap, setGroupChannelMap } = channelsSlice.actions

export default channelsSlice.reducer