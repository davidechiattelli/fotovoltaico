import React, { useState } from 'react';
import authService from './authService';

function Login({ onLoginSuccess }) {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Reset error quando l'utente inizia a digitare
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.email || !credentials.password) {
      setError('Inserisci email e password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await authService.login(credentials.email, credentials.password);

      if (result.success) {
        onLoginSuccess(result.user);
      }
    } catch (err) {
      setError(err.error || 'Errore durante il login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Accedi al Simulatore</h1>
        <p className="login-subtitle">Inserisci le tue credenziali</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleInputChange}
              placeholder="Inserisci email"
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              placeholder="Inserisci password"
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? 'Accesso in corso...' : 'Accedi'}
          </button>
        </form>

        <div className="demo-credentials">
          <small>
            <strong>Note:</strong> Credenziali di test: User testfotovoltaico@test.it , password qwerty12
          </small>
        </div>
      </div>
    </div>
  );
}

export default Login;
