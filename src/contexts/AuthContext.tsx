import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '../types';

interface AuthResult {
  success: boolean;
  message: string;
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (email: string, password: string) => Promise<AuthResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to get user-specific storage key
const getStorageKey = (key: string, email: string) => `${email}_${key}`;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for a logged-in user in session storage on initial load
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // In a real app, this would be a secure backend. For this simulation, we use localStorage.
  // NOTE: Storing passwords directly is insecure. In a real application, always hash passwords.
  const getUsers = () => {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  };

  const saveUsers = (users: any[]) => {
    localStorage.setItem('users', JSON.stringify(users));
  };

  const signup = async (email: string, password: string): Promise<AuthResult> => {
    await new Promise(res => setTimeout(res, 500)); // Simulate API call
    const users = getUsers();
    const userExists = users.some((user: any) => user.email === email);

    if (userExists) {
      return { success: false, message: 'Este e-mail já está cadastrado.' };
    }

    users.push({ email, password }); // Storing password directly for simplicity
    saveUsers(users);
    
    // Automatically log in the new user
    const user = { email };
    setCurrentUser(user);
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    
    return { success: true, message: 'Conta criada com sucesso!' };
  };

  const login = async (email: string, password: string): Promise<AuthResult> => {
    await new Promise(res => setTimeout(res, 500)); // Simulate API call
    const users = getUsers();
    const userAccount = users.find((user: any) => user.email === email);

    if (!userAccount) {
      return { success: false, message: 'Usuário não encontrado.' };
    }

    if (userAccount.password !== password) {
      return { success: false, message: 'Senha incorreta.' };
    }
    
    const user = { email };
    setCurrentUser(user);
    sessionStorage.setItem('currentUser', JSON.stringify(user));

    return { success: true, message: 'Login bem-sucedido!' };
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('currentUser');
  };

  // Override localStorage getItem and setItem to be user-specific
  useEffect(() => {
    if (!currentUser) return;

    const originalGetItem = Storage.prototype.getItem;
    const originalSetItem = Storage.prototype.setItem;
    
    Storage.prototype.getItem = function(key: string) {
        if (key === 'users' || key === 'ally-supports-cache') return originalGetItem.call(this, key);
        return originalGetItem.call(this, getStorageKey(key, currentUser.email));
    };

    Storage.prototype.setItem = function(key: string, value: string) {
        if (key === 'users' || key === 'ally-supports-cache') {
            originalSetItem.call(this, key, value);
            return;
        }
        originalSetItem.call(this, getStorageKey(key, currentUser.email), value);
    };

    return () => {
      // Restore original functions on logout or component unmount
      Storage.prototype.getItem = originalGetItem;
      Storage.prototype.setItem = originalSetItem;
    };
  }, [currentUser]);


  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};