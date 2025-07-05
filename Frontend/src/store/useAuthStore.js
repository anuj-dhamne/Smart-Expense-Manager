
import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  isLoggedIn: false,

  // Set user on login
  login: (userData) => set({ user: userData, isLoggedIn: true }),

  // Clear user on logout
  logout: () => set({ user: null, isLoggedIn: false }),
}));

export default useAuthStore;
