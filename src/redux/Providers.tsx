// redux/Providers.tsx

'use client'; 

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { setupAxiosInterceptors } from '@/utils/setupAxiosInterceptors';
import { hydrateAuth, validateSession } from './slices/authSlice';

function AuthHydration({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    setupAxiosInterceptors();
    store.dispatch(hydrateAuth());
    

    const timeoutId = setTimeout(() => {
      store.dispatch(validateSession());
    }, 200); 
    
    return () => clearTimeout(timeoutId);
  }, []);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthHydration>
        {children}
      </AuthHydration>
    </Provider>
  );
}
