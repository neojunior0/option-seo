'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type OptionUser = {
  username: string;
  createdAt: string;
};

type StoredUser = OptionUser & {
  passwordHash: string;
};

type ApiKeys = {
  openrouter?: string;
  dataforseoLogin?: string;
  dataforseoPassword?: string;
};

type AuthContextValue = {
  user: OptionUser | null;
  loading: boolean;
  signUp: (username: string, password: string) => { error?: string };
  logIn: (username: string, password: string) => { error?: string };
  logOut: () => void;
  deleteAccount: () => void;
  getApiKeys: () => ApiKeys;
  saveApiKeys: (keys: ApiKeys) => void;
};

const USERS_KEY = 'optionseo_users';
const SESSION_KEY = 'optionseo_session';
const API_KEYS_PREFIX = 'optionseo_api_keys_';

const AuthContext = createContext<AuthContextValue | null>(null);

function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const chr = password.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return `h_${hash}`;
}

function readUsers(): Record<string, StoredUser> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeUsers(users: Record<string, StoredUser>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<OptionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const session = localStorage.getItem(SESSION_KEY);
      if (session) {
        setUser(JSON.parse(session));
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  const signUp = useCallback(
    (username: string, password: string): { error?: string } => {
      const trimmed = username.trim();
      if (!trimmed) return { error: 'Username is required' };
      if (trimmed.length < 2) return { error: 'Username must be at least 2 characters' };
      if (!password || password.length < 6) return { error: 'Password must be at least 6 characters' };

      const users = readUsers();
      const key = trimmed.toLowerCase();
      if (users[key]) return { error: 'That username is already taken' };

      const newUser: StoredUser = {
        username: trimmed,
        passwordHash: hashPassword(password),
        createdAt: new Date().toISOString(),
      };
      users[key] = newUser;
      writeUsers(users);

      const sessionUser: OptionUser = {
        username: newUser.username,
        createdAt: newUser.createdAt,
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
      setUser(sessionUser);
      return {};
    },
    [],
  );

  const logIn = useCallback(
    (username: string, password: string): { error?: string } => {
      const trimmed = username.trim();
      if (!trimmed || !password) return { error: 'Enter your username and password' };

      const users = readUsers();
      const key = trimmed.toLowerCase();
      const stored = users[key];
      if (!stored) return { error: 'No account found with that username' };
      if (stored.passwordHash !== hashPassword(password)) return { error: 'Incorrect password' };

      const sessionUser: OptionUser = {
        username: stored.username,
        createdAt: stored.createdAt,
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
      setUser(sessionUser);
      return {};
    },
    [],
  );

  const logOut = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const deleteAccount = useCallback(() => {
    if (!user) return;
    const key = user.username.toLowerCase();
    const users = readUsers();
    delete users[key];
    writeUsers(users);
    localStorage.removeItem(API_KEYS_PREFIX + key);
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, [user]);

  const getApiKeys = useCallback((): ApiKeys => {
    if (!user) return {};
    try {
      return JSON.parse(
        localStorage.getItem(API_KEYS_PREFIX + user.username.toLowerCase()) || '{}',
      );
    } catch {
      return {};
    }
  }, [user]);

  const saveApiKeys = useCallback(
    (keys: ApiKeys) => {
      if (!user) return;
      localStorage.setItem(
        API_KEYS_PREFIX + user.username.toLowerCase(),
        JSON.stringify(keys),
      );
    },
    [user],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      signUp,
      logIn,
      logOut,
      deleteAccount,
      getApiKeys,
      saveApiKeys,
    }),
    [user, loading, signUp, logIn, logOut, deleteAccount, getApiKeys, saveApiKeys],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
