import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FootprintData {
  transport: number;
  energy: number;
  diet: number;
  waste: number;
  shopping: number;
  total: number;
  date: string;
}

interface AppState {
  currentData: FootprintData | null;
  history: FootprintData[];
  streak: number;
  lastCalculatedDate: string | null;
  setFootprintData: (data: Omit<FootprintData, 'total' | 'date'>) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentData: null,
      history: [],
      streak: 0,
      lastCalculatedDate: null,

      setFootprintData: (data) => {
        const total = Object.values(data).reduce((acc, val) => acc + val, 0);
        const newData: FootprintData = { ...data, total, date: new Date().toISOString() };
        
        const { history, lastCalculatedDate, streak } = get();
        
        let newStreak = streak;
        const today = new Date().toDateString();
        
        if (lastCalculatedDate !== today) {
           // Basic streak logic: if it's a new day, increment. 
           // If missed days, reset. (simplified for this demo)
           const lastDate = lastCalculatedDate ? new Date(lastCalculatedDate) : null;
           if (lastDate) {
             const diffTime = Math.abs(new Date().getTime() - lastDate.getTime());
             const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
             if (diffDays === 1) {
               newStreak += 1;
             } else if (diffDays > 1) {
               newStreak = 1;
             }
           } else {
             newStreak = 1;
           }
        }

        set({
          currentData: newData,
          history: [...history, newData],
          streak: newStreak,
          lastCalculatedDate: today,
        });
      },
    }),
    {
      name: 'carbonsaathi-storage',
    }
  )
);
