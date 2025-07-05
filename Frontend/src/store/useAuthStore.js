
import { create } from 'zustand';
import axios from 'axios';
const useAuthStore = create((set) => ({
  user: null,
  isLoggedIn: false,
  authLoading: true,

  // Set user on login
  login: (userData) => set({ user: userData, isLoggedIn: true ,authLoading:false}),

  // Clear user on logout
  logout: () => set({ user: null, isLoggedIn: false,authLoading:false }),


    fetchUserOnLoad: async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER}/users/current-user`, {
        withCredentials: true,
      });
      console.log("Current User (useContest) : ",res);
      set({ isLoggedIn: true, user: res.data.data ,authLoading:false });
    } catch (err) {
      set({ isLoggedIn: false, user: null ,authLoading:false}); // clear state if token is invalid
    }
  }
}));

export default useAuthStore;
