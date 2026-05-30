"use client";
import { useState } from 'react';
import { SplashScreen } from './SplashScreen';
import { LoginModal } from './LoginModal';
import { Layout } from './Layout';

type AuthState = 'splash' | 'login' | 'app';

interface UserInfo {
  nombre: string;
  rol: string;
}

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>('splash');

  const handleLogin = (user: UserInfo) => {
    setAuthState('app');
  };

  if (authState === 'splash') {
    return <SplashScreen onIniciar={() => setAuthState('login')} />;
  }

  if (authState === 'login') {
    return (
      <>
        <SplashScreen onIniciar={() => {}} />
        <LoginModal
          onLogin={handleLogin}
          onCancel={() => setAuthState('splash')}
        />
      </>
    );
  }

  return <Layout>{children}</Layout>;
}
