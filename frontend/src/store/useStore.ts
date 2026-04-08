import { create } from 'zustand';

export interface QuizAnswers {
  landscape?: string;
  style?: string;
  budget?: string;
  companion?: string;
  pace?: string;
}

export interface DiaryEntry {
  id: string;
  diaryId: string;
  dayNumber: number;
  activityId: string;
  text: string;
  photo?: string;
  timestamp: string;
}

export interface Diary {
  id: string;
  destinationId: string;
  itineraryId: string;
  isPublic: boolean;
  shareToken: string;
  entries: DiaryEntry[];
  createdAt: string;
}

export interface ItineraryDay {
  dayNumber: number;
  date: string;
  activityIds: string[];
}

export interface Itinerary {
  id: string;
  destinationId: string;
  departureDate: string;
  returnDate: string;
  days: ItineraryDay[];
  createdAt: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  quizCompleto: boolean;
  quizAnswers: QuizAnswers;
  tags: string[];
}

interface AppState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  savedDestinations: string[];
  itineraries: Itinerary[];
  diaries: Diary[];

  login: (email: string, name: string, id: number, quizCompleto: boolean) => void;
  logout: () => void;
  register: (name: string, email: string) => void;
  setQuizAnswers: (answers: QuizAnswers) => void;
  toggleSaveDestination: (id: string) => void;
  addItinerary: (itinerary: Itinerary) => void;
  updateItinerary: (id: string, days: ItineraryDay[]) => void;
  deleteItinerary: (id: string) => void;
  addDiary: (diary: Diary) => void;
  toggleDiaryPublic: (id: string) => void;
  addDiaryEntry: (entry: DiaryEntry) => void;
  deleteDiaryEntry: (diaryId: string, entryId: string) => void;
  deleteDiary: (id: string) => void;
  updateProfile: (name: string, email: string) => void;
}

const savedUser = localStorage.getItem('user');
const initialUser: UserProfile | null = savedUser ? JSON.parse(savedUser) : null;

export const useStore = create<AppState>((set) => ({
  isAuthenticated: !!initialUser,
  user: initialUser,
  savedDestinations: [],
  itineraries: [],
  diaries: [],

  login: (email, name, id, quizCompleto) => {
    const user: UserProfile = { id, name, email, quizCompleto, quizAnswers: {}, tags: [] };
    localStorage.setItem('user', JSON.stringify(user));
    set({ isAuthenticated: true, user });
  },

  logout: () => {
    localStorage.removeItem('user');
    set({
      isAuthenticated: false,
      user: null,
      savedDestinations: [],
      itineraries: [],
      diaries: [],
    });
  },

  register: (name, email) => {
    const user: UserProfile = { id: 0, name, email, quizCompleto: false, quizAnswers: {}, tags: [] };
    localStorage.setItem('user', JSON.stringify(user));
    set({ isAuthenticated: true, user });
  },

  setQuizAnswers: (answers) => set((state) => {
    const tags = Object.values(answers).filter(Boolean).map(v => v!.toLowerCase());
    const user = state.user ? { ...state.user, quizAnswers: answers, tags, quizCompleto: true } : null;
    if (user) localStorage.setItem('user', JSON.stringify(user));
    return { user };
  }),

  toggleSaveDestination: (id) => set((state) => ({
    savedDestinations: state.savedDestinations.includes(id)
      ? state.savedDestinations.filter(d => d !== id)
      : [...state.savedDestinations, id],
  })),

  addItinerary: (itinerary) => set((state) => ({
    itineraries: [...state.itineraries, itinerary],
  })),

  updateItinerary: (id, days) => set((state) => ({
    itineraries: state.itineraries.map(it =>
      it.id === id ? { ...it, days } : it
    ),
  })),

  deleteItinerary: (id) => set((state) => ({
    itineraries: state.itineraries.filter(it => it.id !== id),
  })),

  addDiary: (diary) => set((state) => ({
    diaries: [...state.diaries, diary],
  })),

  toggleDiaryPublic: (id) => set((state) => ({
    diaries: state.diaries.map(d =>
      d.id === id ? { ...d, isPublic: !d.isPublic } : d
    ),
  })),

  addDiaryEntry: (entry) => set((state) => ({
    diaries: state.diaries.map(d =>
      d.id === entry.diaryId ? { ...d, entries: [...d.entries, entry] } : d
    ),
  })),

  deleteDiaryEntry: (diaryId, entryId) => set((state) => ({
    diaries: state.diaries.map(d =>
      d.id === diaryId ? { ...d, entries: d.entries.filter(e => e.id !== entryId) } : d
    ),
  })),

  deleteDiary: (id) => set((state) => ({
    diaries: state.diaries.filter(d => d.id !== id),
  })),

  updateProfile: (name, email) => set((state) => {
    const user = state.user ? { ...state.user, name, email } : null;
    if (user) localStorage.setItem('user', JSON.stringify(user));
    return { user };
  }),
}));
