import React, { useState, useEffect } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import authService from './authService';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verifica se l'utente è già autenticato all'avvio e ascolta i cambiamenti
  useEffect(() => {
    // Controlla utente corrente
    const checkUser = async () => {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    checkUser();

    // Listener per cambiamenti di stato auth
    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleLoginSuccess = (user) => {
    setUser(user);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Errore durante il logout:', error);
    }
  };

  if (loading) {
    return (
      <div className="App">
        <div className="loading">Caricamento...</div>
      </div>
    );
  }

  return (
    <div className="App">
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;
