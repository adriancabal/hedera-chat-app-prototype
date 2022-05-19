import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import usersReducer from './usersSlice';
import channelsReducer from './channelsSlice';

export default configureStore({
  reducer: {
      user: userReducer,
      users: usersReducer,
      channels: channelsReducer,
  },
});