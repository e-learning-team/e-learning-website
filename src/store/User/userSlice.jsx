import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    isLoggedIn: false,
    userData: null,
    token: null,
    // isLoading: false,
    message: ''
};
export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn;
            state.userData = action.payload.userData;
            state.token = action.payload.token;
        },
        // Add a new reducer to update the token
        updateToken: (state, action) => {
            console.log("---update token---")
            state.token = action.payload;
        },
        logout: (state, action) => {
            state.isLoggedIn = false;
            state.token = null;
            state.userData = null;
            state.message = '';
        },
    }
});
export const { login, updateToken, logout } = userSlice.actions;
export default userSlice.reducer;
export const selectUserToken = (state) => state.user.token;
