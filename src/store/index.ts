import create from 'zustand';

import { User } from '../types';

interface currentUserState {
  currentUser: User | null;
  setCurrentUser: (currentUser: User | null) => void;
}

export const useCurrentUserState = create<currentUserState>((set) => ({
  currentUser: null,
  setCurrentUser: (currentUser: User | null) => set({ currentUser }),
}));
