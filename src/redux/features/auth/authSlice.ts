import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

interface AuthState {
  user: any;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      localStorage.setItem("token", token);
    },

    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
});

export const { setUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;

export const useCurrentToken = (state: RootState) => state.auth.token;
export const selectCurrentUser = (state: RootState) => state.auth.user;
