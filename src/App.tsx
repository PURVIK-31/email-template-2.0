import React, { useState } from 'react';
import { Editor } from './components/Editor';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './components/ThemeProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthForm } from './components/AuthForm';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user } = useAuth();

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
          <Toaster 
            position="top-right"
            toastOptions={{
              className: 'dark:bg-gray-800 dark:text-white',
            }} 
          />
          {user ? <Editor /> : <AuthForm />}
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;