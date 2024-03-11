'use client';

import { useRouter } from 'next/navigation';

import React, { createContext, useEffect, useState } from 'react';

import { Login, Logout } from '@/database/admin/functions/auth';

import * as auth from '@/database/client/functions/auth';
import * as rest from '@/database/client/functions/rest';

import { Timestamp } from 'firebase/firestore';

import type { License, User } from '@/types/User';

interface SignInProps {
  email: string;
  password: string;
}

interface SignUpProps {
  email: string;
  password: string;
}

export interface AuthContextModel {
  user: User | null;

  signIn: (props: SignInProps) => Promise<auth.AuthResponse>;
  signInWithGoogle: () => Promise<auth.AuthResponse>;
  signUp: (props: SignUpProps) => Promise<auth.AuthResponse>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextModel>(
  {} as AuthContextModel
);

interface AuthProviderProps {
  children?: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    return auth.onIdTokenChanged(async (user) => {
      if (!user) {
        setUser(null);
        return;
      }

      const userSnapshot = rest.getUserOnSnapshot(user.uid, (user) =>
        setUser((prev) => ({ ...prev, ...user }))
      );

      const funnelsSnapshot = rest.getUserFunnelsOnSnapshot(
        user.uid,
        (funnels) => {
          setUser((prev) => {
            if (!prev) {
              return null;
            }

            return { ...prev, funnels };
          });
        }
      );

      return () => {
        userSnapshot();
        funnelsSnapshot();
      };
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const user = auth.currentUser;

      if (user) {
        await user.getIdToken(true);
      }
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const router = useRouter();

  async function signIn({
    email,
    password,
  }: SignInProps): Promise<auth.AuthResponse> {
    const result = await auth.signIn(email, password);

    if (!result.success) {
      return result;
    }

    const doc = await rest.getUser(result.user.uid);

    if (!doc) {
      await auth.signOut();

      return {
        success: false,
        error: 'auth/user-not-found',
      };
    }

    if (doc.licensedUntil.toDate() < new Date()) {
      await auth.signOut();

      return {
        success: false,
        error: 'auth/user-not-licensed',
      };
    }

    const token = await result.user.getIdToken();

    await Login(token);

    router.replace('/dashboard');

    return result;
  }

  async function signInWithGoogle(): Promise<auth.AuthResponse> {
    const result = await auth.signInWithGoogle();

    if (!result.success) {
      return result;
    }

    if (!result.user.email) {
      await auth.signOut();

      return {
        success: false,
        error: 'auth/invalid-email',
      };
    }

    const doc = await rest.getUser(result.user.uid);

    if (doc) {
      if (doc.licensedUntil.toDate() < new Date()) {
        await auth.signOut();

        return {
          success: false,
          error: 'auth/user-not-licensed',
        };
      }

      const token = await result.user.getIdToken();

      await Login(token);

      router.replace('/dashboard');

      return result;
    }

    let data = await rest.getLicense(result.user.email);

    if (data) {
      await rest.deleteLicense(data.id);

      if (data.licensedUntil.toDate() < new Date()) {
        await auth.signOut();

        return {
          success: false,
          error: 'auth/user-not-licensed',
        };
      }
    }

    const date = new Date();
    date.setDate(date.getDate() + 7);

    const license: License = data || {
      id: result.user.uid,
      email: result.user.email,
      name: result.user.displayName,
      phone: result.user.phoneNumber,
      license: 'trial',
      licensedUntil: Timestamp.fromDate(date),
    };

    await rest.createUser({
      ...license,
      id: result.user.uid,
      createdAt: Timestamp.now(),
      isConnected: false,
      funnels: [],
    });

    const token = await result.user.getIdToken();

    await Login(token);

    router.replace('/dashboard');

    return result;
  }

  async function signUp({
    email,
    password,
  }: SignUpProps): Promise<auth.AuthResponse> {
    const result = await auth.signUp(email, password);

    if (!result.success) {
      return result;
    }

    let data = await rest.getLicense(email);

    if (data) {
      await rest.deleteLicense(data.id);

      if (data.licensedUntil.toDate() < new Date()) {
        await auth.signOut();

        return {
          success: false,
          error: 'auth/user-not-licensed',
        };
      }
    }

    const date = new Date();
    date.setDate(date.getDate() + 7);

    const license: License = data || {
      id: result.user.uid,
      email,
      name: null,
      phone: null,
      license: 'trial',
      licensedUntil: Timestamp.fromDate(date),
    };

    await rest.createUser({
      ...license,
      id: result.user.uid,
      createdAt: Timestamp.now(),
      isConnected: false,
      funnels: [],
    });

    const token = await result.user.getIdToken();

    await Login(token);

    router.replace('/dashboard');

    return result;
  }

  async function signOut(): Promise<void> {
    await auth.signOut();
    await Logout();

    router.replace('/auth/login');
  }

  const values: AuthContextModel = {
    user,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};
