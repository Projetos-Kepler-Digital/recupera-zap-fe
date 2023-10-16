import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from 'react';

import { useRouter } from 'next/router';

import { auth } from '../database';
import {
  Auth,
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as FirebaseSignOut,
} from 'firebase/auth';

import { recover } from './recover';
import { useCookies } from '@/hooks/useCookies';

import type { User } from '@/database/types/User';

import { getUserOnSnapshot } from '@/database/functions';
import axios from 'axios';
import { Timestamp } from 'firebase/firestore';

type SignInProps = Pick<User, 'email'> & { password: string };
type SignUpProps = Pick<User, 'email' | 'name'> & { password: string };

export interface AuthContextModel {
  auth: Auth;
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;

  signUp: (
    userId: string,
    dueDate: Timestamp,
    { name, email, password }: SignUpProps,
    save: boolean
  ) => Promise<UserCredential>;
  signIn: (
    { email, password }: SignInProps,
    save: boolean
  ) => Promise<UserCredential>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextModel>(
  {} as AuthContextModel
);

interface AuthProviderProps {
  children?: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();

  const { readCookie, createCookie, deleteCookie } = useCookies();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userCookie = readCookie('user.token');

    if (!!userCookie) {
      recover({ email: userCookie }).then((user) => {
        if (!user) return;

        getUserOnSnapshot(user.userId, (user) => {
          setUser(user);
        });
      });
    }
  }, [readCookie]);

  async function signUp(
    userId: string,
    dueDate: Timestamp,
    { name, email, password }: SignUpProps,
    save: boolean
  ) {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (save) {
      createCookie('user.token', email, {
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    await axios.post('/api/rest/user/create-user', {
      userId,
      name,
    });

    setUser({ id: userId, dueDate, email, name });

    await router.push('/dashboard');

    return userCredential;
  }

  async function signIn({ email, password }: SignInProps, save: boolean) {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const { userId, user } = await recover({ email });

    if (!user) {
      return userCredential;
    }

    if (save) {
      createCookie('user.token', user.email, {
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    setUser(user);

    await router.push('/dashboard');

    return userCredential;
  }

  async function signOut() {
    await FirebaseSignOut(auth);

    deleteCookie('user.token');

    setUser(null);

    await router.push('/auth/login');
  }

  const values: AuthContextModel = {
    user,
    setUser,
    signIn,
    signUp,
    signOut,
    auth,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};
