import { create } from 'zustand';
import { createJSONStorage, persist, PersistStorage } from 'zustand/middleware';



const userStore = create(
  persist(
    (set, get) => ({
      // User Info
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token: string) => set({ token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'userinfo',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        console.log("Rehydrating:", state);
      }
    }
  )
);

export default userStore;
