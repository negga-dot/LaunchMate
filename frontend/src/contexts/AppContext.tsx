import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

export interface UserData {
  id: string;
  name: string;
  email: string;
  company: string;
  businessType: string;
  sector: string;
  investment: string;
  foundersCount: number;
  address: string;
  setupComplete: boolean;
}

export interface Approval {
  id: string;
  name: string;
  department: string;
  status: 'not-started' | 'documents-ready' | 'submitted' | 'under-review' | 'approved';
  timeline: string;
  priority: 'high' | 'medium' | 'low';
  requiredDocs: string[];
  estimatedDays: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'gst' | 'renewal' | 'deadline' | 'filing';
  priority: 'high' | 'medium' | 'low';
  description: string;
  completed: boolean;
}

export interface Scheme {
  id: string;
  name: string;
  description: string;
  loanAmount: string;
  interestRate: string;
  eligibility: boolean;
  category: string;
  benefits: string[];
  applyLink: string;
}

export interface ChatMessage {
  id: string;
  message: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

interface AppState {
  user: UserData | null;
  approvals: Approval[];
  events: CalendarEvent[];
  schemes: Scheme[];
  chatHistory: ChatMessage[];
  isLoading: boolean;
}

type AppAction =
  | { type: 'SET_USER'; payload: UserData }
  | { type: 'SET_APPROVALS'; payload: Approval[] }
  | { type: 'UPDATE_APPROVAL'; payload: { id: string; updates: Partial<Approval> } }
  | { type: 'ADD_EVENT'; payload: CalendarEvent }
  | { type: 'UPDATE_EVENT'; payload: { id: string; updates: Partial<CalendarEvent> } }
  | { type: 'SET_SCHEMES'; payload: Scheme[] }
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOAD_FROM_STORAGE' };

const initialState: AppState = {
  user: null,
  approvals: [],
  events: [],
  schemes: [],
  chatHistory: [],
  isLoading: false,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_APPROVALS':
      return { ...state, approvals: action.payload };
    case 'UPDATE_APPROVAL':
      return {
        ...state,
        approvals: state.approvals.map(approval =>
          approval.id === action.payload.id
            ? { ...approval, ...action.payload.updates }
            : approval
        ),
      };
    case 'ADD_EVENT':
      return { ...state, events: [...state.events, action.payload] };
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map(event =>
          event.id === action.payload.id
            ? { ...event, ...action.payload.updates }
            : event
        ),
      };
    case 'SET_SCHEMES':
      return { ...state, schemes: action.payload };
    case 'ADD_CHAT_MESSAGE':
      return { ...state, chatHistory: [...state.chatHistory, action.payload] };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'LOAD_FROM_STORAGE':
      const userData = localStorage.getItem('launchmate_user');
      const approvalsData = localStorage.getItem('launchmate_approvals');
      const eventsData = localStorage.getItem('launchmate_events');
      const schemesData = localStorage.getItem('launchmate_schemes');
      const chatData = localStorage.getItem('launchmate_chat');
      
      return {
        ...state,
        user: userData ? JSON.parse(userData) : null,
        approvals: approvalsData ? JSON.parse(approvalsData) : [],
        events: eventsData ? JSON.parse(eventsData) : [],
        schemes: schemesData ? JSON.parse(schemesData) : [],
        chatHistory: chatData ? JSON.parse(chatData) : [],
      };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    dispatch({ type: 'LOAD_FROM_STORAGE' });
  }, []);

  useEffect(() => {
    if (state.user) {
      localStorage.setItem('launchmate_user', JSON.stringify(state.user));
    }
  }, [state.user]);

  useEffect(() => {
    if (state.approvals.length > 0) {
      localStorage.setItem('launchmate_approvals', JSON.stringify(state.approvals));
    }
  }, [state.approvals]);

  useEffect(() => {
    if (state.events.length > 0) {
      localStorage.setItem('launchmate_events', JSON.stringify(state.events));
    }
  }, [state.events]);

  useEffect(() => {
    if (state.schemes.length > 0) {
      localStorage.setItem('launchmate_schemes', JSON.stringify(state.schemes));
    }
  }, [state.schemes]);

  useEffect(() => {
    if (state.chatHistory.length > 0) {
      localStorage.setItem('launchmate_chat', JSON.stringify(state.chatHistory));
    }
  }, [state.chatHistory]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};