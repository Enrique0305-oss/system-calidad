import { useState } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { SplashScreen } from './components/SplashScreen';
import { LoginModal } from './components/LoginModal';

type AuthState = 'splash' | 'login' | 'app';

interface UserInfo {
  nombre: string;
  rol: string;
}

// Store user info globally for use in Layout
export let currentUser: UserInfo = { nombre: 'Ing. García', rol: 'Supervisor de Calidad' };

export default function App() {
  const [authState, setAuthState] = useState<AuthState>('splash');

  const handleLogin = (user: UserInfo) => {
    currentUser = user;
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

  return <RouterProvider router={router} />;
}
