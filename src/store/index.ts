import create from 'zustand';

import { User } from '../types';

interface currentUserState {
  currentUser: User | null;
  setCurrentUser: (currentUser: User | null) => void;
  setHasReadAllNotifications: () => void;
}

export const useCurrentUserState = create<currentUserState>((set) => ({
  currentUser: null,
  setCurrentUser: (currentUser: User | null) => set({ currentUser }),
  setHasReadAllNotifications: () =>
    set((state) => ({
      currentUser: {
        ...state.currentUser!,
        _count: { ...state.currentUser!._count!, notifications: 0 },
      },
    })),
}));
