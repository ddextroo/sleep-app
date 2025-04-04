import { create } from 'zustand';

interface TrackState {
  isTracking: boolean;
  startTime: number | null;
  endTime: number | null;
  elapsedTime: number;
  sleepDuration: string;
  selectedDate: Date;
  sleepProgress: {
    hours: number[];
    average: number;
  };
  previousDateData: any;
  userName: string;
  setTracking: (isTracking: boolean) => void;
  setStartTime: (time: number | null) => void;
  setEndTime: (time: number | null) => void;
  setElapsedTime: (time: number) => void;
  setSleepDuration: (duration: string) => void;
  setSelectedDate: (date: Date) => void;
  setSleepProgress: (progress: { hours: number[]; average: number }) => void;
  setPreviousDateData: (data: any) => void;
  setUserName: (name: string) => void;
  incrementElapsedTime: () => void;
}

export const useTrackStore = create<TrackState>((set) => ({
  isTracking: false,
  startTime: null,
  endTime: null,
  elapsedTime: 0,
  sleepDuration: "00:00:00",
  selectedDate: new Date(),
  sleepProgress: {
    hours: Array(7).fill(0),
    average: 0,
  },
  previousDateData: null,
  userName: "",
  setTracking: (isTracking) => set({ isTracking }),
  setStartTime: (startTime) => set({ startTime }),
  setEndTime: (endTime) => set({ endTime }),
  setElapsedTime: (elapsedTime) => set({ elapsedTime }),
  setSleepDuration: (sleepDuration) => set({ sleepDuration }),
  setSelectedDate: (selectedDate) => set({ selectedDate }),
  setSleepProgress: (sleepProgress) => set({ sleepProgress }),
  setPreviousDateData: (previousDateData) => set({ previousDateData }),
  setUserName: (userName) => set({ userName }),
  incrementElapsedTime: () => set((state) => ({ elapsedTime: state.elapsedTime + 1 })),
})); 