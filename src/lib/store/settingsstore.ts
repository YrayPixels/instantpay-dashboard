import { create } from 'zustand';
import { createJSONStorage, persist, PersistStorage } from 'zustand/middleware';

interface Settings {
    update: number;
    systemUpdate: () => void;  // Triggered when system settings need to be updated.
   
}

const AppSettings = create(
    persist<Settings>(
        (set) => ({
            update:0,
            systemUpdate: () => set({ update: Math.random()}),
        }),
        {
            name: 'settings', // Storage key
            storage:createJSONStorage(()=> localStorage), 
            onRehydrateStorage: () => (state) => {
                console.log("Rehydrating:", state);
            }
        }
    )
);

export default AppSettings;
