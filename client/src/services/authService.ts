/**
 * Mock auth – no backend. All data stored in localStorage for demo/deploy.
 */

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  department?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  department?: string;
}

const TOKEN_KEY = 'token';
const USER_KEY = 'user';
const CURRENT_USER_KEY = 'currentUser';

function mockUser(payload: { email: string; name: string; department?: string }): AuthUser {
  return {
    id: `mock-${Date.now()}`,
    email: payload.email,
    name: payload.name,
    role: 'user',
    department: payload.department,
  };
}

function persistCurrentUser(user: AuthUser): void {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function login(payload: LoginPayload): Promise<{ token: string; user: AuthUser }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stored = localStorage.getItem(USER_KEY);
      const users: AuthUser[] = stored ? JSON.parse(stored) : [];
      const match = users.find((u) => u.email === payload.email);
      const user = match ?? mockUser({ email: payload.email, name: payload.email.split('@')[0] });
      if (!match) {
        localStorage.setItem(USER_KEY, JSON.stringify([...users, user]));
      }
      const token = `mock-token-${Date.now()}`;
      localStorage.setItem(TOKEN_KEY, token);
      persistCurrentUser(user);
      resolve({ token, user });
    }, 300);
  });
}

export function register(payload: RegisterPayload): Promise<{ token: string; user: AuthUser }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = mockUser({
        email: payload.email,
        name: payload.name,
        department: payload.department,
      });
      const token = `mock-token-${Date.now()}`;
      const stored = localStorage.getItem(USER_KEY);
      const users: AuthUser[] = stored ? JSON.parse(stored) : [];
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify([...users, user]));
      persistCurrentUser(user);
      resolve({ token, user });
    }, 300);
  });
}

export function fetchMe(): Promise<AuthUser> {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem(TOKEN_KEY);
    const userJson = localStorage.getItem(CURRENT_USER_KEY);
    if (!token || !userJson) {
      reject(new Error('Not logged in'));
      return;
    }
    try {
      resolve(JSON.parse(userJson) as AuthUser);
    } catch {
      reject(new Error('Invalid user'));
    }
  });
}
